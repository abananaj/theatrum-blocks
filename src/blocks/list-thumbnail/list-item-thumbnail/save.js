/**
 * Thumbnail List Item - Frontend Rendering (child of chance/list-thumbnail)
 *
 * Saves a single `.list-item` containing its nested heading/paragraph content
 * and carries the thumbnail URL/alt as data attributes rather than an <img>.
 * The parent block owns the single flip-card `<img>` pair (front/back faces);
 * view.js reads these data attributes on hover to swap the visible face. This
 * keeps the expensive 3D-transform image markup out of every item.
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
