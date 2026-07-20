import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';
const theadIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
		<rect
			x="33.684"
			y="27.364"
			width="443.36"
			height="96.263"
			style={ { fill: 'rgb(48, 0, 176)' } }
			rx="41.088"
			ry="41.088"
			transform="matrix(0.999999, 0.001578, 0, 1.000001, -5.754955, -0.394341)"
		/>
		<g
			id="Layer_31"
			data-name="Layer 31"
			transform="matrix(7.627119, 0, 0, 7.627119, 5.932192, 5.779642)"
		>
			<path
				d="m60 13.7h-56a1.5 1.5 0 0 0 -1.5 1.5v33.6a1.5 1.5 0 0 0 1.5 1.5h17.17v9.7a1.5 1.5 0 0 0 1.5 1.5h18.66a1.5 1.5 0 0 0 1.5-1.5v-9.7h17.17a1.5 1.5 0 0 0 1.5-1.5v-33.6a1.5 1.5 0 0 0 -1.5-1.5zm-35.83 33.6v-8.2h15.66v8.2zm-18.67-19.4h15.67v8.2h-15.67zm34.33 8.2h-15.66v-8.2h15.66zm3-8.2h15.67v8.2h-15.67zm15.67-3h-15.67v-8.2h15.67zm-18.67 0h-15.66v-8.2h15.66zm-34.33-8.2h15.67v8.2h-15.67zm0 22.4h15.67v8.2h-15.67zm34.33 19.4h-15.66v-8.2h15.66zm18.67-11.2h-15.67v-8.2h15.67z"
				fill="#ff5c01"
			/>
			<path d="m55.46 61.5h-46.92a6 6 0 0 1 -6-6v-46.96a6 6 0 0 1 6-6h46.92a6 6 0 0 1 6 6v46.92a6 6 0 0 1 -6 6.04zm-46.92-56a3 3 0 0 0 -3 3v46.96a3 3 0 0 0 3 3h46.92a3 3 0 0 0 3-3v-46.92a3 3 0 0 0 -3-3z" />
		</g>
	</svg>
);

const TEMPLATE = [ [ 'theatrum/table-row', {} ] ];

const Edit = () => {
	const blockProps = useBlockProps( { className: 'tm-edit-thead' } );
	return (
		<div { ...blockProps }>
			<InnerBlocks
				template={ TEMPLATE }
				allowedBlocks={ [ 'theatrum/table-row' ] }
			/>
		</div>
	);
};

const save = () => (
	<thead { ...useBlockProps.save( { className: 'tm-table-header' } ) }>
		<InnerBlocks.Content />
	</thead>
);

registerBlockType( metadata.name, {
	edit: Edit,
	save,
	icon: theadIcon,
} );
