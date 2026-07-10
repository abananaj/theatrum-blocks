import { useBlockProps, InspectorControls, InnerBlocks, BlockAlignmentToolbar } from '@wordpress/block-editor';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import { Button, TextControl, SelectControl, TextareaControl, CheckboxControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

function isMediaFile(file) {
	return file.mime && (file.mime.startsWith('image/') || file.mime.startsWith('video/'));
}

export default function Edit({ attributes, setAttributes }) {
	const {
		mediaId,
		mediaUrl,
		mediaAlt,
		mediaType,
		linkType,
		linkUrl,
		linkPageId,
		linkTarget,
		width,
		widthUnit,
		alignment,
	} = attributes;

	const [pages, setPages] = useState([]);
	const [loadingPages, setLoadingPages] = useState(false);

	const blockProps = useBlockProps({
		className: `align${alignment ? alignment.charAt(0).toUpperCase() + alignment.slice(1) : ''}`,
	});

	const handleSelectMedia = (media) => {
		if (!isMediaFile(media)) {
			alert('Please select an image or video file');
			return;
		}

		const type = media.mime.startsWith('video/') ? 'video' : 'image';

		setAttributes({
			mediaId: media.id,
			mediaUrl: media.url,
			mediaAlt: media.alt || '',
			mediaType: type,
		});
	};

	const handleRemoveMedia = () => {
		setAttributes({
			mediaId: 0,
			mediaUrl: '',
			mediaAlt: '',
			mediaType: 'image',
		});
	};

	const handleLinkTypeChange = (newLinkType) => {
		setAttributes({ linkType: newLinkType });

		if (newLinkType === 'page' && pages.length === 0) {
			setLoadingPages(true);
			apiFetch({ path: '/wp/v2/pages?per_page=100&_fields=id,title' })
				.then((data) => {
					setPages(data);
					setLoadingPages(false);
				})
				.catch(() => {
					setLoadingPages(false);
				});
		}
	};

	return (
		<Fragment>
			<InspectorControls>
				<div style={{ padding: '16px' }}>
					<h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>
						Media
					</h3>

					<MediaUploadCheck>
						<MediaUpload
							onSelect={handleSelectMedia}
							allowedTypes={['image', 'video']}
							value={mediaId}
							render={({ open }) => (
								<Button
									onClick={open}
									variant="primary"
									style={{ marginBottom: '16px', width: '100%' }}
								>
									{mediaUrl ? 'Replace Media' : 'Select Media'}
								</Button>
							)}
						/>
					</MediaUploadCheck>

					{mediaUrl && (
						<Button
							onClick={handleRemoveMedia}
							variant="secondary"
							isDestructive
							style={{ width: '100%', marginBottom: '16px' }}
						>
							Remove Media
						</Button>
					)}

					<h3 style={{ margin: '16px 0 8px 0', fontSize: '14px', fontWeight: 600 }}>
						Link
					</h3>

					<SelectControl
						label="Link Type"
						value={linkType}
						onChange={handleLinkTypeChange}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'External URL', value: 'url' },
							{ label: 'Page', value: 'page' },
						]}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>

					{linkType === 'url' && (
						<Fragment>
							<TextControl
								label="URL"
								value={linkUrl}
								onChange={(value) =>
									setAttributes({ linkUrl: value })
								}
								placeholder="https://example.com"
								type="url"
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								style={{ marginTop: '8px' }}
							/>
							<CheckboxControl
								label="Open in new tab"
								checked={linkTarget}
								onChange={(value) =>
									setAttributes({ linkTarget: value })
								}
								style={{ marginTop: '8px' }}
							/>
						</Fragment>
					)}

					{linkType === 'page' && (
						<SelectControl
							label="Page"
							value={linkPageId}
							onChange={(value) =>
								setAttributes({ linkPageId: parseInt(value) })
							}
							options={[
								{ label: 'Select a page...', value: 0 },
								...pages.map((page) => ({
									label: page.title.rendered,
									value: page.id,
								})),
							]}
							disabled={loadingPages}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							style={{ marginTop: '8px' }}
						/>
					)}

					<h3 style={{ margin: '16px 0 8px 0', fontSize: '14px', fontWeight: 600 }}>
						Size
					</h3>

					<div style={{ display: 'flex', gap: '8px' }}>
						<TextControl
							label="Width"
							value={width}
							onChange={(value) =>
								setAttributes({ width: value })
							}
							type="number"
							min="1"
							style={{ flex: 1 }}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						<SelectControl
							value={widthUnit}
							onChange={(value) =>
								setAttributes({ widthUnit: value })
							}
							options={[
								{ label: 'px', value: 'px' },
								{ label: '%', value: '%' },
								{ label: 'em', value: 'em' },
								{ label: 'rem', value: 'rem' },
							]}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</div>
				</div>
			</InspectorControls>

			<div {...blockProps}>
				<div className="media-popover-editor-trigger">
					<InnerBlocks
						allowedBlocks={['core/paragraph', 'core/heading', 'core/list', 'core/buttons', 'core/group']}
						template={[['core/paragraph', { placeholder: 'Add trigger text here...' }]]}
						templatelock={false}
					/>
					{mediaUrl && (
						<div className="media-popover-editor-badge">
							{mediaType === 'video' ? 'Video popover attached' : 'Image popover attached'}
						</div>
					)}
				</div>
			</div>
		</Fragment>
	);
}
