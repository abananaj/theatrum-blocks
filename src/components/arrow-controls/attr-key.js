/**
 * Builds the attribute name <ArrowControls>/getArrowStyleVars() read/write, given an optional
 * namespace prefix. Bare (default): 'ArrowPosition' -> 'arrowPosition' (theatrum/carousel,
 * theatrum/slider). Prefixed (e.g. 'ct'): -> 'ctArrowPosition', used by the is-style-ct-carousel
 * format's core/query & core/gallery extension so added attributes stay visually distinct from
 * core's own (matching the ctGridColumns/ctGridSpan convention) — not needed to avoid a collision,
 * since attributes are scoped per block type.
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
