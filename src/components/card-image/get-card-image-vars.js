/**
 * Builds the inline CSS custom properties that size a card's image (see ./index.js for the
 * controls that write them). They're written onto the elements they size rather than the block
 * wrapper (see inc/helpers.php for why), as custom properties rather than plain declarations so a
 * stylesheet can use the same value in more than one place — theatrum/card-scroll needs the width
 * both for the panel and for the revealed state its animation returns to, and the height for the
 * text column as well as the panel.
 *
 * An `undefined` value omits that property entirely, letting each block's own
 * `var(--theatrum-card-image-*, fallback)` default apply.
 *
 * @param {Object}  attributes            Block attributes.
 * @param {Object}  [options]
 * @param {boolean} [options.aspectRatio] Whether the block offers an aspect-ratio control
 *                                        (theatrum/card-scroll doesn't — see its README).
 * @return {Object} Style object suitable for spreading into a `style` prop.
 */
export default function getCardImageVars(
	attributes,
	{ aspectRatio = true } = {}
) {
	const {
		imageWidth,
		imageWidthUnit,
		imageHeight,
		imageHeightUnit,
		imageAspectRatio,
		imageObjectFit,
		imageFocalPoint,
	} = attributes;

	return {
		'--theatrum-card-image-width': imageWidth
			? `${ imageWidth }${ imageWidthUnit || '%' }`
			: undefined,
		'--theatrum-card-image-height': imageHeight
			? `${ imageHeight }${ imageHeightUnit || 'px' }`
			: undefined,
		// 'auto' is emitted rather than dropped: it's the author explicitly turning the
		// stylesheet's own default ratio off, not "no opinion".
		'--theatrum-card-image-aspect-ratio':
			aspectRatio && imageAspectRatio ? imageAspectRatio : undefined,
		'--theatrum-card-image-object-fit': imageObjectFit || undefined,
		'--theatrum-card-image-object-position':
			imageFocalPoint && typeof imageFocalPoint.x !== 'undefined'
				? `${ Math.round( imageFocalPoint.x * 100 ) }% ${ Math.round(
						imageFocalPoint.y * 100
				  ) }%`
				: undefined,
	};
}
