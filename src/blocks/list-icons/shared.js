/**
 * Shared helpers for the Icon List parent block.
 *
 * Builds the wrapper class names and CSS custom properties used by both the
 * editor preview (edit.js) and the saved markup (save.js), so the two stay in
 * sync. The `list-item-icon` children read these CSS variables from the cascade.
 */

export function getListProps(attributes) {
	const { iconPosition, iconSize, iconSizeUnit, iconSpacing, iconColor, hoverOnly } = attributes;

	const className = `icon-position-${iconPosition}${hoverOnly ? ' icon-hover-only' : ''}`;

	const style = {
		'--list-icon-size': `${iconSize}${iconSizeUnit}`,
		'--list-icon-spacing': `${iconSpacing}px`,
		...(iconColor ? { '--list-icon-color': iconColor } : {}),
	};

	return { className, style };
}
