// Builds the inline CSS custom properties that drive normal/hover/active
// colors for `.ct-tab__header` (see style.scss). Using custom properties
// (rather than plain `color`/`background-color`) lets a single state's
// fallback chain to the next, so an unset hover color reverts to the
// normal color instead of the browser default.
export default function getColorStyle( {
	normalTextColor,
	normalBackgroundColor,
	hoverTextColor,
	hoverBackgroundColor,
	activeTextColor,
	activeBackgroundColor,
} ) {
	return {
		'--ct-tab-header-color': normalTextColor || undefined,
		'--ct-tab-header-bg': normalBackgroundColor || undefined,
		'--ct-tab-header-hover-color': hoverTextColor || undefined,
		'--ct-tab-header-hover-bg': hoverBackgroundColor || undefined,
		'--ct-tab-header-active-color': activeTextColor || undefined,
		'--ct-tab-header-active-bg': activeBackgroundColor || undefined,
	};
}
