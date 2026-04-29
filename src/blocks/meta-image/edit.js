import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, SelectControl, ToggleControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes, context }) {
	const blockProps = useBlockProps();
	const [imageData, setImageData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

	useEffect(() => {
		if (!attributes.keyInput || !postId) {
			setImageData(null);
			return;
		}

		setIsLoading(true);

		apiFetch({ path: `/chance/v1/meta-image/${postId}/${attributes.keyInput}` })
			.then((data) => {
				setImageData(data.url ? data : null);
				setIsLoading(false);
			})
			.catch(() => {
				setImageData(null);
				setIsLoading(false);
			});
	}, [attributes.keyInput, postId]);

	return (
		<Fragment>
			<InspectorControls>
				<div style={{ padding: '16px' }}>
					<TextControl
						label="Meta Key"
						value={attributes.keyInput || ''}
						onChange={(value) => setAttributes({ keyInput: value })}
						placeholder="e.g., hero_image, poster"
						help="Enter the ACF/meta key for the image field"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
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
							{ label: 'Attachment Page', value: 'attachment' },
							{ label: 'Custom URL', value: 'custom' }
						]}
					/>
					{attributes.linkTo === 'custom' && (
						<TextControl
							label="Custom URL"
							value={attributes.customLink || ''}
							onChange={(value) => setAttributes({ customLink: value })}
							placeholder="https://example.com"
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					)}
					{attributes.linkTo !== 'none' && (
						<ToggleControl
							label="Open in new tab"
							checked={attributes.openInNewTab || false}
							onChange={(value) => setAttributes({ openInNewTab: value })}
							__nextHasNoMarginBottom 
						/>
					)}
					<ToggleControl
						label="Show caption"
						checked={attributes.showCaption || false}
						onChange={(value) => setAttributes({ showCaption: value })}
						__nextHasNoMarginBottom 
					/>
				</div>
			</InspectorControls>
			<figure {...blockProps}>
				{isLoading && <Spinner />}
				{!isLoading && imageData && (
					<>
						<img
							src={imageData.url}
							alt={imageData.alt || ''}
							style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
						/>
						{attributes.showCaption && imageData.caption && (
							<figcaption className="wp-element-caption">{imageData.caption}</figcaption>
						)}
					</>
				)}
				{!isLoading && !imageData && (
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
							? `No image found for key: "${attributes.keyInput}"`
							: 'Enter a meta key in the sidebar to display an image'}
					</div>
				)}
			</figure>
		</Fragment>
	);
}
