import { useBlockProps, InspectorControls, BlockAlignmentToolbar } from '@wordpress/block-editor';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import { Button, TextControl, SelectControl, TextareaControl, CheckboxControl, Placeholder } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

function isMediaFile( file ) {
	return file.mime && ( file.mime.startsWith( 'image/' ) || file.mime.startsWith( 'video/' ) );
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		mediaId,
		mediaUrl,
		mediaAlt,
		mediaType,
		triggerText,
		linkType,
		linkUrl,
		linkPageId,
		linkTarget,
		width,
		widthUnit,
		alignment,
	} = attributes;

	const [ pages, setPages ] = useState( [] );
	const [ loadingPages, setLoadingPages ] = useState( false );

	const blockProps = useBlockProps( {
		className: `align${ alignment ? alignment.charAt( 0 ).toUpperCase() + alignment.slice( 1 ) : '' }`,
	} );

	const handleSelectMedia = ( media ) => {
		if ( ! isMediaFile( media ) ) {
			alert( 'Please select an image or video file' );
			return;
		}

		const type = media.mime.startsWith( 'video/' ) ? 'video' : 'image';

		setAttributes( {
			mediaId: media.id,
			mediaUrl: media.url,
			mediaAlt: media.alt || '',
			mediaType: type,
		} );
	};

	const handleRemoveMedia = () => {
		setAttributes( {
			mediaId: 0,
			mediaUrl: '',
			mediaAlt: '',
			mediaType: 'image',
		} );
	};

	const handleLinkTypeChange = ( newLinkType ) => {
		setAttributes( { linkType: newLinkType } );

		if ( newLinkType === 'page' && pages.length === 0 ) {
			setLoadingPages( true );
			apiFetch( { path: '/wp/v2/pages?per_page=100&_fields=id,title' } )
				.then( ( data ) => {
					setPages( data );
					setLoadingPages( false );
				} )
				.catch( () => {
					setLoadingPages( false );
				} );
		}
	};

	const previewStyle = {
		width: `${ width }${ widthUnit }`,
		height: 'auto',
		display: 'block',
		margin: alignment === 'center' ? '0 auto' : undefined,
		border: '2px dashed #ccc',
		borderRadius: '4px',
		padding: '16px',
	};

	return (
		<Fragment>
			<InspectorControls>
				<div style={ { padding: '16px' } }>
					<h3 style={ { margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 } }>
						Media
					</h3>

					<MediaUploadCheck>
						<MediaUpload
							onSelect={ handleSelectMedia }
							allowedTypes={ [ 'image', 'video' ] }
							value={ mediaId }
							render={ ( { open } ) => (
								<Button
									onClick={ open }
									variant="primary"
									style={ { marginBottom: '16px', width: '100%' } }
								>
									{ mediaUrl ? 'Replace Media' : 'Select Media' }
								</Button>
							) }
						/>
					</MediaUploadCheck>

					{ mediaUrl && (
						<Button
							onClick={ handleRemoveMedia }
							variant="secondary"
							isDestructive
							style={ { width: '100%', marginBottom: '16px' } }
						>
							Remove Media
						</Button>
					) }

					<TextControl
						label="Trigger Text"
						value={ triggerText }
						onChange={ ( value ) =>
							setAttributes( { triggerText: value } )
						}
						placeholder="Hover to view"
						help="Text displayed as the hover trigger"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>

					<h3 style={ { margin: '16px 0 8px 0', fontSize: '14px', fontWeight: 600 } }>
						Link
					</h3>

					<SelectControl
						label="Link Type"
						value={ linkType }
						onChange={ handleLinkTypeChange }
						options={ [
							{ label: 'None', value: 'none' },
							{ label: 'External URL', value: 'url' },
							{ label: 'Page', value: 'page' },
						] }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>

					{ linkType === 'url' && (
						<Fragment>
							<TextControl
								label="URL"
								value={ linkUrl }
								onChange={ ( value ) =>
									setAttributes( { linkUrl: value } )
								}
								placeholder="https://example.com"
								type="url"
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								style={ { marginTop: '8px' } }
							/>
							<CheckboxControl
								label="Open in new tab"
								checked={ linkTarget }
								onChange={ ( value ) =>
									setAttributes( { linkTarget: value } )
								}
								style={ { marginTop: '8px' } }
							/>
						</Fragment>
					) }

					{ linkType === 'page' && (
						<SelectControl
							label="Page"
							value={ linkPageId }
							onChange={ ( value ) =>
								setAttributes( { linkPageId: parseInt( value ) } )
							}
							options={ [
								{ label: 'Select a page...', value: 0 },
								...pages.map( ( page ) => ( {
									label: page.title.rendered,
									value: page.id,
								} ) ),
							] }
							disabled={ loadingPages }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							style={ { marginTop: '8px' } }
						/>
					) }

					<h3 style={ { margin: '16px 0 8px 0', fontSize: '14px', fontWeight: 600 } }>
						Size
					</h3>

					<div style={ { display: 'flex', gap: '8px' } }>
						<TextControl
							label="Width"
							value={ width }
							onChange={ ( value ) =>
								setAttributes( { width: value } )
							}
							type="number"
							min="1"
							style={ { flex: 1 } }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						<SelectControl
							value={ widthUnit }
							onChange={ ( value ) =>
								setAttributes( { widthUnit: value } )
							}
							options={ [
								{ label: 'px', value: 'px' },
								{ label: '%', value: '%' },
								{ label: 'em', value: 'em' },
								{ label: 'rem', value: 'rem' },
							] }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</div>
				</div>
			</InspectorControls>

			<div { ...blockProps }>
				{ ! mediaUrl ? (
					<Placeholder icon="image" label="Media Popover">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ handleSelectMedia }
								allowedTypes={ [ 'image', 'video' ] }
								render={ ( { open } ) => (
									<Button
										onClick={ open }
										variant="primary"
									>
										Select Media
									</Button>
								) }
							/>
						</MediaUploadCheck>
					</Placeholder>
				) : (
					<div style={ previewStyle } className="media-popover-preview">
						<div
							style={ {
								textAlign: 'center',
								color: '#666',
								marginBottom: '8px',
							} }
						>
							Popover Preview
						</div>
						{ mediaType === 'video' ? (
							<video
								src={ mediaUrl }
								style={ {
									width: '100%',
									height: 'auto',
									borderRadius: '4px',
								} }
								controls
							/>
						) : (
							<img
								src={ mediaUrl }
								alt={ mediaAlt }
								style={ {
									width: '100%',
									height: 'auto',
									borderRadius: '4px',
									display: 'block',
								} }
							/>
						) }
						<div
							style={ {
								marginTop: '8px',
								padding: '8px',
								backgroundColor: '#f5f5f5',
								borderRadius: '4px',
								textAlign: 'center',
								fontSize: '12px',
								color: '#333',
							} }
						>
							{ triggerText }
						</div>
						{ linkType !== 'none' && (
							<div
								style={ {
									marginTop: '8px',
									fontSize: '11px',
									color: '#999',
									textAlign: 'center',
								} }
							>
								🔗 Linked
								{ linkTarget ? ' (new tab)' : '' }
							</div>
						) }
					</div>
				) }
			</div>
		</Fragment>
	);
}
