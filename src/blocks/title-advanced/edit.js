import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const TEMPLATE = [
	[ 'core/heading', { level: 1, placeholder: 'Title' } ],
	[ 'core/heading', { level: 2, placeholder: 'Subtitle' } ],
];

const ALLOWED_BLOCKS = [ 'core/heading', 'core/post-title' ];

export default function Edit() {
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<InnerBlocks
				template={ TEMPLATE }
				allowedBlocks={ ALLOWED_BLOCKS }
			/>
		</div>
	);
}
