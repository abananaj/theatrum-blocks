/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const ALLOWED_BLOCKS = [ 'chance/tab' ];
const TEMPLATE = [ [ 'chance/tab' ], [ 'chance/tab' ] ];

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'ct-production-tabs is-editor',
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks
				allowedBlocks={ ALLOWED_BLOCKS }
				template={ TEMPLATE }
				renderAppender={ InnerBlocks.ButtonBlockAppender }
			/>
		</div>
	);
}
