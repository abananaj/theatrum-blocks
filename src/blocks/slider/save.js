/**
 * Slider Block - Save. Dots aren't rendered here — save() has no data-store/hooks access to read slide count — so the dots container ships empty and view.js populates it from the live DOM (edit.js does the JSX equivalent for the editor preview).
 */

import clsx from 'clsx';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import getArrowStyleVars from '../../components/arrow-controls/get-arrow-style-vars';

export default function save({ attributes }) {
	const { autoplay, autoplaySpeed, arrowPosition } = attributes;

	const blockProps = useBlockProps.save({
		className: clsx('tm-slider', {
			'tm-slider-arrows-inside': arrowPosition === 'inside',
			'tm-slider-arrows-hidden': arrowPosition === 'hidden',
		}),
		style: getArrowStyleVars(attributes, { prefix: 'tm-arrow' }),
		'data-autoplay': autoplay ? 'true' : 'false',
		'data-autoplay-speed': autoplaySpeed,
	});
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'tm-slider-track',
	});

	return (
		<div {...blockProps}>
			<div className="tm-slider-wrapper">
				<ul {...innerBlocksProps} />
				<button
					className="tm-slider-arrow tm-slider-prev"
					aria-label="Previous"
				>
					❮
				</button>
				<button
					className="tm-slider-arrow tm-slider-next"
					aria-label="Next"
				>
					❯
				</button>
			</div>
			<div className="tm-slider-dots"></div>
		</div>
	);
}
