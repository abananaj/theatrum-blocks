import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

import metadata from './block.json';

import './style.scss';
import './editor.scss';

/**
 * Recursively collects every core/query block in the editor's block tree, with the queryId
 * WordPress assigned and its post type — Query Loop blocks don't expose queryId in the UI,
 * so this is the only way to tell them apart when a page has more than one.
 *
 * @param {Array} blocks Block list from getBlocks()/innerBlocks.
 * @return {Array<{queryId: number, postType: string}>}
 */
function findQueryLoops( blocks ) {
	let found = [];
	for ( const block of blocks ) {
		if ( block.name === 'core/query' ) {
			found.push( {
				queryId: block.attributes?.queryId ?? 0,
				postType: block.attributes?.query?.postType ?? 'post',
			} );
		}
		if ( block.innerBlocks?.length ) {
			found = found.concat( findQueryLoops( block.innerBlocks ) );
		}
	}
	return found;
}

const TAXONOMY_OPTIONS = [
	{ label: __( 'Season', 'theatrum-blocks' ), value: 'season' },
	{ label: __( 'Series', 'theatrum-blocks' ), value: 'series' },
	{ label: __( 'Tags', 'theatrum-blocks' ), value: 'post_tag' },
];

const TAXONOMY_PARAM_MAP = {
	season: 'season',
	series: 'series',
	post_tag: 'tag',
};

const TAXONOMY_LABEL_MAP = {
	season: __( 'Season', 'theatrum-blocks' ),
	series: __( 'Series', 'theatrum-blocks' ),
	post_tag: __( 'Tag', 'theatrum-blocks' ),
};

function Edit( { attributes, setAttributes } ) {
	const {
		queryId,
		filterType,
		taxonomy,
		paramName,
		label,
		showLabel,
		allLabel,
		layout,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `query-filter query-filter--${ layout }`,
	} );

	const queryLoops = useSelect(
		( select ) =>
			findQueryLoops( select( 'core/block-editor' ).getBlocks() ),
		[]
	);

	function handleFilterTypeChange( value ) {
		setAttributes( { filterType: value } );
	}

	function handleTaxonomyChange( value ) {
		setAttributes( {
			taxonomy: value,
			paramName: TAXONOMY_PARAM_MAP[ value ] ?? value,
			label: TAXONOMY_LABEL_MAP[ value ] ?? label,
		} );
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Filter Settings', 'theatrum-blocks' ) }>
					<SelectControl
						label={ __( 'Target Query Loop', 'theatrum-blocks' ) }
						value={ String( queryId ) }
						options={ [
							{
								label: __( 'None selected', 'theatrum-blocks' ),
								value: '0',
							},
							...queryLoops.map( ( q ) => ( {
								label: sprintf(
									/* translators: 1: post type, 2: query ID */
									__(
										'%1$s — Query ID %2$d',
										'theatrum-blocks'
									),
									q.postType,
									q.queryId
								),
								value: String( q.queryId ),
							} ) ),
						] }
						onChange={ ( value ) =>
							setAttributes( { queryId: Number( value ) } )
						}
						help={
							queryLoops.length === 0
								? __(
										'No Query Loop blocks found on this page yet.',
										'theatrum-blocks'
								  )
								: __(
										'Which Query Loop this filter controls. Required when a page has more than one Query Loop.',
										'theatrum-blocks'
								  )
						}
					/>

					<SelectControl
						label={ __( 'Filter Type', 'theatrum-blocks' ) }
						value={ filterType }
						options={ [
							{
								label: __( 'Taxonomy', 'theatrum-blocks' ),
								value: 'taxonomy',
							},
							{
								label: __( 'Sort Order', 'theatrum-blocks' ),
								value: 'orderby',
							},
						] }
						onChange={ handleFilterTypeChange }
					/>

					{ filterType === 'taxonomy' && (
						<SelectControl
							label={ __( 'Taxonomy', 'theatrum-blocks' ) }
							value={ taxonomy }
							options={ TAXONOMY_OPTIONS }
							onChange={ handleTaxonomyChange }
						/>
					) }

					<TextControl
						label={ __( 'Label', 'theatrum-blocks' ) }
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
					/>

					<ToggleControl
						label={ __( 'Show label', 'theatrum-blocks' ) }
						checked={ showLabel }
						onChange={ ( value ) =>
							setAttributes( { showLabel: value } )
						}
					/>

					{ filterType === 'taxonomy' && (
						<TextControl
							label={ __(
								'"All" option label',
								'theatrum-blocks'
							) }
							value={ allLabel }
							onChange={ ( value ) =>
								setAttributes( { allLabel: value } )
							}
						/>
					) }

					<TextControl
						label={ __( 'URL parameter name', 'theatrum-blocks' ) }
						value={ paramName }
						onChange={ ( value ) =>
							setAttributes( { paramName: value } )
						}
						help={ __(
							'The GET param used in the URL, e.g. ?season=2024',
							'theatrum-blocks'
						) }
					/>

					<SelectControl
						label={ __( 'Layout', 'theatrum-blocks' ) }
						value={ layout }
						options={ [
							{
								label: __( 'Horizontal', 'theatrum-blocks' ),
								value: 'horizontal',
							},
							{
								label: __( 'Vertical', 'theatrum-blocks' ),
								value: 'vertical',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { layout: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="query-filter__preview">
					<span className="query-filter__preview-icon">⚙</span>
					<span className="query-filter__preview-text">
						{ filterType === 'orderby'
							? __( 'Sort Order filter', 'theatrum-blocks' )
							: `${ label } filter (${ taxonomy })` }
					</span>
				</div>
			</div>
		</>
	);
}

registerBlockType( metadata.name, {
	edit: Edit,
	save: () => null,
} );
