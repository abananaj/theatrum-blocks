/**
 * Thumbnail List Item - Frontend Rendering (child of theatrum/list-thumbnail). Saves a `.list-item` carrying thumbnail URL/alt as data attributes rather than an <img> — the parent owns the single flip-card `<img>` pair; view.js reads these on hover to swap faces, keeping the 3D-transform markup out of every item.
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { thumbnailUrl, thumbnailAlt } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'list-item',
		'data-thumb-url': thumbnailUrl || '',
		'data-thumb-alt': thumbnailAlt || '',
	} );
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <div { ...innerBlocksProps } />;
}
