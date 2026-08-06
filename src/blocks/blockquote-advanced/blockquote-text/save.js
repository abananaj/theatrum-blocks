import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { citeUrl } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'theatrum-blockquote-text',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <blockquote { ...innerBlocksProps } cite={ citeUrl || undefined } />;
}
