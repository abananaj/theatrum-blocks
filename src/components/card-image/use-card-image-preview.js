/**
 * Resolves what the *editor* should draw in a card's image slot, mirroring what
 * theatrum_card_image_html() will print on the front end.
 *
 * With "Use featured image" on, that's the featured image of the post in context — the post being
 * edited, or the queried post when the card sits inside a Query Loop — falling back to a separately
 * selected image for posts that haven't got one. Anything the editor can't resolve comes back as a
 * `notice` for the placeholder to show, rather than silently drawing the wrong picture.
 *
 * @param {Object} attributes Block attributes.
 * @param {Object} context    Block context (`postId`, `postType`).
 * @return {{url: string, alt: string, notice: string}} What to render in the image slot.
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

export default function useCardImagePreview( attributes, context ) {
	const { useFeaturedImage, mediaUrl, mediaAlt, imageSizeSlug } = attributes;
	const postId = context?.postId;
	const postType = context?.postType;

	const featuredId = useSelect(
		( select ) => {
			if ( ! useFeaturedImage || ! postId || ! postType ) {
				return 0;
			}
			const post = select( coreStore ).getEntityRecord(
				'postType',
				postType,
				postId
			);
			return post?.featured_media || 0;
		},
		[ useFeaturedImage, postId, postType ]
	);

	const featured = useSelect(
		( select ) =>
			featuredId ? select( coreStore ).getMedia( featuredId ) : null,
		[ featuredId ]
	);

	const selected = { url: mediaUrl || '', alt: mediaAlt || '', notice: '' };

	if ( ! useFeaturedImage ) {
		return selected;
	}

	if ( featuredId ) {
		if ( ! featured ) {
			return {
				url: '',
				alt: '',
				notice: __( 'Loading featured image…', 'theatrum-blocks' ),
			};
		}

		const sizes = featured.media_details?.sizes || {};
		return {
			url:
				sizes[ imageSizeSlug ]?.source_url || featured.source_url || '',
			// The attachment's own alt describes the featured image; the block's Alt Text field
			// describes the selected one, so it isn't reused here.
			alt: featured.alt_text || '',
			notice: '',
		};
	}

	// No featured image on this post: the selected image is the fallback, exactly as in PHP.
	if ( selected.url ) {
		return selected;
	}

	return {
		url: '',
		alt: '',
		notice: postId
			? __(
					'This post has no featured image. Select one below as a fallback, or set a featured image on the post.',
					'theatrum-blocks'
			  )
			: __(
					'No post in context, so there is no featured image to show here.',
					'theatrum-blocks'
			  ),
	};
}
