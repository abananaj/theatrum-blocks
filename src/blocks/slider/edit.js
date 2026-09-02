/**
 * Slider Block - Editor. Renders the same wrapper/arrows markup as save.js (real WYSIWYG preview); slides are `theatrum/slider-item` child blocks edited in the canvas, like a Group.
 * Dots aren't in save.js (no sibling-count access in a plain save()) but ARE rendered here via data-store access, one per slide, reusing slider-item/edit.js's "active = selected descendant, else first" rule.
 * Arrow/dot clicks call `selectBlock` on the corresponding slider-item rather than tracking separate visual-only state — `useActiveDotIndex()` already derives the active slide from block selection.
 */

import clsx from 'clsx';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	InnerBlocks,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ArrowControls from '../../components/arrow-controls';
import getArrowStyleVars from '../../components/arrow-controls/get-arrow-style-vars';

const TEMPLATE = [['theatrum/slider-item'], ['theatrum/slider-item']];

function useActiveDotIndex(clientId) {
	return useSelect(
		(select) => {
			const {
				getSelectedBlockClientId,
				hasSelectedInnerBlock,
				getBlockOrder,
			} = select(blockEditorStore);

			const order = getBlockOrder(clientId);
			const selectedClientId = getSelectedBlockClientId();

			const activeIndex = order.findIndex(
				(childId) =>
					childId === selectedClientId ||
					hasSelectedInnerBlock(childId, true)
			);

			return {
				activeIndex: activeIndex === -1 ? 0 : activeIndex,
				total: order.length,
				order,
			};
		},
		[clientId]
	);
}

export default function Edit({ attributes, setAttributes, clientId }) {
	const { autoplay, autoplaySpeed, arrowPosition } = attributes;
	const { activeIndex, total, order } = useActiveDotIndex(clientId);
	const { selectBlock } = useDispatch(blockEditorStore);

	const goToSlide = (index) => {
		if (!total) {
			return;
		}
		const nextClientId = order[(index + total) % total];
		if (nextClientId) {
			selectBlock(nextClientId);
		}
	};

	const blockProps = useBlockProps({
		// `is-ready` (normally added by view.js after hydration) stops the no-JS fallback CSS from forcing the first slide — the editor already knows the active slide via useSelect.
		className: clsx('tm-slider', 'is-ready', {
			'tm-slider-arrows-inside': arrowPosition === 'inside',
			'tm-slider-arrows-hidden': arrowPosition === 'hidden',
		}),
		style: getArrowStyleVars(attributes, { prefix: 'tm-arrow' }),
		'data-autoplay': autoplay ? 'true' : 'false',
		'data-autoplay-speed': autoplaySpeed,
	});
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'tm-slider-track' },
		{
			allowedBlocks: ['theatrum/slider-item'],
			template: TEMPLATE,
			templateLock: false,
			renderAppender: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={__('Slider Settings', 'theatrum-blocks')}
					initialOpen={true}
				>
					<ToggleControl
						label={__('Autoplay', 'theatrum-blocks')}
						checked={!!autoplay}
						onChange={(value) =>
							setAttributes({ autoplay: value })
						}
						help={__(
							'Automatically advance to the next slide',
							'theatrum-blocks'
						)}
					/>
					{autoplay && (
						<RangeControl
							label={__(
								'Autoplay speed (ms)',
								'theatrum-blocks'
							)}
							value={autoplaySpeed}
							onChange={(value) =>
								setAttributes({ autoplaySpeed: value })
							}
							min={100}
							max={10000}
							step={100}
						/>
					)}
				</PanelBody>
			</InspectorControls>
			<ArrowControls
				attributes={attributes}
				setAttributes={setAttributes}
				positions={['outside', 'inside', 'hidden']}
			/>

			<div {...blockProps}>
				<div className="tm-slider-wrapper">
					<ul {...innerBlocksProps} />
					<button
						className="tm-slider-arrow tm-slider-prev"
						aria-label={__('Previous', 'theatrum-blocks')}
						onClick={() => goToSlide(activeIndex - 1)}
					>
						❮
					</button>
					<button
						className="tm-slider-arrow tm-slider-next"
						aria-label={__('Next', 'theatrum-blocks')}
						onClick={() => goToSlide(activeIndex + 1)}
					>
						❯
					</button>
				</div>
				<div className="tm-slider-dots">
					{Array.from({ length: total }).map((_, index) => (
						<button
							key={index}
							type="button"
							className={clsx('theatrum-slider-dot', {
								'is-active': index === activeIndex,
							})}
							aria-label={`${index + 1}`}
							onClick={() => goToSlide(index)}
						/>
					))}
				</div>
			</div>
		</Fragment>
	);
}
