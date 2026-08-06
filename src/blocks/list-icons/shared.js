/**
 * Shared helpers for the Icon List parent block.
 *
 * Builds the wrapper class names and CSS custom properties used by both the
 * editor preview (edit.js) and the saved markup (save.js), so the two stay in
 * sync. The `list-item-icon` children read these CSS variables from the cascade.
 */

// Maps the user-facing Top/Middle/Bottom labels to the align-items keyword
// each applies to (cross-axis alignment of the icon relative to the text).
const FLEX_POSITION_MAP = {
	top: 'flex-start',
	middle: 'center',
	bottom: 'flex-end',
};

export function getListProps( attributes ) {
	const {
		iconPosition,
		iconSize,
		iconSizeUnit,
		iconSpacing,
		iconColor,
		iconAlign,
		hoverOnly,
	} = attributes;

	const className = `icon-position-${ iconPosition }${
		hoverOnly ? ' icon-hover-only' : ''
	}`;

	const style = {
		'--list-icon-size': `${ iconSize }${ iconSizeUnit }`,
		'--list-icon-spacing': `${ iconSpacing }px`,
		'--list-icon-align': FLEX_POSITION_MAP[ iconAlign ] || 'center',
		...( iconColor ? { '--list-icon-color': iconColor } : {} ),
	};

	return { className, style };
}
