/**
 * Carousel Block - Save
 *
 * Saves only the inner card blocks (bare, no wrapper) — render.php owns the
 * `.ct-carousel-wrapper` / header / controls markup and embeds this as
 * `$content` inside `<ul class="ct-carousel-content">`.
 */

import { InnerBlocks } from '@wordpress/block-editor';

export default function Save() {
	return <InnerBlocks.Content />;
}
