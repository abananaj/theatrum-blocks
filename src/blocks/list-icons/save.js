/**
 * Icon List Block - Frontend Rendering (parent)
 *
 * Renders the `<ul>`/`<ol>` wrapper. The individual items are saved by the
 * `theatrum/list-item-icon` child block via InnerBlocks. Icon sizing, spacing and
 * colour are passed down as CSS custom properties on the wrapper.
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { getListProps } from './shared';

export default function Save( { attributes } ) {
	const { listType } = attributes;

	const { className, style } = getListProps( attributes );
	const blockProps = useBlockProps.save( { className, style } );
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	const ListTag = listType === 'ol' ? 'ol' : 'ul';

	return <ListTag { ...innerBlocksProps } />;
}
