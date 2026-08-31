/**
 * Slider Item — Frontend Rendering (child of theatrum/slider)
 *
 * No numbertext/active-state markup baked in here — save() has no access to
 * sibling count or selection state, so those are added client-side: as JSX
 * in edit.js for the editor preview, and DOM-injected by view.js on the
 * frontend (see slider/view.js).
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save({ className: 'tm-slider-slide' });
	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <li {...innerBlocksProps} />;
}
