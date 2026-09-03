/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	SelectControl,
	ToggleControl,
	RangeControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	PanelBody,
	TextControl,
	Spinner,
	Flex,
	FlexItem,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	BlockControls,
} from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { IMAGE_SIZE_OPTIONS } from '../../utils/image-size-options';
import './editor.scss';

const LINK_OPTIONS = [
	{ label: 'None', value: 'none' },
	{ label: 'Media Files', value: 'media' },
	{ label: 'Attachment Pages', value: 'attachment' },
];

const SIZE_OPTIONS = [
	...IMAGE_SIZE_OPTIONS,
	{ label: 'Custom', value: 'custom' },
];

export default function Edit( { attributes, setAttributes, context } ) {
	const {
		metaKey,
		sizeSlug,
		columns,
		columnsTablet,
		columnsMobile,
		linkTo,
		imageCrop,
		fixedHeight,
		randomOrder,
		imageLimit,
		navigationButtonType,
		allowResize,
		aspectRatio,
		customWidth,
		customHeight,
		fallbackText,
	} = attributes;

	const blockProps = useBlockProps();
	const [ images, setImages ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( false );

	const editorPostId = useSelect( ( select ) =>
		select( 'core/editor' ).getCurrentPostId()
	);
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

	// Fetch images from meta/ACF
	useEffect( () => {
		const trimmedKey = metaKey?.trim();

		if ( ! trimmedKey || ! postId ) {
			setImages( [] );
			return;
		}

		setIsLoading( true );

		const size = sizeSlug || 'large';
		let path = `/theatrum/v1/meta-gallery/${ postId }/${ encodeURIComponent(
			trimmedKey
		) }?size=${ size }`;

		if ( size === 'custom' && customWidth && customHeight ) {
			path += `&width=${ customWidth }&height=${ customHeight }`;
		}

		apiFetch( { path } )
			.then( ( data ) => {
				let imageList = Array.isArray( data.images ) ? data.images : [];
				if ( randomOrder ) {
					imageList = [ ...imageList ].sort(
						() => Math.random() - 0.5
					);
				}
				if ( imageLimit ) {
					imageList = imageList.slice( 0, imageLimit );
				}
				setImages( imageList );
				setIsLoading( false );
			} )
			.catch( () => {
				setImages( [] );
				setIsLoading( false );
			} );
	}, [
		metaKey,
		postId,
		randomOrder,
		sizeSlug,
		customWidth,
		customHeight,
		imageLimit,
	] );

	// Desktop/tablet/mobile column counts fall back down the chain (mirrors the CSS custom-property fallback in style.scss/editor.scss).
	const numColumns = columns || 3;
	const numColumnsTablet = columnsTablet || numColumns;
	const numColumnsMobile = columnsMobile || numColumnsTablet;
	const gap = 16;

	const galleryClasses = clsx(
		'wp-block-gallery',
		'has-nested-images',
		'blocks-gallery-grid',
		{
			'is-cropped': imageCrop,
		}
	);

	const gridStyle = {
		listStyle: 'none',
		margin: 0,
		padding: 0,
		'--wp--style--unstable-gallery-gap': `${ gap }px`,
		'--theatrum-gallery-columns': numColumns,
		'--theatrum-gallery-columns-tablet': numColumnsTablet,
		'--theatrum-gallery-columns-mobile': numColumnsMobile,
	};

	return (
		<Fragment>
			<BlockControls>
				{ /* Block toolbar controls could go here */ }
			</BlockControls>

			<InspectorControls>
				<ToolsPanel
					label={ __( 'Gallery settings', 'theatrum-blocks' ) }
					panelId="theatrum/meta-gallery"
					resetAll={ () => {
						setAttributes( {
							metaKey: '',
							sizeSlug: 'large',
							columns: undefined,
							columnsTablet: undefined,
							columnsMobile: undefined,
							linkTo: 'none',
							imageCrop: true,
							fixedHeight: true,
							randomOrder: false,
							imageLimit: undefined,
							navigationButtonType: 'icon',
							allowResize: false,
							aspectRatio: 'auto',
							customWidth: undefined,
							customHeight: undefined,
						} );
					} }
				>
					<ToolsPanelItem
						isShownByDefault
						hasValue={ () => metaKey !== '' }
						label={ __( 'Meta Key', 'theatrum-blocks' ) }
						panelId="theatrum/meta-gallery"
						onDeselect={ () => setAttributes( { metaKey: '' } ) }
					>
						<TextControl
							label={ __( 'Meta Key', 'theatrum-blocks' ) }
							value={ metaKey || '' }
							onChange={ ( value ) =>
								setAttributes( { metaKey: value.trim() } )
							}
							placeholder="e.g., production_gallery"
							help={ __(
								'ACF or post meta field key',
								'theatrum-blocks'
							) }
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						isShownByDefault
						hasValue={ () => columns !== undefined }
						label={ __( 'Columns', 'theatrum-blocks' ) }
						panelId="theatrum/meta-gallery"
						onDeselect={ () =>
							setAttributes( { columns: undefined } )
						}
					>
						<RangeControl
							label={ __( 'Columns', 'theatrum-blocks' ) }
							value={ columns || 3 }
							onChange={ ( value ) =>
								setAttributes( { columns: value } )
							}
							min={ 1 }
							max={ 8 }
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						isShownByDefault
						hasValue={ () => columnsTablet !== undefined }
						label={ __( 'Columns (Tablet)', 'theatrum-blocks' ) }
						panelId="theatrum/meta-gallery"
						onDeselect={ () =>
							setAttributes( { columnsTablet: undefined } )
						}
					>
						<RangeControl
							label={ __(
								'Columns (Tablet)',
								'theatrum-blocks'
							) }
							value={ columnsTablet || numColumns }
							onChange={ ( value ) =>
								setAttributes( { columnsTablet: value } )
							}
							min={ 1 }
							max={ 8 }
							help={ __(
								'Applies at tablet widths (781px and below). Defaults to the desktop column count.',
								'theatrum-blocks'
							) }
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						isShownByDefault
						hasValue={ () => columnsMobile !== undefined }
						label={ __( 'Columns (Mobile)', 'theatrum-blocks' ) }
						panelId="theatrum/meta-gallery"
						onDeselect={ () =>
							setAttributes( { columnsMobile: undefined } )
						}
					>
						<RangeControl
							label={ __(
								'Columns (Mobile)',
								'theatrum-blocks'
							) }
							value={ columnsMobile || numColumnsTablet }
							onChange={ ( value ) =>
								setAttributes( { columnsMobile: value } )
							}
							min={ 1 }
							max={ 8 }
							help={ __(
								'Applies at mobile widths (599px and below). Defaults to the tablet column count.',
								'theatrum-blocks'
							) }
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						isShownByDefault
						hasValue={ () => sizeSlug !== 'large' }
						label={ __( 'Image Size', 'theatrum-blocks' ) }
						panelId="theatrum/meta-gallery"
						onDeselect={ () =>
							setAttributes( { sizeSlug: 'large' } )
						}
					>
						<SelectControl
							label={ __( 'Image Size', 'theatrum-blocks' ) }
							value={ sizeSlug || 'large' }
							onChange={ ( value ) =>
								setAttributes( { sizeSlug: value } )
							}
							options={ SIZE_OPTIONS }
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					{ sizeSlug === 'custom' && (
						<ToolsPanelItem
							isShownByDefault
							hasValue={ () => !! customWidth || !! customHeight }
							label={ __(
								'Custom Resolution',
								'theatrum-blocks'
							) }
							panelId="theatrum/meta-gallery"
							onDeselect={ () =>
								setAttributes( {
									customWidth: undefined,
									customHeight: undefined,
								} )
							}
						>
							<Flex>
								<FlexItem isBlock>
									<TextControl
										label={ __(
											'Width (px)',
											'theatrum-blocks'
										) }
										type="number"
										min={ 1 }
										value={ customWidth || '' }
										onChange={ ( value ) =>
											setAttributes( {
												customWidth: value
													? parseInt( value, 10 )
													: undefined,
											} )
										}
										__nextHasNoMarginBottom
									/>
								</FlexItem>
								<FlexItem isBlock>
									<TextControl
										label={ __(
											'Height (px)',
											'theatrum-blocks'
										) }
										type="number"
										min={ 1 }
										value={ customHeight || '' }
										onChange={ ( value ) =>
											setAttributes( {
												customHeight: value
													? parseInt( value, 10 )
													: undefined,
											} )
										}
										__nextHasNoMarginBottom
									/>
								</FlexItem>
							</Flex>
							<p className="components-base-control__help">
								{ __(
									'Requests the closest generated image size to these dimensions.',
									'theatrum-blocks'
								) }
							</p>
						</ToolsPanelItem>
					) }

					<ToolsPanelItem
						isShownByDefault
						hasValue={ () => linkTo !== 'none' }
						label={ __( 'Link To', 'theatrum-blocks' ) }
						panelId="theatrum/meta-gallery"
						onDeselect={ () => setAttributes( { linkTo: 'none' } ) }
					>
						<SelectControl
							label={ __( 'Link Images To', 'theatrum-blocks' ) }
							value={ linkTo || 'none' }
							onChange={ ( value ) =>
								setAttributes( { linkTo: value } )
							}
							options={ LINK_OPTIONS }
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						isShownByDefault
						hasValue={ () => imageCrop !== true }
						label={ __( 'Image Crop', 'theatrum-blocks' ) }
						panelId="theatrum/meta-gallery"
						onDeselect={ () =>
							setAttributes( { imageCrop: true } )
						}
					>
						<ToggleControl
							label={ __(
								'Crop images to same height',
								'theatrum-blocks'
							) }
							checked={ imageCrop }
							onChange={ ( value ) =>
								setAttributes( { imageCrop: value } )
							}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						isShownByDefault
						hasValue={ () => fixedHeight !== true }
						label={ __( 'Fixed Height', 'theatrum-blocks' ) }
						panelId="theatrum/meta-gallery"
						onDeselect={ () =>
							setAttributes( { fixedHeight: true } )
						}
					>
						<ToggleControl
							label={ __( 'Fixed height', 'theatrum-blocks' ) }
							checked={ fixedHeight }
							onChange={ ( value ) =>
								setAttributes( { fixedHeight: value } )
							}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						isShownByDefault
						hasValue={ () => randomOrder !== false }
						label={ __( 'Random Order', 'theatrum-blocks' ) }
						panelId="theatrum/meta-gallery"
						onDeselect={ () =>
							setAttributes( { randomOrder: false } )
						}
					>
						<ToggleControl
							label={ __( 'Random order', 'theatrum-blocks' ) }
							checked={ randomOrder }
							onChange={ ( value ) =>
								setAttributes( { randomOrder: value } )
							}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						isShownByDefault
						hasValue={ () => !! imageLimit }
						label={ __( 'Limit', 'theatrum-blocks' ) }
						panelId="theatrum/meta-gallery"
						onDeselect={ () =>
							setAttributes( { imageLimit: undefined } )
						}
					>
						<TextControl
							label={ __(
								'Limit number of images',
								'theatrum-blocks'
							) }
							type="number"
							min={ 1 }
							value={ imageLimit || '' }
							onChange={ ( value ) =>
								setAttributes( {
									imageLimit: value
										? parseInt( value, 10 )
										: undefined,
								} )
							}
							placeholder={ __( 'All', 'theatrum-blocks' ) }
							help={ __(
								'Maximum number of images to display. Leave empty to show all.',
								'theatrum-blocks'
							) }
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						isShownByDefault
						hasValue={ () => navigationButtonType !== 'icon' }
						label={ __( 'Navigation Buttons', 'theatrum-blocks' ) }
						panelId="theatrum/meta-gallery"
						onDeselect={ () =>
							setAttributes( { navigationButtonType: 'icon' } )
						}
					>
						<ToggleGroupControl
							label={ __(
								'Navigation buttons',
								'theatrum-blocks'
							) }
							value={ navigationButtonType }
							onChange={ ( value ) =>
								setAttributes( { navigationButtonType: value } )
							}
							isBlock
							__nextHasNoMarginBottom
						>
							<ToggleGroupControlOption
								value="icon"
								label={ __( 'Icon', 'theatrum-blocks' ) }
							/>
							<ToggleGroupControlOption
								value="text"
								label={ __( 'Text', 'theatrum-blocks' ) }
							/>
							<ToggleGroupControlOption
								value="both"
								label={ __( 'Both', 'theatrum-blocks' ) }
							/>
						</ToggleGroupControl>
					</ToolsPanelItem>

					<ToolsPanelItem
						isShownByDefault
						hasValue={ () => aspectRatio !== 'auto' }
						label={ __( 'Aspect Ratio', 'theatrum-blocks' ) }
						panelId="theatrum/meta-gallery"
						onDeselect={ () =>
							setAttributes( { aspectRatio: 'auto' } )
						}
					>
						<SelectControl
							label={ __( 'Aspect Ratio', 'theatrum-blocks' ) }
							value={ aspectRatio || 'auto' }
							onChange={ ( value ) =>
								setAttributes( { aspectRatio: value } )
							}
							options={ [
								{
									label: __( 'Original', 'theatrum-blocks' ),
									value: 'auto',
								},
								{ label: '1:1', value: '1' },
								{ label: '3:2', value: '1.5' },
								{ label: '4:3', value: '1.333' },
								{ label: '16:9', value: '1.777' },
								{ label: '9:16', value: '0.5625' },
							] }
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						isShownByDefault
						hasValue={ () => allowResize !== false }
						label={ __( 'Allow Resize', 'theatrum-blocks' ) }
						panelId="theatrum/meta-gallery"
						onDeselect={ () =>
							setAttributes( { allowResize: false } )
						}
					>
						<ToggleControl
							label={ __( 'Allow resize', 'theatrum-blocks' ) }
							checked={ allowResize }
							onChange={ ( value ) =>
								setAttributes( { allowResize: value } )
							}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>
				</ToolsPanel>

				<PanelBody
					title={ __( 'Fallback', 'theatrum-blocks' ) }
					initialOpen={ false }
				>
					<TextControl
						label={ __( 'Fallback Text', 'theatrum-blocks' ) }
						value={ fallbackText || '' }
						onChange={ ( value ) =>
							setAttributes( { fallbackText: value } )
						}
						placeholder={ __(
							'Optional text if no images are found',
							'theatrum-blocks'
						) }
						help={ __(
							'Leave empty to hide the block when no images are found',
							'theatrum-blocks'
						) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<figure { ...blockProps }>
				{ isLoading && (
					<div
						style={ {
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							minHeight: '200px',
						} }
					>
						<Spinner />
					</div>
				) }

				{ ! isLoading && images.length > 0 && (
					<ul className={ galleryClasses } style={ gridStyle }>
						{ images.map( ( img, idx ) => (
							<li key={ idx } className="blocks-gallery-item">
								<figure
									style={ {
										margin: 0,
										display: 'flex',
										flexDirection: 'column',
										position: 'relative',
										maxWidth: '100%',
										boxSizing: 'border-box',
										overflow: 'hidden',
										backgroundColor: '#f0f0f0',
										aspectRatio:
											aspectRatio &&
											aspectRatio !== 'auto'
												? aspectRatio
												: undefined,
									} }
								>
									{ /* No inline sizing/crop styles — driven by shared .wp-block-gallery/.is-cropped CSS (style.scss) matching render.php's output; inline styles would override CSS regardless of specificity. */ }
									<img
										src={ img.url }
										alt={ img.alt || '' }
										data-id={ img.id }
										data-full-url={ img.fullUrl || img.url }
										data-link={ img.link || '' }
									/>
									{ img.caption && (
										<figcaption
											className="blocks-gallery-item__caption"
											style={ {
												position: 'absolute',
												bottom: 0,
												left: 0,
												right: 0,
												margin: 0,
												padding: '1em',
												color: '#fff',
												fontSize: '13px',
												textAlign: 'center',
												boxSizing: 'border-box',
												background:
													'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, transparent 100%)',
												textShadow: '0 0 1.5px #000',
											} }
										>
											{ img.caption }
										</figcaption>
									) }
								</figure>
							</li>
						) ) }
					</ul>
				) }

				{ ! isLoading &&
					images.length === 0 &&
					metaKey &&
					fallbackText && (
						<div style={ { color: '#666' } }>{ fallbackText }</div>
					) }

				{ ! isLoading &&
					images.length === 0 &&
					metaKey &&
					! fallbackText && <div>{ `[${ metaKey }]` }</div> }

				{ ! isLoading && images.length === 0 && ! metaKey && (
					<div style={ { color: '#999', fontStyle: 'italic' } }>
						{ __(
							'Enter a meta key to display images',
							'theatrum-blocks'
						) }
					</div>
				) }
			</figure>
		</Fragment>
	);
}
