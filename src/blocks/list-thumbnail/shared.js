/**
 * Shared helpers for the Thumbnail List parent block — builds wrapper class/CSS custom properties shared by edit.js and save.js so layout stays identical (only hover state diverges). `list-item-thumbnail` children read `--animation-speed`/`--item-height` from the cascade.
 */

// Converts a spacing preset ref (e.g. "var:preset|spacing|40") to `var(--wp--preset--spacing--40)`; passes literal values (e.g. "2rem") through.
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

	// "Block spacing" saves to `style.spacing.blockGap` but WordPress only auto-applies it for blocks with `supports.layout`; this block uses a manual grid instead, so we read/pass it through as a CSS custom property ourselves.
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
