/**
 * Thumbnail List Item Block Editor (child of theatrum/list-thumbnail). Renders a `.list-item` with nested heading/paragraph InnerBlocks (not fixed RichText, so items can mix content) plus a thumbnail managed from the Inspector.
 * Static block, so the parent's Resolution setting (`imageSizeSlug` context) must be baked into `thumbnailUrl` at edit-time (no render.php) — an effect re-resolves it via `core.getMedia` whenever context changes, rather than trusting the picker's URL.
 * No-thumbnail items default to the blue-gradient placeholder (#106035, block.json default), which flows through the same resolution effect as any selected image.
 */

import {
	useBlockProps,
	useInnerBlocksProps,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

const TEMPLATE = [
	[
		'core/heading',
		{ level: 3, placeholder: __( 'List item', 'theatrum-blocks' ) },
	],
	[
		'core/paragraph',
		{
			placeholder: __(
				'Add a description (optional)',
				'theatrum-blocks'
			),
		},
	],
];

const PLACEHOLDER_THUMBNAIL_ID = 106035;
const PLACEHOLDER_THUMBNAIL_URL =
	'https://chance-theater.s3.us-west-1.amazonaws.com/2026/06/blue-gradient.png';

export default function Edit( { attributes, setAttributes, context } ) {
	const { thumbnailId, thumbnailUrl, thumbnailAlt } = attributes;
	const imageSizeSlug = context[ 'theatrum/imageSizeSlug' ] || 'full';
	const blockProps = useBlockProps( { className: 'list-item' } );
	const isPlaceholder = thumbnailId === PLACEHOLDER_THUMBNAIL_ID;

	const [ isEditingUrl, setIsEditingUrl ] = useState( false );
	const [ urlInput, setUrlInput ] = useState( thumbnailUrl );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'core/heading', 'core/paragraph', 'core/group' ],
		template: TEMPLATE,
		templateLock: false,
	} );

	// Re-resolve thumbnailUrl whenever the list-wide Resolution setting changes, so existing items (including placeholder ones) pick up the new size.
	const media = useSelect(
		( select ) =>
			thumbnailId ? select( 'core' ).getMedia( thumbnailId ) : null,
		[ thumbnailId ]
	);

	useEffect( () => {
		if ( ! media ) {
			return;
		}
		const sizes = media.media_details?.sizes || {};
		const resolvedUrl =
			sizes[ imageSizeSlug ]?.source_url ||
			media.source_url ||
			thumbnailUrl;
		if ( resolvedUrl && resolvedUrl !== thumbnailUrl ) {
			setAttributes( { thumbnailUrl: resolvedUrl } );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ media, imageSizeSlug ] );

	const setThumbnail = ( selectedMedia ) => {
		const sizeData =
			selectedMedia.sizes?.[ imageSizeSlug ] || selectedMedia.sizes?.full;
		setAttributes( {
			thumbnailId: selectedMedia.id,
			thumbnailUrl: sizeData?.url || selectedMedia.url,
			thumbnailAlt: selectedMedia.alt || '',
		} );
		setIsEditingUrl( false );
	};

	const applyThumbnailUrl = () => {
		if ( ! urlInput ) {
			return;
		}
		setAttributes( {
			thumbnailId: 0,
			thumbnailUrl: urlInput,
			thumbnailAlt,
		} );
		setIsEditingUrl( false );
	};

	const resetToPlaceholder = () => {
		setAttributes( {
			thumbnailId: PLACEHOLDER_THUMBNAIL_ID,
			thumbnailUrl: PLACEHOLDER_THUMBNAIL_URL,
			thumbnailAlt: '',
		} );
		setIsEditingUrl( false );
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ __( 'Thumbnail Image', 'theatrum-blocks' ) }
					initialOpen={ true }
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ setThumbnail }
							allowedTypes={ [ 'image' ] }
							value={ thumbnailId }
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
									{ isPlaceholder
										? __(
												'Select Image',
												'theatrum-blocks'
										  )
										: __(
												'Replace Image',
												'theatrum-blocks'
										  ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>

					<Button
						variant="link"
						onClick={ () => {
							setUrlInput( isPlaceholder ? '' : thumbnailUrl );
							setIsEditingUrl( ( prev ) => ! prev );
						} }
						style={ { marginBottom: '8px' } }
					>
						{ __( 'Or enter an image URL', 'theatrum-blocks' ) }
					</Button>

					{ isEditingUrl && (
						<form
							onSubmit={ ( event ) => {
								event.preventDefault();
								applyThumbnailUrl();
							} }
							style={ { marginBottom: '8px' } }
						>
							<TextControl
								type="url"
								label={ __( 'Image URL', 'theatrum-blocks' ) }
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

					<img
						src={ thumbnailUrl }
						alt={ thumbnailAlt }
						style={ {
							maxWidth: '100%',
							height: 'auto',
							borderRadius: '4px',
							marginBottom: '8px',
						} }
					/>

					<TextControl
						label={ __( 'Alt Text', 'theatrum-blocks' ) }
						help={ __(
							'Describe the image for screen readers.',
							'theatrum-blocks'
						) }
						value={ thumbnailAlt }
						onChange={ ( value ) =>
							setAttributes( { thumbnailAlt: value } )
						}
						style={ { marginBottom: '8px' } }
					/>

					{ ! isPlaceholder && (
						<Button
							onClick={ resetToPlaceholder }
							variant="secondary"
							isDestructive
							style={ {
								width: '100%',
								justifyContent: 'center',
							} }
						>
							{ __( 'Use Placeholder', 'theatrum-blocks' ) }
						</Button>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</Fragment>
	);
}
