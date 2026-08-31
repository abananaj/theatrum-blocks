import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * v1: Before Arrow Styles / arrow position controls were added. Saved markup
 * had no `tm-slider-arrows-*` position class and no inline arrow style
 * vars — just the plain `tm-slider` wrapper, matching what save.js emitted
 * before this block gained the arrowPosition/arrowBackground/arrowColor/
 * arrowBackgroundColor/arrowSize/arrowSizeUnit attributes. Keeps existing
 * saved content (e.g. from before this change shipped) from showing a
 * block-validation error in the editor.
 *
 * Note: this only prevents the *editor* validation warning. The *frontend*
 * still serves each post's frozen saved HTML — since this is a static
 * block, a post saved before the new arrow attributes existed won't show
 * their effect on the frontend until that post is opened and saved again.
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
