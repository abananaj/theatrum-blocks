/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<div style={ { padding: '16px' } }>
					<TextControl
						label="URL Field Key"
						value={ attributes.keyInput || '' }
						onChange={ ( value ) =>
							setAttributes( { keyInput: value } )
						}
						placeholder="e.g., video_link, registration_url"
						help="Enter the meta key that contains the URL"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Button Text"
						value={ attributes.buttonText || '' }
						onChange={ ( value ) =>
							setAttributes( { buttonText: value } )
						}
						placeholder="Learn More"
						help="Text to display on the button"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</div>
			</InspectorControls>
			<div { ...blockProps }>
				{ attributes.keyInput ? (
					<ServerSideRender
						block="chance/meta-button"
						attributes={ attributes }
					/>
				) : (
					<p style={ { color: '#999', fontStyle: 'italic' } }>
						Enter a URL field key in the sidebar
					</p>
				) }
			</div>
		</Fragment>
	);
}
