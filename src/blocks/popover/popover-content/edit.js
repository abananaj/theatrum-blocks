/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [ [ 'core/image' ] ];

export default function Edit( { attributes, setAttributes } ) {
	const { width, widthUnit } = attributes;

	const blockProps = useBlockProps( { className: 'ct-popover__content' } );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		templateLock: false,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Popover Size', 'theatrum-blocks' ) }>
					<div style={ { display: 'flex', gap: '8px' } }>
						<TextControl
							label={ __( 'Width', 'theatrum-blocks' ) }
							value={ width }
							onChange={ ( value ) =>
								setAttributes( { width: value } )
							}
							type="number"
							min="1"
							style={ { flex: 1 } }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						<SelectControl
							label={ __( 'Unit', 'theatrum-blocks' ) }
							value={ widthUnit }
							onChange={ ( value ) =>
								setAttributes( { widthUnit: value } )
							}
							options={ [
								{ label: 'px', value: 'px' },
								{ label: '%', value: '%' },
								{ label: 'em', value: 'em' },
								{ label: 'rem', value: 'rem' },
							] }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</div>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
