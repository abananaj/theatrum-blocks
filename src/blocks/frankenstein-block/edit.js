/**
 * WordPress Dependencies
 */
import { InnerBlocks, useBlockProps, RichText } from '@wordpress/block-editor';
import './editor.scss';

const MY_TEMPLATE = [
	[ 'core/heading', { placeholder: 'Title' } ],
	[ 'core/paragraph', { placeholder: 'Summary' } ],
	[ 'core/image', {} ],
];

const Edit = ( props ) => {
	const {
		attributes: { content },
		setAttributes,
	} = props;

	const blockProps = useBlockProps();

	const onChangeContent = ( newContent ) => {
		setAttributes( { content: newContent } );
	};

	return (
		<div { ...blockProps }>
			<RichText
				tagName="p"
				onChange={ onChangeContent }
				value={ content }
				placeholder="Block description"
			/>
			<InnerBlocks template={ MY_TEMPLATE } allowedBlocks={ [ 'core/heading', 'core/paragraph', 'core/image' ] } />
		</div>
	);
};

export default Edit;
