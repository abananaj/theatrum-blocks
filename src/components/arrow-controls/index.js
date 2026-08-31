/**
 * Shared "Arrow Styles" inspector controls — used by theatrum/carousel and
 * theatrum/slider. The two blocks render their arrows very differently (an
 * SVG-mask chevron button vs. a glyph-text button), but expose the same
 * user-facing options: position, background on/off, color, background
 * color, and size. Each block supplies its own attribute defaults (via
 * block.json) and its own CSS custom-property prefix (see
 * get-arrow-style-vars.js) so this component stays block-agnostic.
 */
import {
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const POSITION_LABELS = {
	outside: __( 'Outside', 'theatrum-blocks' ),
	inside: __( 'Inside', 'theatrum-blocks' ),
	hidden: __( 'Hidden', 'theatrum-blocks' ),
};

const UNIT_OPTIONS = [
	{ label: 'px', value: 'px' },
	{ label: '%', value: '%' },
	{ label: 'em', value: 'em' },
	{ label: 'rem', value: 'rem' },
];

/**
 * @param {Object}   props
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Block `setAttributes`.
 * @param {string[]} [props.positions]   Which arrow-position options to
 *                                       offer, in order (default: all three).
 */
export default function ArrowControls( {
	attributes,
	setAttributes,
	positions = [ 'outside', 'inside', 'hidden' ],
} ) {
	const {
		arrowPosition,
		arrowBackground,
		arrowColor,
		arrowBackgroundColor,
		arrowSize,
		arrowSizeUnit,
	} = attributes;

	const positionOptions = positions.map( ( value ) => ( {
		label: POSITION_LABELS[ value ],
		value,
	} ) );

	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Arrow Styles', 'theatrum-blocks' ) }
				initialOpen={ false }
			>
				<SelectControl
					label={ __( 'Arrow Position', 'theatrum-blocks' ) }
					value={ arrowPosition }
					options={ positionOptions }
					onChange={ ( value ) =>
						setAttributes( { arrowPosition: value } )
					}
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					label={ __( 'Arrow Background', 'theatrum-blocks' ) }
					checked={ !! arrowBackground }
					onChange={ ( value ) =>
						setAttributes( { arrowBackground: value } )
					}
					__nextHasNoMarginBottom
				/>
				<div style={ { display: 'flex', gap: '8px' } }>
					<TextControl
						label={ __( 'Arrow Size', 'theatrum-blocks' ) }
						value={ arrowSize }
						onChange={ ( value ) =>
							setAttributes( { arrowSize: value } )
						}
						type="number"
						min="0"
						help={ __(
							'Leave empty for the default size.',
							'theatrum-blocks'
						) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						style={ { flex: 1 } }
					/>
					<SelectControl
						label={ __( 'Unit', 'theatrum-blocks' ) }
						value={ arrowSizeUnit }
						options={ UNIT_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { arrowSizeUnit: value } )
						}
						__nextHasNoMarginBottom
						style={ { width: '80px' } }
					/>
				</div>
			</PanelBody>
			<PanelColorSettings
				title={ __( 'Arrow Colors', 'theatrum-blocks' ) }
				initialOpen={ false }
				colorSettings={ [
					{
						value: arrowColor,
						onChange: ( value ) =>
							setAttributes( { arrowColor: value } ),
						label: __( 'Arrow Color', 'theatrum-blocks' ),
					},
					{
						value: arrowBackgroundColor,
						onChange: ( value ) =>
							setAttributes( {
								arrowBackgroundColor: value,
							} ),
						label: __(
							'Arrow Background Color',
							'theatrum-blocks'
						),
					},
				] }
			/>
		</InspectorControls>
	);
}
