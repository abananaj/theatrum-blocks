import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { sourceText } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'theatrum-blockquote-source',
	} );

	return (
		<RichText.Content tagName="p" { ...blockProps } value={ sourceText } />
	);
}
