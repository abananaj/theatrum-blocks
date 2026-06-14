import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

const Edit = () => <tbody {...useBlockProps()}>
	<tr>
		<th>Cell 1</th>
		<td>Cell 2</td>
		<td>Cell 3</td>
	</tr>
</tbody>;
const save = () => <tbody {...useBlockProps.save()}>
	<tr>
		<th>Cell 1</th>
		<td>Cell 2</td>
		<td>Cell 3</td>
	</tr>
</tbody>;

registerBlockType(metadata.name, {
	edit: Edit,
	save,
});
