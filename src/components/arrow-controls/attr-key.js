/**
 * Builds the actual attribute name <ArrowControls>/getArrowStyleVars() read
 * and write, given an optional namespace prefix.
 *
 * Bare (no prefix, the default): 'ArrowPosition' -> 'arrowPosition' — the
 * shape theatrum/carousel and theatrum/slider have always used.
 *
 * Prefixed (e.g. attributePrefix: 'ct'): 'ArrowPosition' -> 'ctArrowPosition'
 * — used by the is-style-ct-carousel format's core/query & core/gallery
 * attribute extension, so its added attributes stay visually distinct from
 * core's own in the inspector/JSON (matching this codebase's ctGridColumns/
 * ctGridSpan convention for extending a core block), even though a literal
 * collision with the native blocks' bare names is impossible — attributes
 * are scoped per block *type*, not shared across types.
 *
 * @param {string} attributePrefix Namespace prefix, or '' for bare names.
 * @param {string} field           PascalCase field name, e.g. 'ArrowPosition'.
 * @return {string} The attribute key to use.
 */
export default function attrKey( attributePrefix, field ) {
	if ( ! attributePrefix ) {
		return field.charAt( 0 ).toLowerCase() + field.slice( 1 );
	}
	return `${ attributePrefix }${ field }`;
}
