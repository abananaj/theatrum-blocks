import { registerBlockType, createBlock } from '@wordpress/blocks';
import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import metadata from './block.json';

const thIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
		<rect
			x="7.491"
			y="43.149"
			width="98.598"
			height="151.791"
			style={ {
				fill: 'rgb(48, 0, 176)',
				transformBox: 'fill-box',
				transformOrigin: '50% 50%',
			} }
			rx="41.088"
			ry="41.088"
			transform="matrix(0, 1, -1, 0.001578, 54.685905, 46.659229)"
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

const TEMPLATE = [ [ 'core/paragraph', { placeholder: 'Header content' } ] ];

const Edit = ( { attributes, setAttributes } ) => {
	const { colspan, rowspan, scope, abbr, headers } = attributes;
	const columnWidth = attributes.style?.dimensions?.width;
	const blockProps = useBlockProps( {
		className: 'tm-edit-th',
		'data-has-column-width': columnWidth ? '' : undefined,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Header Cell Settings">
					<SelectControl
						label="Scope"
						value={ scope || '' }
						options={ [
							{ label: 'None', value: '' },
							{ label: 'Column (col)', value: 'col' },
							{ label: 'Row (row)', value: 'row' },
							{
								label: 'Column group (colgroup)',
								value: 'colgroup',
							},
							{
								label: 'Row group (rowgroup)',
								value: 'rowgroup',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { scope: value } )
						}
					/>
					<RangeControl
						label="Column span"
						value={ colspan || 1 }
						onChange={ ( value ) =>
							setAttributes( { colspan: value } )
						}
						min={ 1 }
						max={ 10 }
					/>
					<RangeControl
						label="Row span"
						value={ rowspan || 1 }
						onChange={ ( value ) =>
							setAttributes( { rowspan: value } )
						}
						min={ 1 }
						max={ 10 }
					/>
					<TextControl
						label="Abbreviation"
						value={ abbr || '' }
						onChange={ ( value ) =>
							setAttributes( { abbr: value } )
						}
						help="Short label for this header (used in mobile/narrow contexts)."
					/>
					<TextControl
						label="Headers"
						value={ headers || '' }
						onChange={ ( value ) =>
							setAttributes( { headers: value } )
						}
						help="Space-separated list of header cell IDs this cell relates to."
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlocks
					template={ TEMPLATE }
					allowedBlocks={ [
						'core/paragraph',
						'core/list',
						'core/image',
						'core/icon',
					] }
				/>
			</div>
		</>
	);
};

const save = ( { attributes } ) => {
	const { colspan, rowspan, scope, abbr, headers } = attributes;
	// Color and border supports use __experimentalSkipSerialization, so apply
	// their classes/styles manually here — otherwise they never reach the markup.
	const colorProps = getColorClassesAndStyles( attributes );
	const borderProps = getBorderClassesAndStyles( attributes );
	const blockProps = useBlockProps.save( {
		className: [
			'tm-table-heading-cell',
			colorProps.className,
			borderProps.className,
		]
			.filter( Boolean )
			.join( ' ' ),
		style: { ...colorProps.style, ...borderProps.style },
	} );
	const extraProps = {};
	if ( colspan > 1 ) {
		extraProps.colSpan = colspan;
	}
	if ( rowspan > 1 ) {
		extraProps.rowSpan = rowspan;
	}
	if ( scope ) {
		extraProps.scope = scope;
	}
	if ( abbr ) {
		extraProps.abbr = abbr;
	}
	if ( headers ) {
		extraProps.headers = headers;
	}

	return (
		<th { ...blockProps } { ...extraProps }>
			<InnerBlocks.Content />
		</th>
	);
};

// v1: original save without serialized color/border. Lets existing header
// cells validate and auto-migrate once color serialization was added.
const v1 = {
	attributes: metadata.attributes,
	supports: metadata.supports,
	save: ( { attributes } ) => {
		const { colspan, rowspan, scope, abbr, headers } = attributes;
		const blockProps = useBlockProps.save( {
			className: 'tm-table-heading-cell',
		} );
		const extraProps = {};
		if ( colspan > 1 ) {
			extraProps.colSpan = colspan;
		}
		if ( rowspan > 1 ) {
			extraProps.rowSpan = rowspan;
		}
		if ( scope ) {
			extraProps.scope = scope;
		}
		if ( abbr ) {
			extraProps.abbr = abbr;
		}
		if ( headers ) {
			extraProps.headers = headers;
		}

		return (
			<th { ...blockProps } { ...extraProps }>
				<InnerBlocks.Content />
			</th>
		);
	},
};

registerBlockType( metadata.name, {
	icon: thIcon,
	edit: Edit,
	save,
	deprecated: [ v1 ],
	transforms: {
		to: [
			{
				type: 'block',
				blocks: [ 'theatrum/table-cell' ],
				transform: ( { colspan, rowspan, headers }, innerBlocks ) =>
					createBlock(
						'theatrum/table-cell',
						{
							colspan: colspan ?? 1,
							rowspan: rowspan ?? 1,
							headers: headers ?? '',
						},
						innerBlocks
					),
			},
		],
	},
} );
