/**
 * Shared "Arrow Styles" inspector controls — used by theatrum/carousel, theatrum/slider, and the
 * is-style-ct-carousel format (each renders arrows differently but exposes the same options).
 * Consumers supply their own defaults, CSS prefix (get-arrow-style-vars.js), and optional
 * attributePrefix (attr-key.js), keeping this component block- and attribute-name-agnostic.
 */
import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import attrKey from './attr-key';

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
 * @param {Object}   props.attributes        Block attributes.
 * @param {Function} props.setAttributes     Block `setAttributes`.
 * @param {string[]} [props.positions]       Which arrow-position options to
 *                                           offer, in order (default: all three).
 * @param {string}   [props.attributePrefix] Namespace prefix for the
 *                                           underlying attribute names (see
 *                                           attr-key.js). Default '' reads/
 *                                           writes the bare `arrowPosition`
 *                                           etc. names the native blocks use.
 */
export default function ArrowControls( {
	attributes,
	setAttributes,
	positions = [ 'outside', 'inside', 'hidden' ],
	attributePrefix = '',
} ) {
	const positionKey = attrKey( attributePrefix, 'ArrowPosition' );
	const backgroundKey = attrKey( attributePrefix, 'ArrowBackground' );
	const colorKey = attrKey( attributePrefix, 'ArrowColor' );
	const backgroundColorKey = attrKey(
		attributePrefix,
		'ArrowBackgroundColor'
	);
	const sizeKey = attrKey( attributePrefix, 'ArrowSize' );
	const sizeUnitKey = attrKey( attributePrefix, 'ArrowSizeUnit' );

	const arrowPosition = attributes[ positionKey ];
	const arrowBackground = attributes[ backgroundKey ];
	const arrowColor = attributes[ colorKey ];
	const arrowBackgroundColor = attributes[ backgroundColorKey ];
	const arrowSize = attributes[ sizeKey ];
	const arrowSizeUnit = attributes[ sizeUnitKey ];

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
						setAttributes( { [ positionKey ]: value } )
					}
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					label={ __( 'Arrow Background', 'theatrum-blocks' ) }
					checked={ !! arrowBackground }
					onChange={ ( value ) =>
						setAttributes( { [ backgroundKey ]: value } )
					}
					__nextHasNoMarginBottom
				/>
				<div style={ { display: 'flex', gap: '8px' } }>
					<TextControl
						label={ __( 'Arrow Size', 'theatrum-blocks' ) }
						value={ arrowSize }
						onChange={ ( value ) =>
							setAttributes( { [ sizeKey ]: value } )
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
							setAttributes( { [ sizeUnitKey ]: value } )
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
							setAttributes( { [ colorKey ]: value } ),
						label: __( 'Arrow Color', 'theatrum-blocks' ),
					},
					{
						value: arrowBackgroundColor,
						onChange: ( value ) =>
							setAttributes( {
								[ backgroundColorKey ]: value,
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
