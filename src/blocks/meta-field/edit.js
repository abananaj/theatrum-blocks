/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, RawHTML, useState, useEffect } from '@wordpress/element';
import {
	TextControl,
	SelectControl,
	ToggleControl,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit( { attributes, setAttributes, context } ) {
	const blockProps = useBlockProps();
	const [ displayValue, setDisplayValue ] = useState( '' );
	const [ isLoading, setIsLoading ] = useState( false );

	// Get current post ID from context (Query Loop) or editor
	const editorPostId = useSelect( ( select ) =>
		select( 'core/editor' ).getCurrentPostId()
	);
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

	// Fetch the post meta value when key or postId changes
	useEffect( () => {
		if ( ! attributes.keyInput || ! postId ) {
			setDisplayValue( '' );
			return;
		}

		setIsLoading( true );

		const params = [];
		if ( attributes.isHtml ) {
			params.push( 'html=1' );
		}
		if ( attributes.fallbackToPostContent ) {
			params.push( 'fallback=post_content' );
		}
		const url = `/theatrum/v1/post-meta/${ postId }/${
			attributes.keyInput
		}${ params.length ? `?${ params.join( '&' ) }` : '' }`;

		apiFetch( { path: url } )
			.then( ( data ) => {
				setDisplayValue( data.value || '' );
				setIsLoading( false );
			} )
			.catch( () => {
				setDisplayValue( '' );
				setIsLoading( false );
			} );
	}, [
		attributes.keyInput,
		attributes.isHtml,
		attributes.fallbackToPostContent,
		postId,
	] );

	const Tag = attributes.tagName || 'span';
	const displayText = displayValue || `[${ attributes.keyInput }]`;
	const prependText = attributes.prepend || '';
	const appendText = attributes.append || '';
	const finalText = `${ prependText }${ displayText }${ appendText }`;

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
					<ToggleControl
						label="Render as HTML (WYSIWYG)"
						checked={ !! attributes.isHtml }
						onChange={ ( value ) =>
							setAttributes( { isHtml: value } )
						}
						help="For rich-text fields (e.g. ACF WYSIWYG like widget_content). Renders the field's markup instead of escaping it as plain text."
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label="Fallback to post content when empty"
						checked={ !! attributes.fallbackToPostContent }
						onChange={ ( value ) =>
							setAttributes( { fallbackToPostContent: value } )
						}
						help="If this meta key has no value, show the post's own content instead."
						__nextHasNoMarginBottom
					/>
					{ ! attributes.isHtml && (
						<Fragment>
							<SelectControl
								label="HTML Tag"
								value={ attributes.tagName || 'span' }
								onChange={ ( value ) =>
									setAttributes( { tagName: value } )
								}
								options={ [
									{ label: '<p>', value: 'p' },
									{ label: '<span>', value: 'span' },
									{ label: '<a>', value: 'a' },
									{ label: '<h1>', value: 'h1' },
									{ label: '<h2>', value: 'h2' },
									{ label: '<h3>', value: 'h3' },
									{ label: '<h4>', value: 'h4' },
									{ label: '<h5>', value: 'h5' },
									{ label: '<h6>', value: 'h6' },
								] }
							/>
							{ attributes.tagName === 'a' && (
								<TextControl
									label="Link URL"
									value={ attributes.href || '' }
									onChange={ ( value ) =>
										setAttributes( { href: value } )
									}
									placeholder="https://example.com"
									help="Enter the URL for the link"
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
							) }
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
						</Fragment>
					) }
				</div>
			</InspectorControls>
			<div { ...blockProps }>
				{ isLoading ? (
					<Spinner />
				) : ! attributes.keyInput ? (
					<em style={ { color: '#999' } }>
						Enter a key to display its value
					</em>
				) : attributes.isHtml ? (
					<div className="wp-block-theatrum-post-meta-field is-html">
						<RawHTML>
							{ displayValue || `[${ attributes.keyInput }]` }
						</RawHTML>
					</div>
				) : (
					<Tag
						className="wp-block-theatrum-post-meta-field"
						style={ { wordBreak: 'break-word' } }
						{ ...( attributes.tagName === 'a'
							? {
									href: attributes.href || undefined,
									onClick: ( event ) =>
										event.preventDefault(),
							  }
							: {} ) }
					>
						{ finalText }
					</Tag>
				) }
			</div>
		</Fragment>
	);
}
