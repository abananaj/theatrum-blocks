import './style.scss';
import './editor.scss';
import { registerBlockType, createBlock } from '@wordpress/blocks';
import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { PanelBody, ToggleControl } from '@wordpress/components';
import metadata from './block.json';

const tableIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
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

const TEMPLATE = [
	[ 'theatrum/table-caption', {} ],
	[ 'theatrum/table-header', {} ],
	[ 'theatrum/table-body', {} ],
];

const ALLOWED_BLOCKS = [
	'theatrum/table-caption',
	'theatrum/table-header',
	'theatrum/table-body',
	'theatrum/table-footer',
];

const Edit = ( { attributes, setAttributes, clientId } ) => {
	const { hasThead, hasTFoot, tableLayoutFixed } = attributes;
	const blockProps = useBlockProps( { className: 'tm-edit-table' } );

	const { insertBlock, removeBlock } = useDispatch( blockEditorStore );

	const innerBlocks = useSelect(
		( select ) => select( blockEditorStore ).getBlocks( clientId ),
		[ clientId ]
	);

	const onToggleThead = ( value ) => {
		setAttributes( { hasThead: value } );
		const headerBlock = innerBlocks.find(
			( b ) => b.name === 'theatrum/table-header'
		);
		if ( value && ! headerBlock ) {
			const captionIndex = innerBlocks.findIndex(
				( b ) => b.name === 'theatrum/table-caption'
			);
			insertBlock(
				createBlock( 'theatrum/table-header' ),
				captionIndex + 1,
				clientId,
				false
			);
		} else if ( ! value && headerBlock ) {
			removeBlock( headerBlock.clientId );
		}
	};

	const onToggleTfoot = ( value ) => {
		setAttributes( { hasTFoot: value } );
		const footerBlock = innerBlocks.find(
			( b ) => b.name === 'theatrum/table-footer'
		);
		if ( value && ! footerBlock ) {
			const bodyIndex = innerBlocks.findIndex(
				( b ) => b.name === 'theatrum/table-body'
			);
			insertBlock(
				createBlock( 'theatrum/table-footer' ),
				bodyIndex + 1,
				clientId,
				false
			);
		} else if ( ! value && footerBlock ) {
			removeBlock( footerBlock.clientId );
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Table Settings">
					<ToggleControl
						label="Header row"
						checked={ hasThead }
						onChange={ onToggleThead }
					/>
					<ToggleControl
						label="Footer row"
						checked={ hasTFoot }
						onChange={ onToggleTfoot }
					/>
					<ToggleControl
						label="Fixed column widths"
						help={
							tableLayoutFixed
								? 'Columns use fixed widths (table-layout: fixed).'
								: 'Columns size to content (table-layout: auto).'
						}
						checked={ tableLayoutFixed }
						onChange={ ( value ) =>
							setAttributes( { tableLayoutFixed: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlocks
					template={ TEMPLATE }
					allowedBlocks={ ALLOWED_BLOCKS }
				/>
			</div>
		</>
	);
};

const save = ( { attributes } ) => {
	const { tableLayoutFixed } = attributes;
	const className = tableLayoutFixed
		? 'tm-table-advanced table-layout-fixed'
		: 'tm-table-advanced';
	return (
		<table { ...useBlockProps.save( { className } ) }>
			<InnerBlocks.Content />
		</table>
	);
};

registerBlockType( metadata.name, {
	icon: tableIcon,
	edit: Edit,
	save,
} );
