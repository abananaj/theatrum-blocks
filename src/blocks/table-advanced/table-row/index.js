import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

const Edit = () => <tr {...useBlockProps()}>
	<td>Cell 1</td>
	<td>Cell 2</td>
	<td>Cell 3</td>
</tr>;
const save = () => <tr { ...useBlockProps.save() }>
	<td>Cell 1</td>
	<td>Cell 2</td>
	<td>Cell 3</td>
</tr>;

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
