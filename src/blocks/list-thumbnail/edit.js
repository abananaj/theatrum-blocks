/**
 * Thumbnail List Block Editor (parent)
 *
 * A list wrapper whose items are individual `theatrum/list-item-thumbnail`
 * child blocks (title, description, thumbnail image — each editable inline
 * or via its own Inspector, with native WP reordering/drag-and-drop). The
 * parent owns the list-wide settings (thumbnail position/size, item height,
 * animation speed) and the flip-card preview panel that mirrors the
 * frontend's hover interaction.
 *
 * Layout/geometry (item height, thumbnail dimensions, hover transitions) is
 * driven entirely by CSS custom properties from shared.js and consumed by
 * style.scss, which loads in both the editor canvas and the frontend via the
 * block.json `style` field — so this component only needs to reproduce the
 * *dynamic* hover behaviour, not the static layout.
 */

import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { Fragment, useState, useEffect } from '@wordpress/element';
import {
	TextControl,
	ButtonGroup,
	Button,
	SelectControl,
	RangeControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { getThumbnailListProps } from './shared';
import './editor.scss';

const TEMPLATE = [
	[ 'theatrum/list-item-thumbnail' ],
	[ 'theatrum/list-item-thumbnail' ],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		thumbnailWidth,
		thumbnailWidthUnit,
		thumbnailHeight,
		thumbnailHeightUnit,
		itemHeight,
		itemHeightUnit,
		thumbnailPosition,
		animationSpeed,
		imageSizeSlug,
		thumbnailAspectRatio,
		thumbnailObjectFit,
	} = attributes;

	const { className, style } = getThumbnailListProps( attributes );
	const blockProps = useBlockProps( { className, style } );

	// Read the child blocks directly from the editor store so the flip
	// preview can react to hover without each child needing to know its own
	// position or expose a callback prop (InnerBlocks children are rendered
	// by the block editor, not by us).
	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);

	// Registered WP image sizes (Thumbnail/Medium/Large/Full + any custom
	// sizes), same source core/image uses for its own size dropdown.
	const imageSizeOptions = useSelect( ( select ) => {
		const sizes = select( blockEditorStore ).getSettings().imageSizes || [];
		return sizes.map( ( { slug, name } ) => ( {
			label: name,
			value: slug,
		} ) );
	}, [] );

	const [ hoverIndex, setHoverIndex ] = useState( 0 );
	const [ faces, setFaces ] = useState( { front: null, back: null } );

	// Seed the front face with the first item so the preview isn't blank.
	useEffect( () => {
		if ( innerBlocks.length > 0 ) {
			setFaces( ( prev ) =>
				prev.front
					? prev
					: { front: innerBlocks[ 0 ].attributes, back: null }
			);
		}
	}, [ innerBlocks ] );

	const updateFlip = ( index ) => {
		const block = innerBlocks[ index ];
		if ( ! block ) {
			return;
		}
		setHoverIndex( index );
		setFaces( ( prev ) =>
			index % 2
				? { ...prev, back: block.attributes }
				: { ...prev, front: block.attributes }
		);
	};

	// Event delegation: WP wraps every rendered block (including our
	// InnerBlocks children) with a `data-block="<clientId>"` attribute, so we
	// can find which item was hovered without the child needing to report it.
	const handleMouseOver = ( event ) => {
		const itemEl = event.target.closest( '[data-block]' );
		if ( ! itemEl ) {
			return;
		}
		const index = innerBlocks.findIndex(
			( block ) => block.clientId === itemEl.dataset.block
		);
		if ( index !== -1 ) {
			updateFlip( index );
		}
	};

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'list-items', onMouseOver: handleMouseOver },
		{
			allowedBlocks: [ 'theatrum/list-item-thumbnail' ],
			template: TEMPLATE,
			templateLock: false,
			orientation: 'vertical',
			renderAppender: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<Fragment>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Display Settings', 'theatrum-blocks' ) }
					resetAll={ () => {
						setAttributes( {
							thumbnailWidth: '400',
							thumbnailWidthUnit: 'px',
							thumbnailHeight: '300',
							thumbnailHeightUnit: 'px',
							itemHeight: '80',
							itemHeightUnit: 'px',
							thumbnailPosition: 'right',
							animationSpeed: '0.3',
						} );
					} }
				>
					<ToolsPanelItem
						hasValue={ () => thumbnailPosition !== 'right' }
						label={ __( 'Thumbnail Position', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( { thumbnailPosition: 'right' } )
						}
						isShownByDefault={ true }
					>
						<ButtonGroup>
							{ [
								{
									label: __( 'Left', 'theatrum-blocks' ),
									value: 'left',
								},
								{
									label: __( 'Right', 'theatrum-blocks' ),
									value: 'right',
								},
							].map( ( option ) => (
								<Button
									key={ option.value }
									isPrimary={
										thumbnailPosition === option.value
									}
									isSecondary={
										thumbnailPosition !== option.value
									}
									onClick={ () =>
										setAttributes( {
											thumbnailPosition: option.value,
										} )
									}
								>
									{ option.label }
								</Button>
							) ) }
						</ButtonGroup>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => itemHeight !== '80' }
						label={ __( 'Item Height', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( { itemHeight: '80' } )
						}
						isShownByDefault={ false }
					>
						<div
							style={ {
								display: 'flex',
								gap: '8px',
								alignItems: 'center',
							} }
						>
							<RangeControl
								label={ __( 'Item Height', 'theatrum-blocks' ) }
								value={ parseInt( itemHeight ) }
								onChange={ ( value ) =>
									setAttributes( {
										itemHeight: value.toString(),
									} )
								}
								min={ 40 }
								max={ 200 }
								step={ 10 }
								style={ { flex: 1 } }
							/>
							<SelectControl
								value={ itemHeightUnit }
								options={ [
									{ label: 'px', value: 'px' },
									{ label: 'em', value: 'em' },
									{ label: 'rem', value: 'rem' },
								] }
								onChange={ ( value ) =>
									setAttributes( { itemHeightUnit: value } )
								}
								style={ { width: '80px' } }
							/>
						</div>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => thumbnailWidth !== '400' }
						label={ __( 'Thumbnail Width', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( {
								thumbnailWidth: '400',
								thumbnailWidthUnit: 'px',
							} )
						}
						isShownByDefault={ false }
					>
						<div
							style={ {
								display: 'flex',
								gap: '8px',
								alignItems: 'center',
							} }
						>
							<TextControl
								label={ __( 'Width', 'theatrum-blocks' ) }
								value={ thumbnailWidth }
								onChange={ ( value ) =>
									setAttributes( { thumbnailWidth: value } )
								}
								type="number"
								style={ { flex: 1 } }
							/>
							<SelectControl
								value={ thumbnailWidthUnit }
								options={ [
									{ label: 'px', value: 'px' },
									{ label: '%', value: '%' },
									{ label: 'em', value: 'em' },
									{ label: 'rem', value: 'rem' },
								] }
								onChange={ ( value ) =>
									setAttributes( {
										thumbnailWidthUnit: value,
									} )
								}
								style={ { width: '80px' } }
							/>
						</div>
					</ToolsPanelItem>

					{ thumbnailAspectRatio === 'auto' && (
						<ToolsPanelItem
							hasValue={ () => thumbnailHeight !== '300' }
							label={ __(
								'Thumbnail Height',
								'theatrum-blocks'
							) }
							onDeselect={ () =>
								setAttributes( {
									thumbnailHeight: '300',
									thumbnailHeightUnit: 'px',
								} )
							}
							isShownByDefault={ false }
						>
							<div
								style={ {
									display: 'flex',
									gap: '8px',
									alignItems: 'center',
								} }
							>
								<TextControl
									label={ __( 'Height', 'theatrum-blocks' ) }
									value={ thumbnailHeight }
									onChange={ ( value ) =>
										setAttributes( {
											thumbnailHeight: value,
										} )
									}
									type="number"
									style={ { flex: 1 } }
								/>
								<SelectControl
									value={ thumbnailHeightUnit }
									options={ [
										{ label: 'px', value: 'px' },
										{ label: 'em', value: 'em' },
										{ label: 'rem', value: 'rem' },
									] }
									onChange={ ( value ) =>
										setAttributes( {
											thumbnailHeightUnit: value,
										} )
									}
									style={ { width: '80px' } }
								/>
							</div>
						</ToolsPanelItem>
					) }

					<ToolsPanelItem
						hasValue={ () => animationSpeed !== '0.3' }
						label={ __( 'Animation Speed', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( { animationSpeed: '0.3' } )
						}
						isShownByDefault={ false }
					>
						<SelectControl
							label={ __( 'Speed', 'theatrum-blocks' ) }
							value={ animationSpeed }
							options={ [
								{
									label: __(
										'Fast (0.2s)',
										'theatrum-blocks'
									),
									value: '0.2',
								},
								{
									label: __(
										'Normal (0.3s)',
										'theatrum-blocks'
									),
									value: '0.3',
								},
								{
									label: __(
										'Slow (0.5s)',
										'theatrum-blocks'
									),
									value: '0.5',
								},
								{
									label: __(
										'Very Slow (1s)',
										'theatrum-blocks'
									),
									value: '1',
								},
							] }
							onChange={ ( value ) =>
								setAttributes( { animationSpeed: value } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>

				<ToolsPanel
					label={ __( 'Image Settings', 'theatrum-blocks' ) }
					resetAll={ () => {
						setAttributes( {
							imageSizeSlug: 'full',
							thumbnailAspectRatio: 'auto',
							thumbnailObjectFit: 'cover',
						} );
					} }
				>
					<ToolsPanelItem
						hasValue={ () => imageSizeSlug !== 'full' }
						label={ __( 'Resolution', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( { imageSizeSlug: 'full' } )
						}
						isShownByDefault={ true }
					>
						<SelectControl
							label={ __( 'Resolution', 'theatrum-blocks' ) }
							help={ __(
								'The size of image to load for every item — smaller sizes load faster.',
								'theatrum-blocks'
							) }
							value={ imageSizeSlug }
							options={ imageSizeOptions }
							onChange={ ( value ) =>
								setAttributes( { imageSizeSlug: value } )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => thumbnailAspectRatio !== 'auto' }
						label={ __( 'Aspect Ratio', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( { thumbnailAspectRatio: 'auto' } )
						}
						isShownByDefault={ true }
					>
						<SelectControl
							label={ __( 'Aspect Ratio', 'theatrum-blocks' ) }
							help={ __(
								'"Auto" uses the Thumbnail Height above; any other ratio derives height from width instead.',
								'theatrum-blocks'
							) }
							value={ thumbnailAspectRatio }
							options={ [
								{
									label: __(
										'Auto (use Thumbnail Height)',
										'theatrum-blocks'
									),
									value: 'auto',
								},
								{
									label: __(
										'Square (1:1)',
										'theatrum-blocks'
									),
									value: '1',
								},
								{
									label: __(
										'Standard (4:3)',
										'theatrum-blocks'
									),
									value: '4/3',
								},
								{
									label: __(
										'Portrait (3:4)',
										'theatrum-blocks'
									),
									value: '3/4',
								},
								{
									label: __(
										'Widescreen (16:9)',
										'theatrum-blocks'
									),
									value: '16/9',
								},
								{
									label: __(
										'Vertical (9:16)',
										'theatrum-blocks'
									),
									value: '9/16',
								},
							] }
							onChange={ ( value ) =>
								setAttributes( { thumbnailAspectRatio: value } )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => thumbnailObjectFit !== 'cover' }
						label={ __( 'Object Fit', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( { thumbnailObjectFit: 'cover' } )
						}
						isShownByDefault={ true }
					>
						<SelectControl
							label={ __( 'Object Fit', 'theatrum-blocks' ) }
							value={ thumbnailObjectFit }
							options={ [
								{
									label: __(
										'Cover (crop to fill)',
										'theatrum-blocks'
									),
									value: 'cover',
								},
								{
									label: __(
										'Contain (fit within, may letterbox)',
										'theatrum-blocks'
									),
									value: 'contain',
								},
								{
									label: __(
										'Fill (stretch to fill)',
										'theatrum-blocks'
									),
									value: 'fill',
								},
							] }
							onChange={ ( value ) =>
								setAttributes( { thumbnailObjectFit: value } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="thumbnail-list-wrapper">
					<div { ...innerBlocksProps } />

					<div
						className="thumbnail-container"
						style={ {
							order: thumbnailPosition === 'left' ? -1 : 0,
						} }
					>
						<div
							className="thumbnail-flipper"
							style={ {
								transform: `rotateX(${ hoverIndex * -180 }deg)`,
							} }
						>
							<img
								className="thumbnail thumbnail-front"
								src={ faces.front?.thumbnailUrl || '' }
								alt={ faces.front?.thumbnailAlt || '' }
							/>
							<img
								className="thumbnail thumbnail-back"
								src={ faces.back?.thumbnailUrl || '' }
								alt={ faces.back?.thumbnailAlt || '' }
							/>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}
