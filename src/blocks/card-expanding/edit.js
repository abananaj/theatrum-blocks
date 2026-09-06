/**
 * Expanding Card editor. Content stays fully visible while authoring — the click-to-collapse
 * behavior is a front-end-only enhancement wired by view.js, so there is nothing to preview here.
 */
import {
	useBlockProps,
	InspectorControls,
	RichText,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { mediaUrl, mediaId, mediaAlt, title, description } = attributes;
	const blockProps = useBlockProps();

	const onSelectImage = ( media ) => {
		setAttributes( {
			mediaId: media.id,
			mediaUrl: media.url,
			mediaAlt: media.alt || '',
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Image', 'theatrum-blocks' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectImage }
							allowedTypes={ [ 'image' ] }
							value={ mediaId }
							render={ ( { open } ) => (
								<Button
									onClick={ open }
									variant="primary"
									style={ {
										width: '100%',
										justifyContent: 'center',
									} }
								>
									{ mediaUrl
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
					<p>
						{ __(
							'Expands on click on the front end — the description below is what appears when the card opens.',
							'theatrum-blocks'
						) }
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="wp-block-theatrum-card-expanding__image">
					{ mediaUrl ? (
						<img src={ mediaUrl } alt={ mediaAlt } />
					) : (
						<div className="wp-block-theatrum-card-expanding__image-placeholder">
							{ __( 'No image selected', 'theatrum-blocks' ) }
						</div>
					) }
				</div>
				<div className="wp-block-theatrum-card-expanding__info">
					<RichText
						tagName="span"
						identifier="title"
						className="wp-block-theatrum-card-expanding__title line-clamp-1"
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						placeholder={ __( 'Title', 'theatrum-blocks' ) }
						allowedFormats={ [] }
					/>
					<RichText
						tagName="p"
						identifier="description"
						className="wp-block-theatrum-card-expanding__description"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __(
							'Description shown when the card is expanded…',
							'theatrum-blocks'
						) }
					/>
				</div>
			</div>
		</>
	);
}
