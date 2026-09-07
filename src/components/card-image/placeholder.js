/**
 * Editor-only stand-in shown in the image's slot when there is nothing to draw, so a fresh card has
 * an obvious place to click rather than a heading floating where the picture should be. Never
 * rendered on the front end — render.php simply prints no image element when there's no image.
 *
 * @param {Object}   props
 * @param {string}   props.baseClass The block's base class.
 * @param {Function} props.onSelect  Media-picker callback, same one the Inspector uses.
 * @param {Object}   [props.style]   Style object from get-card-image-vars.js.
 * @param {string}   [props.notice]  Replaces the picker button — used when the card is set to the
 *                                   featured image and this post hasn't got one.
 */
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function CardImagePlaceholder( {
	baseClass,
	onSelect,
	style,
	notice,
} ) {
	return (
		<div
			className={ `${ baseClass }__image ${ baseClass }__image-placeholder` }
			style={ style }
		>
			{ notice ? (
				<span>{ notice }</span>
			) : (
				<MediaUploadCheck
					fallback={
						<span>
							{ __( 'No image selected', 'theatrum-blocks' ) }
						</span>
					}
				>
					<MediaUpload
						onSelect={ onSelect }
						allowedTypes={ [ 'image' ] }
						render={ ( { open } ) => (
							<Button onClick={ open } variant="secondary">
								{ __( 'Select image', 'theatrum-blocks' ) }
							</Button>
						) }
					/>
				</MediaUploadCheck>
			) }
		</div>
	);
}
