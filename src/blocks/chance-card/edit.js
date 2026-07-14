import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import {
	TextControl,
	CheckboxControl,
	Spinner,
	ToggleControl,
	ComboboxControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit( { attributes, setAttributes, context } ) {
	const blockProps = useBlockProps();
	const [ postData, setPostData ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ error, setError ] = useState( '' );
	const [ searchResults, setSearchResults ] = useState( [] );
	const [ useMetaKey, setUseMetaKey ] = useState( !! attributes.metaKey );

	// Get current post ID from context (Query Loop) or editor
	const editorPostId = useSelect( ( select ) =>
		select( 'core/editor' ).getCurrentPostId()
	);
	const contextPostId = context?.postId;
	const currentPostId = contextPostId || editorPostId;

	// Fetch post data when metaKey or postId changes
	useEffect( () => {
		if ( ! attributes.metaKey && ! attributes.postId ) {
			setPostData( null );
			setError( '' );
			return;
		}

		setIsLoading( true );
		setError( '' );

		const url = `/chance/v1/cover-card/${
			attributes.metaKey || attributes.postId
		}?current_post_id=${ currentPostId }`;

		apiFetch( { path: url } )
			.then( ( data ) => {
				if ( data.post_id ) {
					setPostData( data );
					setAttributes( { postId: data.post_id } );
				} else {
					setPostData( null );
					setError( data.message || 'Post not found' );
				}
				setIsLoading( false );
			} )
			.catch( ( err ) => {
				setPostData( null );
				setError( 'Error fetching post data' );
				setIsLoading( false );
			} );
	}, [
		attributes.metaKey,
		attributes.postId,
		currentPostId,
		setAttributes,
	] );

	const handleSearchPosts = ( value ) => {
		if ( ! value || value.length < 2 ) {
			setSearchResults( [] );
			return;
		}
		apiFetch( {
			path: `/wp/v2/posts?search=${ encodeURIComponent(
				value
			) }&per_page=20&_fields=id,title,link`,
		} )
			.then( ( posts ) => setSearchResults( posts ) )
			.catch( () => setSearchResults( [] ) );
	};

	return (
		<Fragment>
			<InspectorControls>
				<div
					className="cover-card-inspector"
					style={ { padding: '16px' } }
				>
					<ToggleControl
						label="Use Meta Key or Post ID"
						checked={ useMetaKey }
						onChange={ ( value ) => {
							setUseMetaKey( value );
							if ( ! value ) {
								setAttributes( { metaKey: '' } );
							} else {
								setAttributes( { postId: 0 } );
							}
						} }
						help={
							useMetaKey
								? 'Enter a meta key or a post ID directly'
								: 'Search and select posts directly'
						}
						__nextHasNoMarginBottom
					/>

					{ useMetaKey ? (
						<TextControl
							label="Meta Key or Post ID"
							value={ attributes.metaKey || '' }
							onChange={ ( value ) =>
								setAttributes( { metaKey: value } )
							}
							placeholder="e.g., production_featured or 42"
							help="Enter a meta key whose value is a post ID, or enter a post ID directly"
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) : (
						<Fragment>
							<ComboboxControl
								label="Search Posts"
								value={
									attributes.postId
										? String( attributes.postId )
										: null
								}
								options={ searchResults.map( ( post ) => ( {
									value: String( post.id ),
									label: post.title.rendered || '(No Title)',
								} ) ) }
								onFilterValueChange={ handleSearchPosts }
								onChange={ ( value ) => {
									setAttributes( {
										postId: value ? Number( value ) : 0,
									} );
									setSearchResults( [] );
								} }
								placeholder="Search for a post..."
								help="Type to search posts"
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
							{ attributes.postId > 0 &&
								postData?.featured_image && (
									<img
										src={ postData.featured_image }
										alt={ postData.title }
										style={ {
											maxWidth: '100%',
											height: 'auto',
											borderRadius: '4px',
										} }
									/>
								) }
						</Fragment>
					) }

					<TextControl
						label="Button Text"
						value={ attributes.buttonText || '' }
						onChange={ ( value ) =>
							setAttributes( { buttonText: value } )
						}
						placeholder="e.g., Learn More, Get Tickets"
						help="Optional button text (leave empty to hide button)"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Button URL"
						value={ attributes.buttonUrl || '' }
						onChange={ ( value ) =>
							setAttributes( { buttonUrl: value } )
						}
						placeholder="https://example.com"
						help="Leave empty to link to the post"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Button 2 Text"
						value={ attributes.button2Text || '' }
						onChange={ ( value ) =>
							setAttributes( { button2Text: value } )
						}
						placeholder="e.g., Learn More, Get Tickets"
						help="Optional second button text (leave empty to hide)"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Button 2 URL"
						value={ attributes.button2Url || '' }
						onChange={ ( value ) =>
							setAttributes( { button2Url: value } )
						}
						placeholder="https://example.com"
						help="Leave empty to link to the post"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Button 3 Text"
						value={ attributes.button3Text || '' }
						onChange={ ( value ) =>
							setAttributes( { button3Text: value } )
						}
						placeholder="e.g., Learn More, Get Tickets"
						help="Optional third button text (leave empty to hide)"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Button 3 URL"
						value={ attributes.button3Url || '' }
						onChange={ ( value ) =>
							setAttributes( { button3Url: value } )
						}
						placeholder="https://example.com"
						help="Leave empty to link to the post"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<CheckboxControl
						label="Open button links in new window"
						checked={ attributes.openInNewWindow || false }
						onChange={ ( value ) =>
							setAttributes( { openInNewWindow: value } )
						}
						__nextHasNoMarginBottom
					/>
				</div>
			</InspectorControls>
			<div { ...blockProps }>
				{ isLoading && <Spinner /> }
				{ error && (
					<p className="cover-card-error">Error: { error }</p>
				) }
				{ ! isLoading && ! error && postData && (
					<div className="cover-card">
						<div
							className="user-content"
							style={ {
								backgroundImage: postData.featured_image
									? `url(${ postData.featured_image })`
									: 'linear-gradient(to right, #ccc, #ddd)',
							} }
						>
							<InnerBlocks placeholder="Add blocks for inner content..." />
						</div>
						<div className="bottom-bar">
							<h4 className="dates">
								{ postData.formatted_opening }
								{ postData.formatted_opening &&
									postData.formatted_closing &&
									' – ' }
								{ postData.formatted_closing }
							</h4>
							<div className="buttons">
								{ attributes.buttonText && (
									<a
										onClick={ ( event ) =>
											event.preventDefault()
										}
										className="button"
									>
										{ attributes.buttonText }
									</a>
								) }
								{ attributes.button2Text && (
									<a
										onClick={ ( event ) =>
											event.preventDefault()
										}
										className="button"
									>
										{ attributes.button2Text }
									</a>
								) }
								{ attributes.button3Text && (
									<a
										onClick={ ( event ) =>
											event.preventDefault()
										}
										className="button"
									>
										{ attributes.button3Text }
									</a>
								) }
							</div>
						</div>
					</div>
				) }
				{ ! isLoading && ! error && ! postData && (
					<p className="cover-card-placeholder">
						{ useMetaKey
							? 'Enter a meta key or post ID in the sidebar to display a post'
							: 'Search and select a post in the sidebar' }
					</p>
				) }
			</div>
		</Fragment>
	);
}
