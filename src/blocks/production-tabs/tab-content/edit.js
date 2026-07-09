/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const TEMPLATE = [ [ 'core/paragraph' ] ];

export default function Edit() {
	const blockProps = useBlockProps( { className: 'ct-tab__panel' } );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		// Explicitly override chance/tab's templateLock: 'all' — otherwise
		// it inherits down and blocks inserting/splitting blocks in here.
		templateLock: false,
	} );

	return <div { ...innerBlocksProps } />;
}
