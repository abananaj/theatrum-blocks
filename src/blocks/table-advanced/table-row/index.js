import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

const Edit = () => <tr { ...useBlockProps() }>[td]</tr>;
const save = () => <tr { ...useBlockProps.save() }>[td]</tr>;

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
