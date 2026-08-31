/**
 * Slider Item — a single slide, editable like a Group.
 *
 * The active-slide state and the "n / total" badge both depend on sibling
 * count/selection, which a plain save() can't access — so this mirrors the
 * same useSelect(core/block-editor) trick theatrum/tab's edit.js uses to
 * derive "am I the active one" from selection (defaulting to the first
 * child), extended to also report this slide's index/total for the badge.
 */

import clsx from 'clsx';
import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [
	['core/image', {}],
	[
		'core/paragraph',
		{ placeholder: __('Caption text', 'theatrum-blocks') },
	],
];

function useSlidePosition(clientId, isSelected) {
	return useSelect(
		(select) => {
			const {
				hasSelectedInnerBlock,
				getBlockRootClientId,
				getBlockOrder,
			} = select(blockEditorStore);

			const parentClientId = getBlockRootClientId(clientId);
			const order = getBlockOrder(parentClientId);
			const index = order.indexOf(clientId);

			let isActive;
			if (isSelected || hasSelectedInnerBlock(clientId, true)) {
				isActive = true;
			} else if (hasSelectedInnerBlock(parentClientId, true)) {
				isActive = false;
			} else {
				isActive = order[0] === clientId;
			}

			return { index, total: order.length, isActive };
		},
		[clientId, isSelected]
	);
}

export default function Edit({ clientId, isSelected }) {
	const { index, total, isActive } = useSlidePosition(clientId, isSelected);

	const blockProps = useBlockProps({
		className: clsx('tm-slider-slide', { 'is-active': isActive }),
	});
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'tm-slider-slide__content' },
		{
			template: TEMPLATE,
			templateLock: false,
		}
	);

	return (
		<li {...blockProps}>
			<div className="theatrum-slider-slide__number">
				{index + 1} / {total}
			</div>
			<div {...innerBlocksProps} />
		</li>
	);
}
