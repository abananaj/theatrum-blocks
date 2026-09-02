/**
 * Icon List Block Editor (parent). Owns list-wide icon settings (size, position, alignment, spacing, colour, hover), passed down to `theatrum/list-item-icon` children as CSS custom properties so the markup stays static.
 */

import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { getListProps } from './shared';
import './editor.scss';

const TEMPLATE = [
	[
		'theatrum/list-item-icon',
		{ text: __( 'List item', 'theatrum-blocks' ) },
	],
	[
		'theatrum/list-item-icon',
		{ text: __( 'List item', 'theatrum-blocks' ) },
	],
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		iconSize,
		iconSizeUnit,
		iconPosition,
		iconSpacing,
		iconColor,
		iconAlign,
		hoverOnly,
	} = attributes;

	const { className, style } = getListProps( attributes );
	const blockProps = useBlockProps( { className, style } );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'theatrum/list-item-icon' ],
		template: TEMPLATE,
		templateLock: false,
		orientation: 'vertical',
		renderAppender: InnerBlocks.ButtonBlockAppender,
		__experimentalAppenderTagName: 'li',
	} );

	return (
		<Fragment>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Icon Settings', 'theatrum-blocks' ) }
					resetAll={ () => {
						setAttributes( {
							iconSize: '24',
							iconSizeUnit: 'px',
							iconPosition: 'left',
							iconSpacing: '8',
							iconColor: '',
							iconAlign: 'middle',
							hoverOnly: false,
						} );
					} }
				>
					<ToolsPanelItem
						hasValue={ () => iconSize !== '24' }
						label={ __( 'Icon Size', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( {
								iconSize: '24',
								iconSizeUnit: 'px',
							} )
						}
						isShownByDefault={ true }
					>
						<div style={ { display: 'flex', gap: '8px' } }>
							<TextControl
								label={ __( 'Size', 'theatrum-blocks' ) }
								value={ iconSize }
								onChange={ ( value ) =>
									setAttributes( { iconSize: value } )
								}
								type="number"
								min="1"
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								style={ { flex: 1 } }
							/>
							<SelectControl
								label={ __( 'Unit', 'theatrum-blocks' ) }
								value={ iconSizeUnit }
								options={ [
									{ label: 'px', value: 'px' },
									{ label: 'em', value: 'em' },
									{ label: 'rem', value: 'rem' },
									{ label: '%', value: '%' },
								] }
								onChange={ ( value ) =>
									setAttributes( { iconSizeUnit: value } )
								}
								style={ { width: '80px' } }
								__nextHasNoMarginBottom
							/>
						</div>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => iconPosition !== 'left' }
						label={ __( 'Icon Position', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( { iconPosition: 'left' } )
						}
						isShownByDefault={ true }
					>
						<SelectControl
							label={ __( 'Position', 'theatrum-blocks' ) }
							value={ iconPosition }
							options={ [
								{
									label: __( 'Left', 'theatrum-blocks' ),
									value: 'left',
								},
								{
									label: __( 'Top', 'theatrum-blocks' ),
									value: 'top',
								},
								{
									label: __( 'Right', 'theatrum-blocks' ),
									value: 'right',
								},
								{
									label: __( 'Bottom', 'theatrum-blocks' ),
									value: 'bottom',
								},
							] }
							onChange={ ( value ) =>
								setAttributes( { iconPosition: value } )
							}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => iconAlign !== 'middle' }
						label={ __( 'Align', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( { iconAlign: 'middle' } )
						}
						isShownByDefault={ true }
					>
						<SelectControl
							label={ __( 'Align', 'theatrum-blocks' ) }
							value={ iconAlign }
							options={ [
								{
									label: __( 'Top', 'theatrum-blocks' ),
									value: 'top',
								},
								{
									label: __( 'Middle', 'theatrum-blocks' ),
									value: 'middle',
								},
								{
									label: __( 'Bottom', 'theatrum-blocks' ),
									value: 'bottom',
								},
							] }
							onChange={ ( value ) =>
								setAttributes( { iconAlign: value } )
							}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => iconSpacing !== '8' }
						label={ __( 'Icon Spacing', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( { iconSpacing: '8' } )
						}
						isShownByDefault={ false }
					>
						<TextControl
							label={ __( 'Spacing (px)', 'theatrum-blocks' ) }
							value={ iconSpacing }
							onChange={ ( value ) =>
								setAttributes( { iconSpacing: value } )
							}
							type="number"
							min="0"
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => !! iconColor }
						label={ __( 'Icon Color', 'theatrum-blocks' ) }
						onDeselect={ () => setAttributes( { iconColor: '' } ) }
						isShownByDefault={ false }
					>
						<TextControl
							label={ __(
								'Color (hex, rgb, or CSS)',
								'theatrum-blocks'
							) }
							value={ iconColor }
							onChange={ ( value ) =>
								setAttributes( { iconColor: value } )
							}
							placeholder="#000000"
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => hoverOnly }
						label={ __( 'Hover Only', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( { hoverOnly: false } )
						}
						isShownByDefault={ false }
					>
						<ToggleControl
							label={ __(
								'Show icon on hover only',
								'theatrum-blocks'
							) }
							checked={ hoverOnly }
							onChange={ ( value ) =>
								setAttributes( { hoverOnly: value } )
							}
							help={ __(
								'Icons will only display when hovering over the list item',
								'theatrum-blocks'
							) }
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<ul { ...innerBlocksProps } />
		</Fragment>
	);
}
