import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import {
	SelectControl,
	TextControl,
	Spinner,
	PanelBody,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

const META_KEY_OPTIONS = [
	{ label: 'Season Producers', value: 'season_producers' },
	{
		label: 'Associate Season Producers',
		value: 'associate_season_producers',
	},
];

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const {
		displayType = 'generic',
		taxonomy,
		termId,
		metaKey,
		prepend,
		append,
		headingText,
		headingLevel,
	} = attributes;
	const isSeasonProducer = displayType === 'season-producer';

	const [ taxonomies, setTaxonomies ] = useState( [] );
	const [ terms, setTerms ] = useState( [] );
	const [ isLoadingTaxonomies, setIsLoadingTaxonomies ] = useState( true );
	const [ isLoadingTerms, setIsLoadingTerms ] = useState( false );

	// Fetch all taxonomies on mount (for generic display)
	useEffect( () => {
		if ( isSeasonProducer ) {
			return;
		}

		apiFetch( { path: '/wp/v2/taxonomies?context=edit' } )
			.then( ( data ) => {
				const options = Object.values( data ).map( ( tax ) => ( {
					label: tax.name,
					value: tax.rest_base,
				} ) );
				setTaxonomies( options );
				setIsLoadingTaxonomies( false );
			} )
			.catch( () => setIsLoadingTaxonomies( false ) );
	}, [ isSeasonProducer ] );

	// Fetch terms when taxonomy changes (for generic display)
	useEffect( () => {
		if ( isSeasonProducer || ! taxonomy ) {
			setTerms( [] );
			return;
		}

		setIsLoadingTerms( true );
		setAttributes( { termId: 0 } );

		apiFetch( {
			path: `/wp/v2/${ taxonomy }?per_page=100&orderby=name&order=asc&context=edit`,
		} )
			.then( ( data ) => {
				const options = data.map( ( term ) => ( {
					label: term.name,
					value: term.id,
				} ) );
				setTerms( options );
				setIsLoadingTerms( false );
			} )
			.catch( () => {
				setTerms( [] );
				setIsLoadingTerms( false );
			} );
	}, [ isSeasonProducer, taxonomy ] );

	const selectedTermLabel = terms.find( ( t ) => t.value === termId )?.label;

	// Render season producer UI
	if ( isSeasonProducer ) {
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody
						title="Season Producer Settings"
						initialOpen={ true }
					>
						<SelectControl
							label="Field"
							value={ metaKey || 'season_producers' }
							options={ META_KEY_OPTIONS }
							onChange={ ( value ) =>
								setAttributes( { metaKey: value } )
							}
							help="Select which producer field to display from the season term."
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</PanelBody>
					<PanelBody title="Heading" initialOpen={ false }>
						<TextControl
							label="Heading Text"
							value={ headingText || '' }
							onChange={ ( value ) =>
								setAttributes( { headingText: value } )
							}
							placeholder="e.g., Season Producers"
							help="Appears before the list. Hidden when there are no producers."
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						<SelectControl
							label="Heading Level"
							value={ headingLevel || 'h2' }
							onChange={ ( value ) =>
								setAttributes( { headingLevel: value } )
							}
							options={ [
								{ label: 'H2', value: 'h2' },
								{ label: 'H3', value: 'h3' },
								{ label: 'H4', value: 'h4' },
								{ label: 'H5', value: 'h5' },
								{ label: 'H6', value: 'h6' },
							] }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...blockProps }>
					<ServerSideRender
						block="chance/term-meta"
						attributes={ attributes }
					/>
				</div>
			</Fragment>
		);
	}

	// Render generic term meta UI
	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title="Term" initialOpen={ true }>
					{ isLoadingTaxonomies ? (
						<Spinner />
					) : (
						<SelectControl
							label="Taxonomy"
							value={ taxonomy }
							options={ [
								{ label: '— Select taxonomy —', value: '' },
								...taxonomies,
							] }
							onChange={ ( value ) =>
								setAttributes( { taxonomy: value, termId: 0 } )
							}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
					{ taxonomy &&
						( isLoadingTerms ? (
							<Spinner />
						) : (
							<SelectControl
								label="Term"
								value={ termId }
								options={ [
									{ label: '— Select term —', value: 0 },
									...terms,
								] }
								onChange={ ( value ) =>
									setAttributes( {
										termId: parseInt( value ),
									} )
								}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						) ) }
				</PanelBody>
				<PanelBody title="Meta" initialOpen={ true }>
					<TextControl
						label="Meta Key"
						value={ metaKey || '' }
						onChange={ ( value ) =>
							setAttributes( { metaKey: value } )
						}
						placeholder="e.g., description, color, icon"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Prepend"
						value={ prepend || '' }
						onChange={ ( value ) =>
							setAttributes( { prepend: value } )
						}
						placeholder="Text before value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Append"
						value={ append || '' }
						onChange={ ( value ) =>
							setAttributes( { append: value } )
						}
						placeholder="Text after value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ termId && metaKey ? (
					<ServerSideRender
						block="chance/term-meta"
						attributes={ attributes }
					/>
				) : (
					<p
						style={ {
							color: '#999',
							fontStyle: 'italic',
							margin: 0,
						} }
					>
						{ selectedTermLabel
							? `Enter a meta key for “${ selectedTermLabel }”`
							: 'Select a taxonomy, term, and meta key' }
					</p>
				) }
			</div>
		</Fragment>
	);
}
