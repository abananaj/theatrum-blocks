/**
 * Thumbnail List Block Save (parent)
 *
 * Renders the list-item children (via InnerBlocks) alongside a single
 * flip-card preview panel with two faces (front/back). Faces start on the
 * blue-gradient placeholder so nothing is broken/blank before JS runs;
 * view.js populates the front face with the first item's thumbnail (or the
 * same placeholder, if that item has none) on load and swaps faces on hover,
 * exactly like the source CodePen.
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { getThumbnailListProps } from './shared';

const PLACEHOLDER_THUMBNAIL_URL =
	'https://chance-theater.s3.us-west-1.amazonaws.com/2026/06/blue-gradient.png';

export default function Save( { attributes } ) {
	const { className, style } = getThumbnailListProps( attributes );
	const blockProps = useBlockProps.save( { className, style } );
	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'list-items',
	} );

	return (
		<div { ...blockProps }>
			<div className="thumbnail-list-wrapper">
				<div { ...innerBlocksProps } />

				<div className="thumbnail-container">
					<div className="thumbnail-flipper">
						<img
							className="thumbnail thumbnail-front"
							src={ PLACEHOLDER_THUMBNAIL_URL }
							alt=""
						/>
						<img
							className="thumbnail thumbnail-back"
							src={ PLACEHOLDER_THUMBNAIL_URL }
							alt=""
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
