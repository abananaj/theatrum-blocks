/**
 * Shared helpers for the Thumbnail List parent block.
 *
 * Builds the wrapper class name and CSS custom properties used by both the
 * editor preview (edit.js) and the saved markup (save.js), so the two render
 * identical layout/geometry and only diverge on the JS-driven hover state.
 * The `list-item-thumbnail` children read `--animation-speed` and
 * `--item-height` from the cascade.
 */

// Converts a spacing preset reference (e.g. "var:preset|spacing|40") saved by
// the core "Block spacing" control into the `var(--wp--preset--spacing--40)`
// form usable in an inline style; passes literal values (e.g. "2rem") through.
function resolveSpacingPreset( value ) {
	if ( typeof value === 'string' && value.startsWith( 'var:' ) ) {
		return `var(--wp--${ value.slice( 4 ).replace( /\|/g, '--' ) })`;
	}
	return value;
}

export function getThumbnailListProps( attributes ) {
	const {
		thumbnailPosition,
		verticalAlignment,
		animationSpeed,
		itemHeight,
		itemHeightUnit,
		thumbnailWidth,
		thumbnailWidthUnit,
		thumbnailHeight,
		thumbnailHeightUnit,
		thumbnailAspectRatio,
		thumbnailObjectFit,
		hideDescriptionUntilHover,
		style: blockStyle,
	} = attributes;

	const hasAspectRatio =
		thumbnailAspectRatio && thumbnailAspectRatio !== 'auto';

	const className = [
		`thumbnail-position-${ thumbnailPosition }`,
		hasAspectRatio ? 'has-aspect-ratio' : '',
		hideDescriptionUntilHover ? 'hide-description-until-hover' : '',
	]
		.filter( Boolean )
		.join( ' ' );

	// The "Block spacing" (Styles > Spacing > Blocks) control saves to
	// `style.spacing.blockGap` but — unlike margin/padding — WordPress only
	// auto-applies it for blocks that declare `supports.layout`. This block
	// uses a manual CSS grid instead, so the value has to be read and passed
	// through as a CSS custom property ourselves for the control to do anything.
	const blockGap = resolveSpacingPreset( blockStyle?.spacing?.blockGap );

	const verticalAlignmentMap = {
		top: 'start',
		center: 'center',
		bottom: 'end',
	};

	const style = {
		'--animation-speed': `${ animationSpeed }s`,
		'--vertical-alignment':
			verticalAlignmentMap[ verticalAlignment ] || 'start',
		'--item-height': `${ itemHeight }${ itemHeightUnit }`,
		'--thumb-width': `${ thumbnailWidth }${ thumbnailWidthUnit }`,
		'--thumb-height': `${ thumbnailHeight }${ thumbnailHeightUnit }`,
		'--thumb-object-fit': thumbnailObjectFit || 'cover',
		...( hasAspectRatio
			? { '--thumb-aspect-ratio': thumbnailAspectRatio }
			: {} ),
		...( blockGap ? { '--wp--style--block-gap': blockGap } : {} ),
	};

	return { className, style };
}
