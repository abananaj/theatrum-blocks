/**
 * Scroll Reveal Card editor. The editor canvas isn't a real scroll viewport, so the reveal
 * (view.js, front end only) isn't simulated here — the image just shows at its full width.
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
							'The image panel grows into view as this card scrolls onto the screen on the front end.',
							'theatrum-blocks'
						) }
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="wp-block-theatrum-card-scroll__image">
					{ mediaUrl ? (
						<img src={ mediaUrl } alt={ mediaAlt } />
					) : (
						<div className="wp-block-theatrum-card-scroll__image-placeholder">
							{ __( 'No image selected', 'theatrum-blocks' ) }
						</div>
					) }
				</div>
				<div className="wp-block-theatrum-card-scroll__info">
					<RichText
						tagName="h3"
						identifier="title"
						className="wp-block-theatrum-card-scroll__title max-line-two"
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						placeholder={ __( 'Heading', 'theatrum-blocks' ) }
					/>
					<RichText
						tagName="p"
						identifier="description"
						className="wp-block-theatrum-card-scroll__description"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __( 'Description…', 'theatrum-blocks' ) }
					/>
				</div>
			</div>
		</>
	);
}
