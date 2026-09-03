import attrKey from './attr-key';

/**
 * Builds the inline CSS custom properties that drive arrow color, background, and size for a
 * block using <ArrowControls> (see ./index.js). Each consumer supplies its own `prefix` (e.g.
 * "ct-arrow" for theatrum/carousel) matching its own stylesheet; an `undefined` value omits that
 * property entirely, letting the stylesheet's own `var(--x, fallback)` default apply.
 *
 * @param {Object} attributes                Block attributes.
 * @param {Object} options
 * @param {string} options.prefix            Custom-property prefix, e.g. "ct-arrow".
 * @param {string} [options.attributePrefix] Namespace prefix for the
 *                                           underlying attribute names (see
 *                                           attr-key.js) — must match
 *                                           whatever <ArrowControls> was
 *                                           given. Default '' reads the bare
 *                                           `arrowColor` etc. names.
 * @return {Object} Style object suitable for spreading into a `style` prop.
 */
export default function getArrowStyleVars(
	attributes,
	{ prefix, attributePrefix = '' }
) {
	const arrowBackground =
		attributes[ attrKey( attributePrefix, 'ArrowBackground' ) ];
	const arrowColor = attributes[ attrKey( attributePrefix, 'ArrowColor' ) ];
	const arrowBackgroundColor =
		attributes[ attrKey( attributePrefix, 'ArrowBackgroundColor' ) ];
	const arrowSize = attributes[ attrKey( attributePrefix, 'ArrowSize' ) ];
	const arrowSizeUnit =
		attributes[ attrKey( attributePrefix, 'ArrowSizeUnit' ) ];

	return {
		[ `--${ prefix }-color` ]: arrowColor || undefined,
		// `arrowBackground === false` is explicit "no background" and wins regardless; otherwise
		// falls through to the user's color, or the stylesheet's own per-position default.
		[ `--${ prefix }-bg` ]:
			arrowBackground === false
				? 'transparent'
				: arrowBackgroundColor || undefined,
		[ `--${ prefix }-size` ]: arrowSize
			? `${ arrowSize }${ arrowSizeUnit || 'px' }`
			: undefined,
	};
}
