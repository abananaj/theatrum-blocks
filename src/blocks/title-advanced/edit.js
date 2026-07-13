import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'core/paragraph',
		{
			placeholder: 'Pretitle',
			metadata: {
				bindings: {
					content: {
						source: 'chance/post-meta',
						args: { key: 'pretitle' },
					},
				},
			},
		},
	],
	[ 'core/post-title', { level: 1 } ],
	[
		'core/heading',
		{
			level: 2,
			placeholder: 'Subtitle',
			metadata: {
				bindings: {
					content: {
						source: 'chance/post-meta',
						args: { key: 'subtitle' },
					},
				},
			},
		},
	],
];

const ALLOWED_BLOCKS = [ 'core/post-title', 'core/heading', 'core/paragraph' ];

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
