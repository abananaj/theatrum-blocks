import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

const Edit = () => <thead { ...useBlockProps() }>[tr]</thead>;
const save = () => <thead { ...useBlockProps.save() }>[tr]</thead>;

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
