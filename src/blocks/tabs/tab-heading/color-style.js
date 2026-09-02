// Builds inline CSS custom properties for `.ct-tab__header` colors (see style.scss); using
// custom properties instead of plain color/background-color lets an unset state fall back to the previous one.
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
