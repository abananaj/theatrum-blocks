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
						label="Meta Key"
						value={ attributes.keyInput || '' }
						onChange={ ( value ) =>
							setAttributes( { keyInput: value } )
						}
						placeholder="e.g., document, pdf_file"
						help="Enter the ACF/meta key for the file field"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Link Text"
						value={ attributes.linkText || 'Open File' }
						onChange={ ( value ) =>
							setAttributes( { linkText: value } )
						}
						placeholder="Open File"
						help="The text to display for the link"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Fallback Text"
						value={ attributes.fallbackText || '' }
						onChange={ ( value ) =>
							setAttributes( { fallbackText: value } )
						}
						placeholder="Optional text if no file is found"
						help="Leave empty to hide the block when no file is found"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<ToggleControl
						label="Open in new tab"
						checked={ attributes.openInNewTab !== false }
						onChange={ ( value ) =>
							setAttributes( { openInNewTab: value } )
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label="Show file icon"
						checked={ attributes.showIcon !== false }
						onChange={ ( value ) =>
							setAttributes( { showIcon: value } )
						}
						__nextHasNoMarginBottom
					/>
				</div>
			</InspectorControls>
			<div { ...blockProps }>
				{ attributes.keyInput ? (
					<ServerSideRender
						block="chance/meta-file"
						attributes={ attributes }
					/>
				) : (
					<div
						style={ {
							textAlign: 'center',
							color: '#ccc',
							padding: '20px',
							fontSize: '14px',
						} }
					>
						Enter a meta key in the sidebar
					</div>
				) }
			</div>
		</Fragment>
	);
}
