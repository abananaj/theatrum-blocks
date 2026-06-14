import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

const Edit = () => <table {...useBlockProps()} class="tm-table-advanced">
	<caption>Table caption</caption>
	<thead>
		<tr>
			<th>Header 1</th>
			<th>Header 2</th>
			<th>Header 3</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th>Cell 1</th>
			<td>Cell 2</td>
			<td>Cell 3</td>
		</tr>
	</tbody>	
	<tfoot>
		<tr>
			<th>Cell 1</th>
			<td>Cell 2</td>
			<td>Cell 3</td>
		</tr>
	</tfoot>	

</table>;

const save = () => <table { ...useBlockProps.save() } class="tm-table-advanced"></table>;

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
