import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	Fragment,
	useState,
	useEffect,
	useRef,
	createElement,
} from '@wordpress/element';
import {
	SelectControl,
	TextControl,
	Spinner,
	PanelBody,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

const META_KEY_OPTIONS = [
	{ label: 'Season Producers', value: 'season_producers' },
	{
		label: 'Associate Season Producers',
		value: 'associate_season_producers',
	},
];

export default function Edit( { attributes, setAttributes, context } ) {
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
	const [ metaValue, setMetaValue ] = useState( '' );
	const [ metaItems, setMetaItems ] = useState( [] );
	const [ producers, setProducers ] = useState( [] );
	const [ isLoadingTaxonomies, setIsLoadingTaxonomies ] = useState( true );
	const [ isLoadingTerms, setIsLoadingTerms ] = useState( false );
	const [ isLoadingMeta, setIsLoadingMeta ] = useState( false );
	const [ isLoadingProducers, setIsLoadingProducers ] = useState( false );

	const editorPostId = useSelect( ( select ) =>
		select( 'core/editor' ).getCurrentPostId()
	);
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

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
	const isInitialTaxonomyRun = useRef( true );
	useEffect( () => {
		if ( isSeasonProducer || ! taxonomy ) {
			setTerms( [] );
			return;
		}

		setIsLoadingTerms( true );

		// Don't clobber a previously saved termId when the block first mounts
		// with an existing taxonomy — only reset it when the user actually
		// changes the taxonomy afterwards.
		if ( isInitialTaxonomyRun.current ) {
			isInitialTaxonomyRun.current = false;
		} else {
			setAttributes( { termId: 0 } );
		}

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

	// Fetch meta value when termId or metaKey changes (for generic display)
	useEffect( () => {
		if ( isSeasonProducer || ! termId || ! metaKey ) {
			setMetaValue( '' );
			setMetaItems( [] );
			return;
		}

		setIsLoadingMeta( true );

		apiFetch( {
			path: `/theatrum/v1/term-meta-field/${ termId }/${ metaKey }`,
		} )
			.then( ( data ) => {
				setMetaValue( data.value || '' );
				setMetaItems( data.items || [] );
				setIsLoadingMeta( false );
			} )
			.catch( () => {
				setMetaValue( '' );
				setMetaItems( [] );
				setIsLoadingMeta( false );
			} );
	}, [ isSeasonProducer, termId, metaKey ] );

	// Fetch season producers (for season-producer display)
	useEffect( () => {
		if ( ! isSeasonProducer || ! postId ) {
			setProducers( [] );
			return;
		}

		setIsLoadingProducers( true );

		apiFetch( {
			path: `/theatrum/v1/season-producer/${ postId }/${ metaKey }`,
		} )
			.then( ( data ) => {
				setProducers( data.producers || [] );
				setIsLoadingProducers( false );
			} )
			.catch( () => {
				setProducers( [] );
				setIsLoadingProducers( false );
			} );
	}, [ isSeasonProducer, postId, metaKey ] );

	const decodeHtmlEntities = ( text ) => {
		const textarea = document.createElement( 'textarea' );
		textarea.innerHTML = text;
		return textarea.value;
	};

	const HeadingTag = headingLevel || 'h2';
	const headingEl = headingText
		? createElement(
				HeadingTag,
				{ className: 'season-producer-heading' },
				headingText
		  )
		: null;

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
					{ isLoadingProducers ? (
						<Spinner />
					) : producers.length > 0 ? (
						<Fragment>
							{ headingEl }
							<ul className="season-producer-list">
								{ producers.map( ( producer ) => (
									<li
										key={ producer.id }
										className="season-producer-item"
									>
										{ decodeHtmlEntities( producer.title ) }
									</li>
								) ) }
							</ul>
						</Fragment>
					) : (
						<Fragment>
							{ headingEl }
							<p
								style={ {
									color: '#999',
									fontStyle: 'italic',
									margin: 0,
								} }
							>
								{ postId
									? 'No season producers found for this post.'
									: 'Season producer names will appear here.' }
							</p>
						</Fragment>
					) }
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
				{ isLoadingMeta ? (
					<Spinner />
				) : metaItems.length > 0 ? (
					<p style={ { margin: 0, padding: '8px 0' } }>
						{ prepend }
						{ metaItems.map( ( item, i ) => (
							<Fragment
								key={ item.id || `${ item.title }-${ i }` }
							>
								{ i > 0 && ', ' }
								{ item.url ? (
									<a
										href={ item.url }
										onClick={ ( event ) =>
											event.preventDefault()
										}
									>
										{ decodeHtmlEntities( item.title ) }
									</a>
								) : (
									decodeHtmlEntities( item.title )
								) }
							</Fragment>
						) ) }
						{ append }
					</p>
				) : metaValue ? (
					<p style={ { margin: 0, padding: '8px 0' } }>{ `${
						prepend || ''
					}${ metaValue }${ append || '' }` }</p>
				) : termId && metaKey ? (
					<p style={ { margin: 0 } }>{ `[${ metaKey }]` }</p>
				) : (
					<p
						style={ {
							margin: 0,
							color: '#999',
							fontStyle: 'italic',
						} }
					>
						Select a taxonomy, term, and meta key
					</p>
				) }
			</div>
		</Fragment>
	);
}
