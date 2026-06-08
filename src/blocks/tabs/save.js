import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { tabCount } = attributes;
	const blockProps = useBlockProps.save( {
		style: { '--tab-count': tabCount },
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
