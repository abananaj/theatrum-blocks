/**
 * Resolves the scrollable/track element for a format root. Native theatrum/carousel and
 * theatrum/slider markup carry their own track class; core blocks don't, so this falls through to
 * their actual shape: core/query -> .wp-block-post-template (the <ul> of post <li>s), core/gallery
 * (v2) -> no match, falls back to the root <figure> (itself the flex container of image <figure>s).
 *
 * @param {HTMLElement} root Format root to search within.
 * @return {HTMLElement} The resolved track element, or `root` itself as a fallback.
 */
export function resolveTrack( root ) {
	return (
		root.querySelector(
			'.theatrum-carousel-content, .tm-slider-track, .wp-block-post-template'
		) ?? root
	);
}
