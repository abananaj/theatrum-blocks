import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { sourceText } = attributes;

	const blockProps = useBlockProps( {
		className: 'theatrum-blockquote-source',
	} );

	return (
		<RichText
			identifier="sourceText"
			tagName="p"
			{ ...blockProps }
			value={ sourceText }
			onChange={ ( value ) => setAttributes( { sourceText: value } ) }
			placeholder={ __( 'Author, work title…', 'theatrum-blocks' ) }
		/>
	);
}
