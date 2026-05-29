/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AddTabToolbarControl from '../tab-panel/add-tab-toolbar-control';
import RemoveTabToolbarControl from '../tab-panel/remove-tab-toolbar-control';

const TAB_LIST_TEMPLATE = [['theatrum/tab'], ['theatrum/tab']];

function Edit({ clientId }) {
	const tabsClientId = useSelect(
		(select) =>
			select(blockEditorStore).getBlockRootClientId(clientId),
		[clientId]
	);

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ['theatrum/tab'],
		orientation: 'horizontal',
		template: TAB_LIST_TEMPLATE,
		templateLock: false,
		renderAppender: false,
	});

	return (
		<>
			<AddTabToolbarControl tabsClientId={tabsClientId} />
			<RemoveTabToolbarControl tabsClientId={tabsClientId} />
			<div {...innerBlocksProps} />
		</>
	);
}

export default Edit;
