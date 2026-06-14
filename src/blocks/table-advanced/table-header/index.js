import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

const Edit = () => <thead {...useBlockProps()}>
	<tr>
		<th>Header 1</th>
		<th>Header 2</th>
		<th>Header 3</th>
	</tr>
</thead>;
const save = () => <thead { ...useBlockProps.save() }>
	<tr>
		<th>Header 1</th>
		<th>Header 2</th>
		<th>Header 3</th>
	</tr>
</thead>;

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
