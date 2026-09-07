/**
 * Dynamic block: save writes only the nested blocks, bare — render.php owns the card wrapper, the
 * image element and the `__content` wrapper (the same split theatrum/carousel uses). The image has
 * to be resolved server-side so "use the featured image" can mean *this* post inside a Query Loop.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	return <InnerBlocks.Content />;
}
