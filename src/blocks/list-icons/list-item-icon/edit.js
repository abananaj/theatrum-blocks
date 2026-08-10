/**
 * Icon List Item Block Editor (child of theatrum/list-icons)
 *
 * Renders a single `<li>` with an optional icon and editable text. Pressing
 * Enter splits the item into a new sibling (like core/list-item); backspacing
 * an empty item merges/removes it. Icon styling comes from the parent via CSS
 * custom properties, so this block stays static markup.
 */

import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { Fragment, useState } from '@wordpress/element';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

const isSvgUrl = ( url ) =>
	typeof url === 'string' &&
	url.toLowerCase().split( '?' )[ 0 ].endsWith( '.svg' );

export default function Edit( {
	attributes,
	setAttributes,
	onReplace,
	mergeBlocks,
	onRemove,
	clientId,
} ) {
	const { text, iconId, iconUrl, iconAlt } = attributes;
	const blockProps = useBlockProps( { className: 'list-icons-item' } );
	const iconIsSvg = isSvgUrl( iconUrl );

	const [ isEditingUrl, setIsEditingUrl ] = useState( false );
	const [ urlInput, setUrlInput ] = useState( iconUrl );

	const setIcon = ( media ) => {
		setAttributes( {
			iconId: media.id,
			iconUrl: media.url,
			iconAlt: media.alt || '',
		} );
		setIsEditingUrl( false );
	};

	const applyIconUrl = () => {
		if ( ! urlInput ) {
			return;
		}
		setAttributes( { iconId: 0, iconUrl: urlInput, iconAlt } );
		setIsEditingUrl( false );
	};

	const removeIcon = () => {
		setAttributes( { iconId: 0, iconUrl: '', iconAlt: '' } );
		setIsEditingUrl( false );
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ __( 'Icon', 'theatrum-blocks' ) }
					initialOpen={ true }
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ setIcon }
							allowedTypes={ [ 'image' ] }
							value={ iconId }
							render={ ( { open } ) => (
								<Button
									onClick={ open }
									variant="primary"
									style={ {
										marginBottom: '8px',
										width: '100%',
										justifyContent: 'center',
									} }
								>
									{ iconUrl
										? __(
												'Replace Icon',
												'theatrum-blocks'
										  )
										: __(
												'Select Icon',
												'theatrum-blocks'
										  ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>

					<Button
						variant="link"
						onClick={ () => {
							setUrlInput( iconUrl );
							setIsEditingUrl( ( prev ) => ! prev );
						} }
						style={ { marginBottom: '8px' } }
					>
						{ __( 'Or enter an icon URL', 'theatrum-blocks' ) }
					</Button>

					{ isEditingUrl && (
						<form
							onSubmit={ ( event ) => {
								event.preventDefault();
								applyIconUrl();
							} }
							style={ { marginBottom: '8px' } }
						>
							<TextControl
								type="url"
								label={ __( 'Icon URL', 'theatrum-blocks' ) }
								value={ urlInput }
								onChange={ setUrlInput }
								placeholder="https://"
							/>
							<Button
								variant="secondary"
								type="submit"
								style={ {
									width: '100%',
									justifyContent: 'center',
								} }
							>
								{ __( 'Apply', 'theatrum-blocks' ) }
							</Button>
						</form>
					) }

					{ iconUrl && (
						<Fragment>
							<img
								src={ iconUrl }
								alt={ iconAlt }
								style={ {
									maxWidth: '100%',
									height: 'auto',
									maxHeight: '60px',
									marginBottom: '8px',
								} }
							/>
							<Button
								onClick={ removeIcon }
								variant="secondary"
								isDestructive
								style={ {
									width: '100%',
									justifyContent: 'center',
								} }
							>
								{ __( 'Remove Icon', 'theatrum-blocks' ) }
							</Button>
						</Fragment>
					) }
				</PanelBody>
			</InspectorControls>

			<li { ...blockProps }>
				{ iconUrl && iconIsSvg && (
					<span
						className="list-icons-icon list-icons-icon--svg"
						style={ {
							'--list-icon-svg-url': `url("${ iconUrl }")`,
						} }
						role={ iconAlt ? 'img' : undefined }
						aria-label={ iconAlt || undefined }
						aria-hidden={ iconAlt ? undefined : 'true' }
					/>
				) }
				{ iconUrl && ! iconIsSvg && (
					<img
						src={ iconUrl }
						alt={ iconAlt }
						className="list-icons-icon"
					/>
				) }
				<RichText
					identifier="text"
					tagName="span"
					className="list-icons-text"
					value={ text }
					onChange={ ( value ) => setAttributes( { text: value } ) }
					placeholder={ __( 'List item', 'theatrum-blocks' ) }
					onSplit={ ( value, isOriginal ) => {
						// Keep the icon with the original item; a freshly split
						// item starts without one.
						const newAttributes = isOriginal
							? { ...attributes, text: value }
							: { text: value };

						const block = createBlock(
							'theatrum/list-item-icon',
							newAttributes
						);

						if ( isOriginal ) {
							block.clientId = clientId;
						}

						return block;
					} }
					onReplace={ onReplace }
					onMerge={ mergeBlocks }
					onRemove={ onRemove }
				/>
			</li>
		</Fragment>
	);
}
