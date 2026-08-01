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

// There's no click-to-switch JS running in the editor (view.js is a
// viewScript, frontend-only), so "which tab is active" is derived from
// block-editor selection instead — the same approach core/accordion uses
// for its accordion-item: a tab is active if it (or something inside it)
// is selected, and if nothing in the whole group is selected yet, the
// first tab defaults active to match view.js's activate(0) on load.
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
