/**
 * Resolves the scrollable/track element for a format root.
 *
 * Native chance/carousel and chance/slider markup carry their own track
 * class. Core blocks don't, so this falls through to the shapes those
 * blocks actually render:
 *   - core/query        -> .wp-block-post-template (the <ul> of post <li>s)
 *   - core/gallery (v2)  -> no match, falls back to the root <figure>, which
 *                           is itself the flex container of image <figure>s
 *
 * @param {HTMLElement} root Format root to search within.
 * @return {HTMLElement} The resolved track element, or `root` itself as a fallback.
 */
export function resolveTrack( root ) {
	return (
		root.querySelector(
			'.ct-carousel-content, .ct-slider-track, .wp-block-post-template'
		) ?? root
	);
}
