/**
 * Card Carousel Block - Editor
 *
 * Allows users to edit carousel headline and items (cards with images, titles, and subtitles)
 */

import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import {
	TextControl,
	TextareaControl,
	PanelBody,
	Button,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

/**
 * Generate a simple unique ID
 */
const generateId = () => {
	return (
		'item-' +
		Math.random().toString( 36 ).slice( 2, 11 ) +
		Date.now().toString( 36 )
	);
};

export default function Edit( { attributes, setAttributes } ) {
	const { headline, items } = attributes;
	const blockProps = useBlockProps();
	const [ selectedItemId, setSelectedItemId ] = useState( null );

	const selectedItem = items?.find( ( item ) => item.id === selectedItemId );

	const handleAddItem = () => {
		const newItem = {
			id: generateId(),
			title: 'Card Title',
			subtitle: 'Card Subtitle',
			image: '',
			imageId: 0,
			link: '',
		};
		setAttributes( { items: [ ...( items || [] ), newItem ] } );
		setSelectedItemId( newItem.id );
	};

	const handleUpdateItem = ( property, value ) => {
		const updatedItems = items.map( ( item ) =>
			item.id === selectedItemId ? { ...item, [ property ]: value } : item
		);
		setAttributes( { items: updatedItems } );
	};

	const handleSelectImage = ( media ) => {
		const updatedItems = items.map( ( item ) =>
			item.id === selectedItemId
				? { ...item, image: media.url, imageId: media.id }
				: item
		);
		setAttributes( { items: updatedItems } );
	};

	const handleRemoveItem = ( itemId ) => {
		const updatedItems = items.filter( ( item ) => item.id !== itemId );
		setAttributes( { items: updatedItems } );
		setSelectedItemId( null );
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ __( 'Carousel Settings', 'card-carousel' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Headline', 'card-carousel' ) }
						value={ headline || '' }
						onChange={ ( value ) =>
							setAttributes( { headline: value } )
						}
						help={ __(
							'Main headline for the carousel',
							'card-carousel'
						) }
					/>

					<Button variant="primary" onClick={ handleAddItem }>
						{ __( 'Add Card', 'card-carousel' ) }
					</Button>
				</PanelBody>

				{ selectedItem && (
					<PanelBody
						title={ __( 'Card Settings', 'card-carousel' ) }
						initialOpen={ true }
					>
						<TextControl
							label={ __( 'Title', 'card-carousel' ) }
							value={ selectedItem.title || '' }
							onChange={ ( value ) =>
								handleUpdateItem( 'title', value )
							}
						/>

						<TextareaControl
							label={ __( 'Subtitle', 'card-carousel' ) }
							value={ selectedItem.subtitle || '' }
							onChange={ ( value ) =>
								handleUpdateItem( 'subtitle', value )
							}
						/>

						<TextControl
							label={ __( 'Link URL', 'card-carousel' ) }
							value={ selectedItem.link || '' }
							onChange={ ( value ) =>
								handleUpdateItem( 'link', value )
							}
							type="url"
						/>

						<MediaUploadCheck>
							<MediaUpload
								onSelect={ handleSelectImage }
								allowedTypes={ [ 'image' ] }
								value={ selectedItem.imageId }
								render={ ( { open } ) => (
									<Button
										onClick={ open }
										variant="secondary"
									>
										{ selectedItem.image
											? __(
													'Change Image',
													'card-carousel'
											  )
											: __(
													'Select Image',
													'card-carousel'
											  ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>

						{ selectedItem.image && (
							<div style={ { marginTop: '10px' } }>
								<img
									src={ selectedItem.image }
									alt={ selectedItem.title }
									style={ {
										maxWidth: '100%',
										height: 'auto',
									} }
								/>
							</div>
						) }

						<Button
							isDestructive
							onClick={ () => handleRemoveItem( selectedItemId ) }
							style={ { marginTop: '10px' } }
						>
							{ __( 'Remove Card', 'card-carousel' ) }
						</Button>
					</PanelBody>
				) }

				{ items && items.length > 0 && (
					<PanelBody
						title={ __( 'Cards', 'card-carousel' ) }
						initialOpen={ false }
					>
						{ items.map( ( item ) => (
							<Button
								key={ item.id }
								onClick={ () => setSelectedItemId( item.id ) }
								isPressed={ selectedItemId === item.id }
								style={ {
									display: 'block',
									width: '100%',
									marginBottom: '5px',
									textAlign: 'left',
								} }
							>
								{ item.title || 'Untitled Card' }
							</Button>
						) ) }
					</PanelBody>
				) }
			</InspectorControls>

			<div { ...blockProps }>
				<h2>{ headline || __( 'Card Carousel', 'card-carousel' ) }</h2>
				<div
					style={ {
						border: '1px solid #ccc',
						padding: '10px',
						minHeight: '200px',
						background: '#f9f9f9',
					} }
				>
					{ items && items.length > 0 ? (
						<ul
							style={ {
								display: 'flex',
								gap: '10px',
								listStyle: 'none',
								padding: 0,
								margin: 0,
								overflowX: 'auto',
							} }
						>
							{ items.map( ( item ) => (
								<li
									key={ item.id }
									onClick={ () =>
										setSelectedItemId( item.id )
									}
									style={ {
										flex: '0 0 200px',
										border:
											selectedItemId === item.id
												? '2px solid blue'
												: '1px solid #ccc',
										padding: '10px',
										cursor: 'pointer',
										background: 'white',
									} }
								>
									{ item.image && (
										<img
											src={ item.image }
											alt={ item.title }
											style={ {
												width: '100%',
												height: '120px',
												objectFit: 'cover',
												marginBottom: '5px',
											} }
										/>
									) }
									<h4 style={ { margin: '5px 0' } }>
										{ item.title }
									</h4>
									<p
										style={ {
											margin: '0',
											fontSize: '0.9em',
										} }
									>
										{ item.subtitle }
									</p>
								</li>
							) ) }
						</ul>
					) : (
						<p>
							{ __(
								'Add cards to get started',
								'card-carousel'
							) }
						</p>
					) }
				</div>
			</div>
		</Fragment>
	);
}
