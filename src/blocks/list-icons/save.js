/**
 * Icon List Block - Frontend Rendering (parent). Renders the `<ul>` wrapper; items are saved by `theatrum/list-item-icon` children via InnerBlocks, with icon sizing/spacing/colour passed down as CSS custom properties.
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { getListProps } from './shared';

export default function Save( { attributes } ) {
	const { className, style } = getListProps( attributes );
	const blockProps = useBlockProps.save( { className, style } );
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <ul { ...innerBlocksProps } />;
}
