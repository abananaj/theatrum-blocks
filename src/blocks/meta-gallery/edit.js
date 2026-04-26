/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, SelectControl, RangeControl, ToggleControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes, context }) {
	const blockProps = useBlockProps();
	const [images, setImages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

	useEffect(() => {
		if (!attributes.keyInput || !postId) {
			setImages([]);
			return;
		}

		setIsLoading(true);

		apiFetch({ path: `/chance/v1/meta-gallery/${postId}/${attributes.keyInput}` })
			.then((data) => {
				setImages(Array.isArray(data.images) ? data.images : []);
				setIsLoading(false);
			})
			.catch(() => {
				setImages([]);
				setIsLoading(false);
			});
	}, [attributes.keyInput, postId]);

	const columns = attributes.columns || 3;
	const gridStyle = {
		display: 'grid',
		gridTemplateColumns: `repeat(${columns}, 1fr)`,
		gap: '8px'
	};

	return (
		<Fragment>
			<InspectorControls>
				<div style={{ padding: '16px' }}>
					<TextControl
						label="Meta Key"
						value={attributes.keyInput || ''}
						onChange={(value) => setAttributes({ keyInput: value })}
						placeholder="e.g., production_gallery, photos"
						help="Enter the ACF/meta key for the gallery field"
					/>
					<RangeControl
						label="Columns"
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={1}
						max={8}
					/>
					<SelectControl
						label="Image Size"
						value={attributes.imageSize || 'medium'}
						onChange={(value) => setAttributes({ imageSize: value })}
						options={[
							{ label: 'Thumbnail', value: 'thumbnail' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Medium Large', value: 'medium_large' },
							{ label: 'Large', value: 'large' },
							{ label: 'Full', value: 'full' }
						]}
					/>
					<SelectControl
						label="Link To"
						value={attributes.linkTo || 'none'}
						onChange={(value) => setAttributes({ linkTo: value })}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Media File', value: 'media' },
							{ label: 'Attachment Page', value: 'attachment' }
						]}
					/>
					<ToggleControl
						label="Crop images to same height"
						checked={attributes.imageCrop || false}
						onChange={(value) => setAttributes({ imageCrop: value })}
					/>
					<ToggleControl
						label="Show captions"
						checked={attributes.showCaption || false}
						onChange={(value) => setAttributes({ showCaption: value })}
					/>
				</div>
			</InspectorControls>
			<figure {...blockProps}>
				{isLoading && <Spinner />}
				{!isLoading && images.length > 0 && (
					<ul className="wp-block-gallery blocks-gallery-grid" style={gridStyle}>
						{images.map((img, i) => (
							<li key={i} className="blocks-gallery-item">
								<figure>
									<img
										src={img.url}
										alt={img.alt || ''}
										style={{
											width: '100%',
											height: attributes.imageCrop ? '200px' : 'auto',
											objectFit: attributes.imageCrop ? 'cover' : 'contain',
											display: 'block'
										}}
									/>
									{attributes.showCaption && img.caption && (
										<figcaption className="wp-element-caption">{img.caption}</figcaption>
									)}
								</figure>
							</li>
						))}
					</ul>
				)}
				{!isLoading && images.length === 0 && (
					<div
						style={{
							background: '#f0f0f0',
							border: '2px dashed #ccc',
							padding: '40px',
							textAlign: 'center',
							color: '#999'
						}}
					>
						{attributes.keyInput
							? `No images found for key: "${attributes.keyInput}"`
							: 'Enter a meta key in the sidebar to display a gallery'}
					</div>
				)}
			</figure>
		</Fragment>
	);
}
