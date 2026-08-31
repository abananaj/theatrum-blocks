/**
 * Slider Block - Save
 *
 * Dots aren't rendered here — they depend on the slide count, which a plain
 * save() can't read (no data-store/hooks access there). The dots container
 * ships empty and view.js populates it from the live DOM on the frontend
 * (edit.js does the equivalent with real JSX for the editor preview).
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { autoplay, autoplaySpeed } = attributes;

	const blockProps = useBlockProps.save({
		className: 'tm-slider',
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
