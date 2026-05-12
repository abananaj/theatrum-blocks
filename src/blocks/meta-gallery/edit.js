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
	const gap = 16; // pixels
	const flexBasis = columns > 1
		? `calc(${(100 / columns).toFixed(2)}% - ${(gap * (columns - 1) / columns).toFixed(2)}px)`
		: '100%';

	const galleryClasses = [
		'wp-block-gallery',
		`columns-${columns}`,
		attributes.imageCrop ? 'is-cropped' : ''
	].filter(Boolean).join(' ');

	const gridStyle = {
		display: 'flex',
		flexWrap: 'wrap',
		gap: `${gap}px`,
		listStyle: 'none',
		margin: 0,
		padding: 0,
		'--wp--style--unstable-gallery-gap': `${gap}px`
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
						__nextHasNoMarginBottom
						__next40pxDefaultSize
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
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label="Show captions"
						checked={attributes.showCaption || false}
						onChange={(value) => setAttributes({ showCaption: value })}
						__nextHasNoMarginBottom
					/>
					<TextControl
						label="Fallback Text"
						value={attributes.fallbackText || ''}
						onChange={(value) => setAttributes({ fallbackText: value })}
						placeholder="Optional text if no images are found"
						help="Leave empty to hide the block when no images are found"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</div>
			</InspectorControls>
			<figure {...blockProps}>
				{isLoading && <Spinner />}
				{!isLoading && images.length > 0 && (
					<ul className={`${galleryClasses} blocks-gallery-grid`} style={gridStyle}>
						{images.map((img, i) => (
							<li key={i} className="blocks-gallery-item" style={{ flex: `1 1 ${flexBasis}`, minWidth: 0 }}>
								<figure style={{ margin: 0, display: 'flex', flexDirection: 'column', position: 'relative', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
									<img
										src={img.url}
										alt={img.alt || ''}
										style={{
											display: 'block',
											width: attributes.imageCrop ? '100%' : 'auto',
											height: attributes.imageCrop ? '100%' : 'auto',
											objectFit: attributes.imageCrop ? 'cover' : 'contain',
											maxWidth: '100%',
											flex: attributes.imageCrop ? '1 0 0%' : 'initial'
										}}
									/>
									{attributes.showCaption && img.caption && (
										<figcaption style={{
											position: 'absolute',
											bottom: 0,
											left: 0,
											right: 0,
											margin: 0,
											padding: '1em',
											color: '#fff',
											fontSize: '13px',
											textAlign: 'center',
											boxSizing: 'border-box',
											background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, transparent 100%)',
											textShadow: '0 0 1.5px #000'
										}}>{img.caption}</figcaption>
									)}
								</figure>
							</li>
						))}
					</ul>
				)}
				{!isLoading && images.length === 0 && attributes.fallbackText && (
					<div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
						{attributes.fallbackText}
					</div>
				)}
				{!isLoading && images.length === 0 && !attributes.fallbackText && (
					<div style={{ textAlign: 'center', color: '#ccc', padding: '20px', fontSize: '14px' }}>
						No value found.
					</div>
				)}
			</figure>
		</Fragment>
	);
}
