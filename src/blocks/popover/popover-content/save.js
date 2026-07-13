/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { width, widthUnit } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'ct-popover__content',
		style: { '--ct-popover-width': `${ width }${ widthUnit }` },
	} );
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <div { ...innerBlocksProps } />;
}
