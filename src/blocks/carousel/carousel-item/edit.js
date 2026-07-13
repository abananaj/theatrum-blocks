/**
 * Carousel Item — a single card, editable like a Group.
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [
	[ 'core/image', {} ],
	[ 'core/heading', { level: 3, placeholder: __( 'Card title', 'theatrum-blocks' ) } ],
	[ 'core/paragraph', { placeholder: __( 'Card subtitle', 'theatrum-blocks' ) } ],
];

export default function Edit() {
	const blockProps = useBlockProps( { className: 'ct-carousel-card' } );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		templateLock: false,
	} );

	return <li { ...innerBlocksProps } />;
}
