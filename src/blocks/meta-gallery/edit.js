/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	SelectControl,
	ToggleControl,
	RangeControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	PanelBody,
	TextControl,
	Spinner,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	BlockControls,
} from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import './editor.scss';

const LINK_OPTIONS = [
	{ label: 'None', value: 'none' },
	{ label: 'Media Files', value: 'media' },
	{ label: 'Attachment Pages', value: 'attachment' },
];

const IMAGE_SIZE_OPTIONS = [
	{ label: 'Thumbnail', value: 'thumbnail' },
	{ label: 'Medium', value: 'medium' },
	{ label: 'Medium Large', value: 'medium_large' },
	{ label: 'Large', value: 'large' },
	{ label: 'Full', value: 'full' },
];

export default function Edit({ attributes, setAttributes, context }) {
	const {
		metaKey,
		sizeSlug,
		columns,
		linkTo,
		imageCrop,
		fixedHeight,
		randomOrder,
		navigationButtonType,
		allowResize,
		aspectRatio,
		fallbackText,
	} = attributes;

	const blockProps = useBlockProps();
	const [images, setImages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const editorPostId = useSelect((select) =>
		select('core/editor').getCurrentPostId()
	);
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

	// Fetch images from meta/ACF
	useEffect(() => {
		if (!metaKey || !postId) {
			setImages([]);
			return;
		}

		setIsLoading(true);

		apiFetch({
			path: `/chance/v1/meta-gallery/${postId}/${metaKey}`,
		})
			.then((data) => {
				let imageList = Array.isArray(data.images) ? data.images : [];
				if (randomOrder) {
					imageList = [...imageList].sort(() => Math.random() - 0.5);
				}
				setImages(imageList);
				setIsLoading(false);
			})
			.catch(() => {
				setImages([]);
				setIsLoading(false);
			});
	}, [metaKey, postId, randomOrder]);

	// Calculate gallery layout
	const numColumns = columns || 3;
	const gap = 16;
	const flexBasis =
		numColumns > 1
			? `calc(${(100 / numColumns).toFixed(2)}% - ${(gap * (numColumns - 1) / numColumns).toFixed(2)}px)`
			: '100%';

	const galleryClasses = clsx(
		'wp-block-gallery',
		'has-nested-images',
		'blocks-gallery-grid',
		{
			[`columns-${numColumns}`]: numColumns !== undefined,
			'is-cropped': imageCrop,
		}
	);

	const gridStyle = {
		display: 'flex',
		flexWrap: 'wrap',
		gap: `${gap}px`,
		listStyle: 'none',
		margin: 0,
		padding: 0,
		'--wp--style--unstable-gallery-gap': `${gap}px`,
	};

	return (
		<Fragment>
			<BlockControls>
				{/* Block toolbar controls could go here */}
			</BlockControls>

			<InspectorControls>
				<ToolsPanel
					label={__('Gallery settings')}
					panelId="chance/meta-gallery"
					resetAll={() => {
						setAttributes({
							metaKey: '',
							sizeSlug: 'large',
							columns: undefined,
							linkTo: 'none',
							imageCrop: true,
							fixedHeight: true,
							randomOrder: false,
							navigationButtonType: 'icon',
							allowResize: false,
							aspectRatio: 'auto',
						});
					}}
				>
					<ToolsPanelItem
						hasValue={() => metaKey !== ''}
						label={__('Meta Key')}
						panelId="chance/meta-gallery"
						onDeselect={() => setAttributes({ metaKey: '' })}
					>
						<TextControl
							label={__('Meta Key')}
							value={metaKey || ''}
							onChange={(value) => setAttributes({ metaKey: value })}
							placeholder="e.g., production_gallery"
							help={__('ACF or post meta field key')}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={() => columns !== undefined}
						label={__('Columns')}
						panelId="chance/meta-gallery"
						onDeselect={() => setAttributes({ columns: undefined })}
					>
						<RangeControl
							label={__('Columns')}
							value={columns || 3}
							onChange={(value) => setAttributes({ columns: value })}
							min={1}
							max={8}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={() => sizeSlug !== 'large'}
						label={__('Image Size')}
						panelId="chance/meta-gallery"
						onDeselect={() => setAttributes({ sizeSlug: 'large' })}
					>
						<SelectControl
							label={__('Image Size')}
							value={sizeSlug || 'large'}
							onChange={(value) => setAttributes({ sizeSlug: value })}
							options={IMAGE_SIZE_OPTIONS}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={() => linkTo !== 'none'}
						label={__('Link To')}
						panelId="chance/meta-gallery"
						onDeselect={() => setAttributes({ linkTo: 'none' })}
					>
						<SelectControl
							label={__('Link Images To')}
							value={linkTo || 'none'}
							onChange={(value) => setAttributes({ linkTo: value })}
							options={LINK_OPTIONS}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={() => imageCrop !== true}
						label={__('Image Crop')}
						panelId="chance/meta-gallery"
						onDeselect={() => setAttributes({ imageCrop: true })}
					>
						<ToggleControl
							label={__('Crop images to same height')}
							checked={imageCrop}
							onChange={(value) => setAttributes({ imageCrop: value })}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={() => fixedHeight !== true}
						label={__('Fixed Height')}
						panelId="chance/meta-gallery"
						onDeselect={() => setAttributes({ fixedHeight: true })}
					>
						<ToggleControl
							label={__('Fixed height')}
							checked={fixedHeight}
							onChange={(value) => setAttributes({ fixedHeight: value })}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={() => randomOrder !== false}
						label={__('Random Order')}
						panelId="chance/meta-gallery"
						onDeselect={() => setAttributes({ randomOrder: false })}
					>
						<ToggleControl
							label={__('Random order')}
							checked={randomOrder}
							onChange={(value) => setAttributes({ randomOrder: value })}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={() => navigationButtonType !== 'icon'}
						label={__('Navigation Buttons')}
						panelId="chance/meta-gallery"
						onDeselect={() => setAttributes({ navigationButtonType: 'icon' })}
					>
						<ToggleGroupControl
							label={__('Navigation buttons')}
							value={navigationButtonType}
							onChange={(value) =>
								setAttributes({ navigationButtonType: value })
							}
							isBlock
							__nextHasNoMarginBottom
						>
							<ToggleGroupControlOption
								value="icon"
								label={__('Icon')}
							/>
							<ToggleGroupControlOption
								value="text"
								label={__('Text')}
							/>
							<ToggleGroupControlOption
								value="both"
								label={__('Both')}
							/>
						</ToggleGroupControl>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={() => aspectRatio !== 'auto'}
						label={__('Aspect Ratio')}
						panelId="chance/meta-gallery"
						onDeselect={() => setAttributes({ aspectRatio: 'auto' })}
					>
						<SelectControl
							label={__('Aspect Ratio')}
							value={aspectRatio || 'auto'}
							onChange={(value) => setAttributes({ aspectRatio: value })}
							options={[
								{ label: __('Original'), value: 'auto' },
								{ label: '1:1', value: '1' },
								{ label: '3:2', value: '1.5' },
								{ label: '4:3', value: '1.333' },
								{ label: '16:9', value: '1.777' },
								{ label: '9:16', value: '0.5625' },
							]}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={() => allowResize !== false}
						label={__('Allow Resize')}
						panelId="chance/meta-gallery"
						onDeselect={() => setAttributes({ allowResize: false })}
					>
						<ToggleControl
							label={__('Allow resize')}
							checked={allowResize}
							onChange={(value) => setAttributes({ allowResize: value })}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>
				</ToolsPanel>

				<PanelBody title={__('Fallback')} initialOpen={false}>
					<TextControl
						label={__('Fallback Text')}
						value={fallbackText || ''}
						onChange={(value) => setAttributes({ fallbackText: value })}
						placeholder={__('Optional text if no images are found')}
						help={__('Leave empty to hide the block when no images are found')}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<figure {...blockProps}>
				{isLoading && (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							minHeight: '200px',
						}}
					>
						<Spinner />
					</div>
				)}

				{!isLoading && images.length > 0 && (
					<ul className={galleryClasses} style={gridStyle}>
						{images.map((img, idx) => (
							<li
								key={idx}
								className="blocks-gallery-item"
								style={{
									flex: `1 1 ${flexBasis}`,
									minWidth: 0,
								}}
							>
								<figure
									style={{
										margin: 0,
										display: 'flex',
										flexDirection: 'column',
										position: 'relative',
										maxWidth: '100%',
										boxSizing: 'border-box',
										overflow: 'hidden',
										backgroundColor: '#f0f0f0',
										aspectRatio:
											aspectRatio && aspectRatio !== 'auto'
												? aspectRatio
												: undefined,
									}}
								>
									<img
										src={img.url}
										alt={img.alt || ''}
										data-id={img.id}
										data-full-url={img.fullUrl || img.url}
										data-link={img.link || ''}
										style={{
											display: 'block',
											width: '100%',
											height: 'auto',
											maxWidth: '100%',
											objectFit: imageCrop
												? 'cover'
												: 'contain',
											flex: imageCrop ? '1 0 0%' : 'initial',
										}}
									/>
									{img.caption && (
										<figcaption
											className="blocks-gallery-item__caption"
											style={{
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
												background:
													'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, transparent 100%)',
												textShadow: '0 0 1.5px #000',
											}}
										>
											{img.caption}
										</figcaption>
									)}
								</figure>
							</li>
						))}
					</ul>
				)}

				{!isLoading && images.length === 0 && fallbackText && (
					<div
						style={{
							textAlign: 'center',
							color: '#666',
							padding: '20px',
						}}
					>
						{fallbackText}
					</div>
				)}

				{!isLoading && images.length === 0 && !fallbackText && (
					<div
						style={{
							textAlign: 'center',
							color: '#ccc',
							padding: '40px 20px',
							fontSize: '14px',
						}}
					>
						{metaKey
							? __('No images found')
							: __('Enter a meta key to display images')}
					</div>
				)}
			</figure>
		</Fragment>
	);
}
