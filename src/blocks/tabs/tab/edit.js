/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

const TEMPLATE = [ [ 'theatrum/tab-heading' ], [ 'theatrum/tab-content' ] ];

// No click JS in the editor, so "active tab" derives from block-editor selection instead — like
// core/accordion: active if selected or containing the selection; if nothing in the group is
// selected, the first tab defaults active to match view.js's activate(0) on load.
function useIsActiveTab( clientId, isSelected ) {
	return useSelect(
		( select ) => {
			const {
				hasSelectedInnerBlock,
				getBlockRootClientId,
				getBlockOrder,
			} = select( blockEditorStore );

			if ( isSelected || hasSelectedInnerBlock( clientId, true ) ) {
				return true;
			}

			const parentClientId = getBlockRootClientId( clientId );

			if ( hasSelectedInnerBlock( parentClientId, true ) ) {
				return false;
			}

			return getBlockOrder( parentClientId )[ 0 ] === clientId;
		},
		[ clientId, isSelected ]
	);
}

export default function Edit( { clientId, isSelected } ) {
	const isActive = useIsActiveTab( clientId, isSelected );

	const blockProps = useBlockProps( {
		className: clsx( 'ct-tab', { 'is-active': isActive } ),
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		templateLock: 'all',
	} );

	return <div { ...innerBlocksProps } />;
}
