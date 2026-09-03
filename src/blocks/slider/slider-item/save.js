/**
 * Slider Item — Frontend Rendering (child of theatrum/slider). No numbertext/active-state markup here — save() lacks sibling-count/selection access, so it's added client-side: JSX in edit.js, DOM-injected by view.js on the frontend (see slider/view.js).
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save( { className: 'tm-slider-slide' } );
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <li { ...innerBlocksProps } />;
}
