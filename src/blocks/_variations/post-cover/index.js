/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, RangeControl, ToggleControl, Disabled, Spinner } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './editor.scss';

/**
 * Edit component for the Post Cover block
 */
function Edit({ attributes, setAttributes, className }) {
	const {
		postId,
		dimRatio,
		overlayColor,
		customOverlayColor,
		focalPoint,
		minHeight,
		minHeightUnit,
		contentPosition,
		isDark,
		isRepeated,
	} = attributes;

	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [featuredImage, setFeaturedImage] = useState('');

	const blockProps = useBlockProps({
		className: `wp-block-chance-post-cover ${className}`,
	});

	// Fetch available posts
	useEffect(() => {
		setLoading(true);
		apiFetch({
			path: '/wp/v2/posts?per_page=100&_fields=id,title',
		})
			.then((results) => {
				const options = results.map((post) => ({
					label: post.title.rendered || '(no title)',
					value: post.id,
				}));
				setPosts(options);
			})
			.catch(() => {
				setPosts([]);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	// Fetch featured image when post ID changes
	useEffect(() => {
		if (postId > 0) {
			apiFetch({
				path: `/wp/v2/posts/${postId}?_fields=featured_media`,
			})
				.then((post) => {
					if (post.featured_media) {
						return apiFetch({
							path: `/wp/v2/media/${post.featured_media}?_fields=source_url`,
						});
					}
					return null;
				})
				.then((media) => {
					if (media && media.source_url) {
						setFeaturedImage(media.source_url);
					} else {
						setFeaturedImage('');
					}
				})
				.catch(() => {
					setFeaturedImage('');
				});
		} else {
			setFeaturedImage('');
		}
	}, [postId]);

	const backgroundImage = featuredImage ? `url(${featuredImage})` : 'none';
	const focalPointStyle = {
		backgroundPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
	};

	const overlayColorValue = customOverlayColor || overlayColor || '#000000';
	const overlayOpacity = dimRatio / 100;

	const minHeightStyle = minHeight
		? { minHeight: `${minHeight}${minHeightUnit || 'px'}` }
		: { minHeight: '300px' };

	const contentPositionMap = {
		'center center': 'center',
		'center top': 'flex-start',
		'center bottom': 'flex-end',
		'left center': 'center',
		'right center': 'center',
	};

	const alignItems = contentPositionMap[contentPosition] || 'center';

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Post Selection', 'theatrum-blocks')}>
					{loading ? (
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<Spinner />
							<span>{__('Loading posts...', 'theatrum-blocks')}</span>
						</div>
					) : (
						<SelectControl
							label={__('Select Post', 'theatrum-blocks')}
							value={postId}
							options={[{ label: __('-- Select a post --', 'theatrum-blocks'), value: 0 }, ...posts]}
							onChange={(value) => setAttributes({ postId: Number(value) })}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Overlay Settings', 'theatrum-blocks')}>
					<RangeControl
						label={__('Overlay Opacity', 'theatrum-blocks')}
						value={dimRatio}
						onChange={(value) => setAttributes({ dimRatio: value })}
						min={0}
						max={100}
						step={10}
					/>
					<TextControl
						label={__('Overlay Color (Hex)', 'theatrum-blocks')}
						value={customOverlayColor || ''}
						onChange={(value) => setAttributes({ customOverlayColor: value })}
						placeholder="#000000"
					/>
				</PanelBody>

				<PanelBody title={__('Layout Settings', 'theatrum-blocks')}>
					<RangeControl
						label={__('Minimum Height (px)', 'theatrum-blocks')}
						value={typeof minHeight === 'string' ? parseInt(minHeight) : minHeight || 300}
						onChange={(value) =>
							setAttributes({
								minHeight: value,
								minHeightUnit: 'px',
							})
						}
						min={100}
						max={1000}
						step={10}
					/>
					<SelectControl
						label={__('Content Position', 'theatrum-blocks')}
						value={contentPosition}
						options={[
							{ label: __('Center Center', 'theatrum-blocks'), value: 'center center' },
							{ label: __('Center Top', 'theatrum-blocks'), value: 'center top' },
							{ label: __('Center Bottom', 'theatrum-blocks'), value: 'center bottom' },
							{ label: __('Left Center', 'theatrum-blocks'), value: 'left center' },
							{ label: __('Right Center', 'theatrum-blocks'), value: 'right center' },
						]}
						onChange={(value) => setAttributes({ contentPosition: value })}
					/>
					<ToggleControl
						label={__('Is Dark', 'theatrum-blocks')}
						checked={isDark}
						onChange={(value) => setAttributes({ isDark: value })}
					/>
					<ToggleControl
						label={__('Repeat Background Image', 'theatrum-blocks')}
						checked={isRepeated}
						onChange={(value) => setAttributes({ isRepeated: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Focal Point', 'theatrum-blocks')}>
					<RangeControl
						label={__('Horizontal Position', 'theatrum-blocks')}
						value={Math.round(focalPoint.x * 100)}
						onChange={(value) =>
							setAttributes({
								focalPoint: { ...focalPoint, x: value / 100 },
							})
						}
						min={0}
						max={100}
					/>
					<RangeControl
						label={__('Vertical Position', 'theatrum-blocks')}
						value={Math.round(focalPoint.y * 100)}
						onChange={(value) =>
							setAttributes({
								focalPoint: { ...focalPoint, y: value / 100 },
							})
						}
						min={0}
						max={100}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps} style={minHeightStyle}>
				<div
					className="wp-block-cover__image-background"
					style={{
						backgroundImage,
						backgroundSize: isRepeated ? 'auto' : 'cover',
						backgroundRepeat: isRepeated ? 'repeat' : 'no-repeat',
						...focalPointStyle,
					}}
				/>
				<div
					className="wp-block-cover__overlay"
					style={{
						backgroundColor: overlayColorValue,
						opacity: overlayOpacity,
					}}
				/>
				<div
					className="wp-block-cover__inner-container"
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: alignItems === 'center' ? 'center' : alignItems,
						justifyContent: alignItems,
						zIndex: 1,
						position: 'relative',
						width: '100%',
						height: '100%',
						color: isDark ? '#ffffff' : '#000000',
					}}
				>
					<InnerBlocks
						allowedBlocks={[
							'core/heading',
							'core/paragraph',
							'core/button',
							'core/buttons',
							'core/list',
							'core/group',
							'core/columns',
						]}
					/>
				</div>
			</div>
		</>
	);
}

registerBlockType(metadata.name, {
	icon: 'cover-image',
	edit: Edit,
});
