import './style.scss';
import './editor.scss';
import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
} from '@wordpress/block-editor';
import metadata from './block.json';

const ALLOWED_BLOCKS = [ 'chance/popover-trigger', 'chance/popover-content' ];
const TEMPLATE = [ [ 'chance/popover-trigger' ], [ 'chance/popover-content' ] ];

const Edit = () => {
	const blockProps = useBlockProps( { className: 'ct-popover' } );
	// useInnerBlocksProps (not the bare <InnerBlocks /> component) merges the
	// child blocks directly into this element instead of wrapping them in
	// Gutenberg's own `.block-editor-inner-blocks` / `.block-editor-block-list__layout`
	// divs — the latter carries a hard-coded `position: relative` from core
	// editor CSS, which would become the containing block for the content
	// panel's `position: absolute` instead of this element, and would no
	// longer be a direct sibling of the trigger like it is in the saved
	// (frontend) markup. Matching the frontend's flat structure here is what
	// keeps editor and frontend positioning identical.
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		templateLock: 'all',
	} );

	return <div { ...innerBlocksProps } />;
};

const save = () => {
	const blockProps = useBlockProps.save( { className: 'ct-popover' } );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
};

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
