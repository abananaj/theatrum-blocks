/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[ 'core/paragraph', { placeholder: 'Add trigger content…' } ],
];

export default function Edit() {
	const blockProps = useBlockProps( { className: 'ct-popover__trigger' } );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		templateLock: false,
	} );

	return <div { ...innerBlocksProps } />;
}
