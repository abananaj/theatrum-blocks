/**
 * Carousel Item — Frontend Rendering (child of theatrum/carousel)
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save( { className: 'ct-carousel-card' } );
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <li { ...innerBlocksProps } />;
}
