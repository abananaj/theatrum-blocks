import './style.scss';
import './editor.scss';
import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
} from '@wordpress/block-editor';
import metadata from './block.json';

const ALLOWED_BLOCKS = [
	'theatrum/popover-trigger',
	'theatrum/popover-content',
];
const TEMPLATE = [
	[ 'theatrum/popover-trigger' ],
	[ 'theatrum/popover-content' ],
];

const Edit = () => {
	const blockProps = useBlockProps( { className: 'ct-popover' } );
	// useInnerBlocksProps merges children directly into this element (skipping Gutenberg's `.block-editor-inner-blocks`/`.block-editor-block-list__layout` wrapper divs, which hard-code `position: relative`) so the content panel's `position: absolute` stays anchored to this element and matches the frontend's flat sibling structure.
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
