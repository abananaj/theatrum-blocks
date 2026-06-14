import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

const Edit = () => <td { ...useBlockProps() }>table cell</td>;
const save = () => <td { ...useBlockProps.save() }>table cell</td>;

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
