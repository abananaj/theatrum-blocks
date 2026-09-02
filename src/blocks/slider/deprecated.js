import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * v1: pre-Arrow-Styles markup — plain `tm-slider` wrapper, no `tm-slider-arrows-*` class or inline arrow vars — kept so old saved content doesn't trigger a block-validation error.
 * Note: only fixes the editor warning — the frontend serves frozen saved HTML, so old posts won't show arrow styling until reopened and resaved.
 */
const v1 = {
	attributes: {
		autoplay: { type: 'boolean', default: false },
		autoplaySpeed: { type: 'number', default: 5000 },
	},
	save( { attributes } ) {
		const { autoplay, autoplaySpeed } = attributes;

		const blockProps = useBlockProps.save( {
			className: 'tm-slider',
			'data-autoplay': autoplay ? 'true' : 'false',
			'data-autoplay-speed': autoplaySpeed,
		} );
		const innerBlocksProps = useInnerBlocksProps.save( {
			className: 'tm-slider-track',
		} );

		return (
			<div { ...blockProps }>
				<div className="tm-slider-wrapper">
					<ul { ...innerBlocksProps } />
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
	},
};

export default [ v1 ];
