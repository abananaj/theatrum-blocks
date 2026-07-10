/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const TEMPLATE = [ [ 'chance/tab-heading' ], [ 'chance/tab-content' ] ];

export default function Edit() {
	const blockProps = useBlockProps( { className: 'ct-tab' } );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		templateLock: 'all',
	} );

	return <div { ...innerBlocksProps } />;
}
