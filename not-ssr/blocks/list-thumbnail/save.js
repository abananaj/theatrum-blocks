/**
 * Thumbnail List Block Save (parent)
 *
 * Renders the list-item children (via InnerBlocks) alongside a single
 * flip-card preview panel with two faces (front/back). Faces start empty —
 * view.js populates the front face with the first item's thumbnail on load
 * and swaps faces on hover, exactly like the source CodePen.
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { getThumbnailListProps } from './shared';

export default function Save({ attributes }) {
	const { className, style } = getThumbnailListProps(attributes);
	const blockProps = useBlockProps.save({ className, style });
	const innerBlocksProps = useInnerBlocksProps.save({ className: 'list-items' });

	return (
		<div { ...blockProps }>
			<div className="thumbnail-list-wrapper">
				<div { ...innerBlocksProps } />

				<div className="thumbnail-container">
					<div className="thumbnail-flipper">
						<img className="thumbnail thumbnail-front" src="" alt="" />
						<img className="thumbnail thumbnail-back" src="" alt="" />
					</div>
				</div>
			</div>
		</div>
	);
}
