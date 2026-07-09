/**
 * Shared helpers for the Thumbnail List parent block.
 *
 * Builds the wrapper class name and CSS custom properties used by both the
 * editor preview (edit.js) and the saved markup (save.js), so the two render
 * identical layout/geometry and only diverge on the JS-driven hover state.
 * The `list-item-thumbnail` children read `--animation-speed` and
 * `--item-height` from the cascade.
 */

export function getThumbnailListProps( attributes ) {
	const {
		thumbnailPosition,
		animationSpeed,
		itemHeight,
		itemHeightUnit,
		thumbnailWidth,
		thumbnailWidthUnit,
		thumbnailHeight,
		thumbnailHeightUnit,
		thumbnailAspectRatio,
		thumbnailObjectFit,
	} = attributes;

	const hasAspectRatio =
		thumbnailAspectRatio && thumbnailAspectRatio !== 'auto';

	const className = [
		`thumbnail-position-${ thumbnailPosition }`,
		hasAspectRatio ? 'has-aspect-ratio' : '',
	]
		.filter( Boolean )
		.join( ' ' );

	const style = {
		'--animation-speed': `${ animationSpeed }s`,
		'--item-height': `${ itemHeight }${ itemHeightUnit }`,
		'--thumb-width': `${ thumbnailWidth }${ thumbnailWidthUnit }`,
		'--thumb-height': `${ thumbnailHeight }${ thumbnailHeightUnit }`,
		'--thumb-object-fit': thumbnailObjectFit || 'cover',
		...( hasAspectRatio
			? { '--thumb-aspect-ratio': thumbnailAspectRatio }
			: {} ),
	};

	return { className, style };
}
