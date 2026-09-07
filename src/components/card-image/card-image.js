/**
 * The card's image element as the *editor* draws it — a preview of what render.php will print, so
 * the canvas matches the front end. Only edit.js uses it: on the front end the image is built in
 * PHP (theatrum_card_image_html), because with "Use featured image" on it depends on the post
 * being rendered.
 *
 * Geometry rides on this element as CSS custom properties (get-card-image-vars.js), mirroring what
 * the PHP helper writes.
 *
 * @param {Object} props
 * @param {string} props.baseClass The block's base class, e.g. `wp-block-theatrum-card-scroll`.
 * @param {string} props.url       Resolved image URL.
 * @param {string} [props.alt]     Alt text.
 * @param {Object} [props.style]   Style object from get-card-image-vars.js.
 */
export default function CardImage( { baseClass, url, alt = '', style } ) {
	if ( ! url ) {
		return null;
	}

	return (
		<div className={ `${ baseClass }__image` } style={ style }>
			<img src={ url } alt={ alt } />
		</div>
	);
}
