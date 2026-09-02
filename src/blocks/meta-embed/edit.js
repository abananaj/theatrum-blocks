/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	TextControl,
	ToggleControl,
	PanelBody,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

/**
 * Extract a YouTube video ID from any standard YouTube URL (watch?v=, youtu.be/, /embed/, /shorts/).
 * @param url
 */
function getYouTubeId( url ) {
	if ( ! url ) {
		return null;
	}
	const match = url.match(
		/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
	);
	return match ? match[ 1 ] : null;
}

// Mirrors core/embed's getClassNames() (@wordpress/block-library) so the responsive toggle matches core Embed's behavior.
const ASPECT_RATIOS = [
	{ ratio: 2.33, className: 'wp-embed-aspect-21-9' },
	{ ratio: 2, className: 'wp-embed-aspect-18-9' },
	{ ratio: 1.78, className: 'wp-embed-aspect-16-9' },
	{ ratio: 1.33, className: 'wp-embed-aspect-4-3' },
	{ ratio: 1, className: 'wp-embed-aspect-1-1' },
	{ ratio: 0.56, className: 'wp-embed-aspect-9-16' },
	{ ratio: 0.5, className: 'wp-embed-aspect-1-2' },
];

function getAspectRatioClassName( width, height, allowResponsive ) {
	if ( ! allowResponsive || ! width || ! height ) {
		return '';
	}
	const ratio = width / height;
	const closest = ASPECT_RATIOS.reduce( ( best, candidate ) => {
		if ( ! best ) {
			return candidate;
		}
		return Math.abs( candidate.ratio - ratio ) <
			Math.abs( best.ratio - ratio )
			? candidate
			: best;
	}, null );
	return closest ? `${ closest.className } wp-has-aspect-ratio` : '';
}

function getEmbedDimensions( html ) {
	const widthMatch = html.match( /width=["']?(\d+)/i );
	const heightMatch = html.match( /height=["']?(\d+)/i );
	return {
		width: widthMatch ? parseInt( widthMatch[ 1 ], 10 ) : 0,
		height: heightMatch ? parseInt( heightMatch[ 1 ], 10 ) : 0,
	};
}

export default function Edit( { attributes, setAttributes, context } ) {
	const { keyInput, embedType, allowResponsive = true } = attributes;
	const isYouTube = embedType === 'youtube';

	const [ embedData, setEmbedData ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( false );

	// Get current post ID from context (Query Loop) or editor
	const editorPostId = useSelect( ( select ) =>
		select( 'core/editor' ).getCurrentPostId()
	);
	const editorPostType = useSelect( ( select ) =>
		select( 'core/editor' ).getCurrentPostType()
	);
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

	// Check if we're editing a template (post type starts with 'wp_template')
	const isEditingTemplate =
		editorPostType && editorPostType.startsWith( 'wp_template' );

	// Fetch the embed data when key or postId changes
	useEffect( () => {
		if ( ! keyInput || ! postId ) {
			setEmbedData( null );
			return;
		}

		// In template editor, show placeholder
		if ( isEditingTemplate && ! contextPostId ) {
			setEmbedData( { placeholder: true } );
			return;
		}

		setIsLoading( true );

		const url = `/theatrum/v1/meta-embed/${ postId }/${ keyInput }`;

		apiFetch( { path: url } )
			.then( ( data ) => {
				setEmbedData( data.html ? data : null );
				setIsLoading( false );
			} )
			.catch( () => {
				setEmbedData( null );
				setIsLoading( false );
			} );
	}, [ keyInput, postId, isEditingTemplate, contextPostId ] );

	// For YouTube: try to parse a video ID out of the oEmbed HTML src
	const youTubeId =
		isYouTube && embedData?.html
			? ( embedData.html.match( /embed\/([A-Za-z0-9_-]{11})/ ) ||
					[] )[ 1 ] || null
			: null;

	const hasEmbed =
		( isYouTube && youTubeId ) || ( ! isYouTube && embedData?.html );

	// Same aspect-ratio detection as core/embed, so the editor preview matches render.php's frontend output.
	let aspectClassName = '';
	if ( isYouTube && youTubeId ) {
		aspectClassName = getAspectRatioClassName( 16, 9, allowResponsive );
	} else if ( ! isYouTube && embedData?.html ) {
		const { width, height } = getEmbedDimensions( embedData.html );
		aspectClassName = getAspectRatioClassName(
			width || 16,
			height || 9,
			allowResponsive
		);
	}

	const blockProps = useBlockProps( {
		className: aspectClassName || undefined,
	} );

	const toggleResponsive = () =>
		setAttributes( { allowResponsive: ! allowResponsive } );

	const metaKeyLabel = isYouTube ? 'YouTube URL Meta Key' : 'Meta Key';
	const metaKeyHelp = isYouTube
		? 'Enter the meta key whose value is a YouTube URL (e.g. trailer_url)'
		: 'Enter the meta key that contains the URL to embed';

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'theatrum-blocks' ) }>
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
					{ hasEmbed && (
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __(
								'Resize for smaller devices',
								'theatrum-blocks'
							) }
							checked={ allowResponsive }
							help={
								allowResponsive
									? __(
											'This embed will preserve its aspect ratio when the browser is resized.',
											'theatrum-blocks'
									  )
									: __(
											'This embed may not preserve its aspect ratio when the browser is resized.',
											'theatrum-blocks'
									  )
							}
							onChange={ toggleResponsive }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ isLoading && <Spinner /> }
				{ ! isLoading && embedData?.placeholder && (
					<div>
						{ isYouTube
							? '[Template: YouTube video will display on frontend]'
							: '[Template: Embedded resource will display on frontend]' }
					</div>
				) }
				{ /* YouTube variation: render nocookie iframe preview */ }
				{ ! isLoading && isYouTube && youTubeId && (
					<div className="wp-block-embed__wrapper">
						<iframe
							src={ `https://www.youtube-nocookie.com/embed/${ youTubeId }` }
							width="1200"
							height="675"
							title="YouTube video preview"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					</div>
				) }
				{ /* Generic variation: render oEmbed HTML */ }
				{ ! isLoading && ! isYouTube && embedData?.html && (
					<div
						className="wp-block-embed__wrapper"
						dangerouslySetInnerHTML={ { __html: embedData.html } }
						onClick={ ( event ) => {
							if ( event.target.closest( 'a' ) ) {
								event.preventDefault();
							}
						} }
					/>
				) }
				{ ! isLoading && ! embedData && keyInput && (
					<div>{ `[${ keyInput }]` }</div>
				) }
				{ ! keyInput && (
					<div style={ { color: '#999', fontStyle: 'italic' } }>
						{ isYouTube
							? 'Enter the meta key that holds the YouTube URL'
							: 'Enter a meta key to display an embedded resource' }
					</div>
				) }
			</div>
		</Fragment>
	);
}
