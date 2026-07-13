/**
 * Slider Block - Save
 *
 * Dots aren't rendered here — they depend on the slide count, which a plain
 * save() can't read (no data-store/hooks access there). The dots container
 * ships empty and view.js populates it from the live DOM on the frontend
 * (edit.js does the equivalent with real JSX for the editor preview).
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { autoplay, autoplaySpeed } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'ct-slider',
		'data-autoplay': autoplay ? 'true' : 'false',
		'data-autoplay-speed': autoplaySpeed,
	} );
	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'ct-slider-track',
	} );

	return (
		<div { ...blockProps }>
			<div className="ct-slider-wrapper">
				<ul { ...innerBlocksProps } />
				<button
					className="ct-slider-arrow ct-slider-prev"
					aria-label="Previous"
				>
					❮
				</button>
				<button
					className="ct-slider-arrow ct-slider-next"
					aria-label="Next"
				>
					❯
				</button>
			</div>
			<div className="ct-slider-dots"></div>
		</div>
	);
}
