/**
 * Thumbnail List Item Block Editor (child of theatrum/list-thumbnail)
 *
 * Renders a single `.list-item` containing nested heading/paragraph content
 * (a real InnerBlocks area, not fixed RichText fields — lets each item hold
 * whatever mix of headings/paragraphs is needed) plus a thumbnail image
 * managed from the Inspector.
 *
 * The parent's "Resolution" setting (`imageSizeSlug`) flows down as block
 * context. Because this is a static block, the resolved image URL for that
 * size must be baked into `thumbnailUrl` at edit-time — there is no
 * render.php to resolve it later — so an effect re-resolves the URL whenever
 * the context value changes, using the canonical media entity (`core.getMedia`)
 * rather than trusting whatever URL the media picker returned at selection time.
 */

import {
	useBlockProps,
	useInnerBlocksProps,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { Fragment, useEffect } from '@wordpress/element';
import { Button, PanelBody } from '@wordpress/components';
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

export default function Edit( { attributes, setAttributes, context } ) {
	const { thumbnailId, thumbnailUrl, thumbnailAlt } = attributes;
	const imageSizeSlug = context[ 'theatrum/imageSizeSlug' ] || 'full';
	const blockProps = useBlockProps( { className: 'list-item' } );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'core/heading', 'core/paragraph' ],
		template: TEMPLATE,
		templateLock: false,
	} );

	// Re-resolve the saved thumbnailUrl whenever the list-wide Resolution
	// setting changes, so existing items pick up the new size without needing
	// to re-select their image.
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
	};

	const removeThumbnail = () => {
		setAttributes( { thumbnailId: 0, thumbnailUrl: '', thumbnailAlt: '' } );
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
									{ thumbnailUrl
										? __(
												'Replace Image',
												'theatrum-blocks'
										  )
										: __(
												'Select Image',
												'theatrum-blocks'
										  ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					{ thumbnailUrl && (
						<Fragment>
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
							<Button
								onClick={ removeThumbnail }
								variant="secondary"
								isDestructive
								style={ {
									width: '100%',
									justifyContent: 'center',
								} }
							>
								{ __( 'Remove Image', 'theatrum-blocks' ) }
							</Button>
						</Fragment>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</Fragment>
	);
}
