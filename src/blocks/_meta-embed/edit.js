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
	const { keyInput, embedType } = attributes;
	const isYouTube = embedType === 'youtube';

	const blockProps = useBlockProps();

	const metaKeyLabel = isYouTube ? 'YouTube URL Meta Key' : 'Meta Key';
	const metaKeyHelp = isYouTube
		? 'Enter the meta key whose value is a YouTube URL (e.g. trailer_url)'
		: 'Enter the meta key that contains the URL to embed';

	return (
		<Fragment>
			<InspectorControls>
				<div style={ { padding: '16px' } }>
					<TextControl
						label={ metaKeyLabel }
						value={ keyInput || '' }
						onChange={ ( value ) =>
							setAttributes( { keyInput: value } )
						}
						placeholder="e.g., trailer_url"
						help={ metaKeyHelp }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</div>
			</InspectorControls>
			<div { ...blockProps }>
				{ keyInput ? (
					<ServerSideRender
						block="chance/meta-embed"
						attributes={ attributes }
					/>
				) : (
					<div
						style={ {
							padding: '20px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							textAlign: 'center',
							color: '#999',
						} }
					>
						{ isYouTube
							? 'Enter the meta key that holds the YouTube URL'
							: 'Enter a meta key to display an embedded resource' }
					</div>
				) }
			</div>
		</Fragment>
	);
}
