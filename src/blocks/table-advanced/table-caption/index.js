import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

const Edit = () => <caption { ...useBlockProps() }>Table Title</caption>;
const save = () => <caption { ...useBlockProps.save() }>Table Title</caption>;

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
