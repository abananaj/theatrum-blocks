import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

const Edit = () => <tfoot { ...useBlockProps() }>[tr]</tfoot>;
const save = () => <tfoot { ...useBlockProps.save() }>[tr]</tfoot>;

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
