import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { quoteText, citeUrl } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'theatrum-blockquote-text',
	} );

	return (
		<RichText.Content
			tagName="blockquote"
			multiline="p"
			{ ...blockProps }
			cite={ citeUrl || undefined }
			value={ quoteText }
		/>
	);
}
