import { useBlockProps, InspectorControls, BlockAlignmentToolbar } from '@wordpress/block-editor';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import { Button, TextControl, SelectControl, TextareaControl } from '@wordpress/components';
import './editor.scss';

function isSvgFile(file) {
	return file.mime === 'image/svg+xml';
}

export default function Edit({ attributes, setAttributes }) {
	const { svgId, svgUrl, svgAlt, width, widthUnit, alignment, customCSS } = attributes;
	const blockProps = useBlockProps({
		className: `align${alignment ? alignment.charAt(0).toUpperCase() + alignment.slice(1) : ''}`,
	});

	const handleSelectSvg = (media) => {
		if (!isSvgFile(media)) {
			alert('Please select an SVG file');
			return;
		}
		setAttributes({
			svgId: media.id,
			svgUrl: media.url,
			svgAlt: media.alt || '',
		});
	};

	const handleRemoveSvg = () => {
		setAttributes({
			svgId: 0,
			svgUrl: '',
			svgAlt: '',
		});
	};

	const svgStyle = {
		width: `${width}${widthUnit}`,
		height: 'auto',
		display: 'block',
		margin: alignment === 'center' ? '0 auto' : undefined,
		marginLeft: alignment === 'right' ? 'auto' : undefined,
	};

	return (
		<Fragment>
			<InspectorControls>
				<div style={{ padding: '16px' }}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={handleSelectSvg}
							allowedTypes={['image/svg+xml']}
							value={svgId}
							render={({ open }) => (
								<Button onClick={open} variant="primary" style={{ marginBottom: '16px', width: '100%' }}>
									{svgUrl ? 'Replace SVG' : 'Select SVG'}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					{svgUrl && (
						<Button
							onClick={handleRemoveSvg}
							variant="secondary"
							isDestructive
							style={{ width: '100%', marginBottom: '16px' }}
						>
							Remove SVG
						</Button>
					)}
					<TextControl
						label="Alt Text"
						value={svgAlt}
						onChange={(value) => setAttributes({ svgAlt: value })}
						placeholder="Describe the icon"
						help="Alternative text for accessibility"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<div style={{ marginTop: '16px' }}>
						<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
							Width
						</label>
						<div style={{ display: 'flex', gap: '8px' }}>
							<TextControl
								value={width}
								onChange={(value) => setAttributes({ width: value })}
								type="number"
								min="1"
								style={{ flex: 1 }}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
							<SelectControl
								value={widthUnit}
								onChange={(value) => setAttributes({ widthUnit: value })}
								options={[
									{ label: 'px', value: 'px' },
									{ label: '%', value: '%' },
									{ label: 'em', value: 'em' },
									{ label: 'rem', value: 'rem' },
								]}
								style={{ flex: 0.5 }}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						</div>
					</div>
					<TextareaControl
						label="Custom CSS"
						value={customCSS}
						onChange={(value) => setAttributes({ customCSS: value })}
						placeholder="e.g., fill: #333; stroke: #000;"
						help="Add inline CSS to customize the SVG appearance (fill, stroke, opacity, etc.)"
						rows={4}
						__nextHasNoMarginBottom
					/>
				</div>
			</InspectorControls>

			<div {...blockProps}>
				{svgUrl ? (
					<figure style={{ margin: 0, textAlign: alignment }}>
						<img
							src={svgUrl}
							alt={svgAlt || 'SVG icon'}
							style={svgStyle}
						/>
					</figure>
				) : (
					<div
						style={{
							background: '#f0f0f0',
							border: '2px dashed #ccc',
							padding: '40px',
							textAlign: 'center',
							color: '#999',
							borderRadius: '4px',
						}}
					>
						Select an SVG file from the media library
					</div>
				)}
			</div>
		</Fragment>
	);
}
