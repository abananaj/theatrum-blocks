import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import {
	TextControl,
	ToggleControl,
	SelectControl,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit( { attributes, setAttributes, context } ) {
	const blockProps = useBlockProps();
	const [ files, setFiles ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( false );
	const linkTextSource = attributes.linkTextSource || 'custom';
	const showAsList = attributes.showAsList !== false;

	const editorPostId = useSelect( ( select ) =>
		select( 'core/editor' ).getCurrentPostId()
	);
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

	useEffect( () => {
		if ( ! attributes.keyInput || ! postId ) {
			setFiles( [] );
			return;
		}

		setIsLoading( true );

		apiFetch( {
			path: `/theatrum/v1/meta-file/${ postId }/${ attributes.keyInput }`,
		} )
			.then( ( data ) => {
				setFiles( data.files || [] );
				setIsLoading( false );
			} )
			.catch( () => {
				setFiles( [] );
				setIsLoading( false );
			} );
	}, [ attributes.keyInput, postId ] );

	const customText = attributes.linkText || 'Download File';
	const textFor = ( file ) => {
		if ( linkTextSource === 'title' ) {
			return file.title || customText;
		}
		if ( linkTextSource === 'filename' ) {
			return file.filename || customText;
		}
		return customText;
	};

	const links = files.map( ( file, i ) => (
		<a
			key={ file.id || `${ file.url }-${ i }` }
			href={ file.url }
			target="_blank"
			rel="noopener noreferrer"
			className="wp-block-theatrum-meta-file-link"
			onClick={ ( event ) => event.preventDefault() }
		>
			{ attributes.showIcon && (
				<span
					className="dashicons dashicons-media-document"
					style={ {
						marginRight: '0.5em',
						verticalAlign: 'middle',
						fontSize: '1em',
						width: '1em',
						height: '1em',
					} }
				/>
			) }
			{ textFor( file ) }
		</a>
	) );

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
					<SelectControl
						label="Link Text"
						value={ linkTextSource }
						options={ [
							{ label: 'Custom text', value: 'custom' },
							{ label: 'File title', value: 'title' },
							{ label: 'File name', value: 'filename' },
						] }
						onChange={ ( value ) =>
							setAttributes( { linkTextSource: value } )
						}
						help={
							linkTextSource === 'custom'
								? undefined
								: 'Falls back to the custom text below if the file has none.'
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label={
							linkTextSource === 'custom'
								? 'Custom Text'
								: 'Fallback Link Text'
						}
						value={ attributes.linkText || 'Download File' }
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
						label="Show multiple files as a list"
						help="When the field holds more than one file, wrap the links in a bulleted list. Off: links sit inline."
						checked={ showAsList }
						onChange={ ( value ) =>
							setAttributes( { showAsList: value } )
						}
						__nextHasNoMarginBottom
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
					<ToggleControl
						label="Embed PDF on the page"
						help="Shows a PDF inline below the link (front end only). Other file types stay a link."
						checked={ !! attributes.embed }
						onChange={ ( value ) =>
							setAttributes( { embed: value } )
						}
						__nextHasNoMarginBottom
					/>
				</div>
			</InspectorControls>
			<div { ...blockProps }>
				{ isLoading && <Spinner /> }
				{ ! isLoading &&
					links.length > 1 &&
					( showAsList ? (
						<ul className="wp-block-theatrum-meta-file-list">
							{ links.map( ( link ) => (
								<li key={ link.key }>{ link }</li>
							) ) }
						</ul>
					) : (
						links
					) ) }
				{ ! isLoading && links.length === 1 && links[ 0 ] }
				{ ! isLoading &&
					! files.length &&
					attributes.keyInput &&
					attributes.fallbackText && (
						<div style={ { color: '#666' } }>
							{ attributes.fallbackText }
						</div>
					) }
				{ ! isLoading &&
					! files.length &&
					attributes.keyInput &&
					! attributes.fallbackText && (
						<div>{ `[${ attributes.keyInput }]` }</div>
					) }
				{ ! isLoading && ! files.length && ! attributes.keyInput && (
					<div style={ { color: '#999', fontStyle: 'italic' } }>
						Enter a meta key to display a file link
					</div>
				) }
			</div>
		</Fragment>
	);
}
