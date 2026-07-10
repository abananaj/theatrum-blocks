/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { TextControl, ToggleControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<div style={ { padding: '16px' } }>
					<TextControl
						label="Key"
						value={ attributes.keyInput || '' }
						onChange={ ( value ) =>
							setAttributes( { keyInput: value } )
						}
						placeholder="e.g., page_title, description, custom_field"
						help="Enter the key to retrieve the corresponding value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Prepend"
						value={ attributes.prepend || '' }
						onChange={ ( value ) =>
							setAttributes( { prepend: value } )
						}
						placeholder="Text to prepend"
						help="Optional plain text to add before the value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Append"
						value={ attributes.append || '' }
						onChange={ ( value ) =>
							setAttributes( { append: value } )
						}
						placeholder="Text to append"
						help="Optional plain text to add after the value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Display text for value 1"
						value={ attributes.boolTrueText || '' }
						onChange={ ( value ) =>
							setAttributes( { boolTrueText: value } )
						}
						placeholder="e.g., Yes"
						help="If the field's value is 1, show this text instead. Leave blank to show the raw value."
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Display text for value 0"
						value={ attributes.boolFalseText || '' }
						onChange={ ( value ) =>
							setAttributes( { boolFalseText: value } )
						}
						placeholder="e.g., No"
						help="If the field's value is 0, show this text instead. Leave blank to show the raw value."
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<ToggleControl
						label="Hide if empty"
						checked={ attributes.hideIfEmpty || false }
						onChange={ ( value ) =>
							setAttributes( { hideIfEmpty: value } )
						}
						help="Hide the parent container when this field has no value"
					/>
				</div>
			</InspectorControls>
			<div { ...blockProps }>
				{ attributes.keyInput ? (
					<ServerSideRender
						block="chance/meta-field"
						attributes={ attributes }
					/>
				) : (
					<em style={ { color: '#999' } }>
						Enter a key to display its value
					</em>
				) }
			</div>
		</Fragment>
	);
}
