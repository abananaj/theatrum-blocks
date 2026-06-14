import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

const Edit = () => <tbody { ...useBlockProps() }>[tr]</tbody>;
const save = () => <tbody { ...useBlockProps.save() }>[tr]</tbody>;

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
