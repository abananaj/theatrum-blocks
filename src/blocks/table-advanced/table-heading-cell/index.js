import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

const Edit = () => <th { ...useBlockProps() }>Heading</th>;
const save = () => <th { ...useBlockProps.save() }>Heading</th>;

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
