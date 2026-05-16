/**
 * Icon List Block Editor
 * 
 * A list block that allows users to add icons to each list item from the media library.
 * Supports customizable icon positioning, size, color, and hover behavior.
 */

import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import {
	SelectControl,
	TextControl,
	ToggleControl,
	PanelBody,
	Button,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

/**
 * Generate a simple unique ID
 */
const generateId = () => {
	return 'item-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export default function Edit({ attributes, setAttributes }) {
	const { listType, items, iconSize, iconSizeUnit, iconPosition, iconSpacing, iconColor, hoverOnly } = attributes;
	const blockProps = useBlockProps();
	const [selectedItemId, setSelectedItemId] = useState(null);

	const selectedItem = items?.find((item) => item.id === selectedItemId);

	const handleAddItem = () => {
		const newItem = {
			id: generateId(),
			text: 'List item',
			iconId: 0,
			iconUrl: '',
			iconAlt: '',
		};
		setAttributes({ items: [...(items || []), newItem] });
		setSelectedItemId(newItem.id);
	};

	const handleUpdateItem = (property, value) => {
		const updatedItems = items.map((item) =>
			item.id === selectedItemId ? { ...item, [property]: value } : item
		);
		setAttributes({ items: updatedItems });
	};

	const handleSelectIcon = (media) => {
		const updatedItems = items.map((item) =>
			item.id === selectedItemId
				? { ...item, iconId: media.id, iconUrl: media.url, iconAlt: media.alt || '' }
				: item
		);
		setAttributes({ items: updatedItems });
	};

	const handleRemoveIcon = () => {
		const updatedItems = items.map((item) =>
			item.id === selectedItemId
				? { ...item, iconId: 0, iconUrl: '', iconAlt: '' }
				: item
		);
		setAttributes({ items: updatedItems });
	};

	const handleDeleteItem = () => {
		const updatedItems = items.filter((item) => item.id !== selectedItemId);
		setAttributes({ items: updatedItems });
		setSelectedItemId(null);
	};

	const handleMoveItem = (index, direction) => {
		const newItems = [...items];
		const newIndex = direction === 'up' ? index - 1 : index + 1;
		if (newIndex >= 0 && newIndex < newItems.length) {
			[newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
			setAttributes({ items: newItems });
		}
	};

	const ListTag = listType === 'ol' ? 'ol' : 'ul';

	const renderPreview = () => {
		if (!items || items.length === 0) {
			return (
				<p style={{ color: '#999', fontStyle: 'italic' }}>
					{__('No items yet. Add items from the block settings panel.', 'theatrum-blocks')}
				</p>
			);
		}

		const itemElements = items.map((item) => {
			const iconStyle = {
				display: 'inline-block',
				width: `${iconSize}${iconSizeUnit}`,
				height: `${iconSize}${iconSizeUnit}`,
				marginRight: iconPosition === 'left' ? `${iconSpacing}px` : undefined,
				marginBottom: iconPosition === 'top' ? `${iconSpacing}px` : undefined,
				marginLeft: iconPosition === 'right' ? `${iconSpacing}px` : undefined,
				marginTop: iconPosition === 'bottom' ? `${iconSpacing}px` : undefined,
				order: iconPosition === 'right' || iconPosition === 'bottom' ? 2 : 1,
				opacity: hoverOnly ? 0.4 : 1,
			};

			const liStyle = {
				display: 'flex',
				alignItems: iconPosition === 'top' || iconPosition === 'bottom' ? 'flex-start' : 'center',
				flexDirection: iconPosition === 'top' || iconPosition === 'bottom' ? 'column' : 'row',
				cursor: 'pointer',
				outline: item.id === selectedItemId ? '2px solid #007cba' : 'none',
				outlineOffset: '2px',
				borderRadius: '2px',
			};

			return (
				<li
					key={item.id}
					style={liStyle}
					onClick={() => setSelectedItemId(item.id)}
				>
					{item.iconUrl && (
						<img
							src={item.iconUrl}
							alt={item.iconAlt}
							style={iconStyle}
						/>
					)}
					<span style={{ flex: 1, order: 3 }}>{item.text}</span>
				</li>
			);
		});

		return (
			<ListTag className="wp-block-chance-icon-list">
				{itemElements}
			</ListTag>
		);
	};

	const itemIndex = items?.findIndex((item) => item.id === selectedItemId) ?? -1;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Items', 'theatrum-blocks')} initialOpen={true}>
					<Button
						onClick={handleAddItem}
						variant="primary"
						style={{ width: '100%', justifyContent: 'center' }}
					>
						{__('Add Item', 'theatrum-blocks')}
					</Button>
					{items && items.length > 0 && (
						<p style={{ marginTop: '8px', marginBottom: 0, fontSize: '12px', color: '#757575' }}>
							{__('Click an item in the block to select and edit it.', 'theatrum-blocks')}
						</p>
					)}
				</PanelBody>

				<ToolsPanel
					label={__('List Settings', 'theatrum-blocks')}
					resetAll={() => {
						setAttributes({
							listType: 'ul',
							iconSize: '24',
							iconSizeUnit: 'px',
							iconPosition: 'left',
							iconSpacing: '8',
							iconColor: '',
							hoverOnly: false,
						});
					}}
				>
					<ToolsPanelItem
						hasValue={() => listType !== 'ul'}
						label={__('List Type', 'theatrum-blocks')}
						onDeselect={() => setAttributes({ listType: 'ul' })}
						isShownByDefault={true}
					>
						<SelectControl
							label={__('List Type', 'theatrum-blocks')}
							value={listType}
							options={[
								{ label: __('Unordered', 'theatrum-blocks'), value: 'ul' },
								{ label: __('Ordered', 'theatrum-blocks'), value: 'ol' },
							]}
							onChange={(value) => setAttributes({ listType: value })}
						/>
					</ToolsPanelItem>
				</ToolsPanel>

				<ToolsPanel
					label={__('Icon Settings', 'theatrum-blocks')}
					resetAll={() => {
						setAttributes({
							iconSize: '24',
							iconSizeUnit: 'px',
							iconPosition: 'left',
							iconSpacing: '8',
							iconColor: '',
							hoverOnly: false,
						});
					}}
				>
					<ToolsPanelItem
						hasValue={() => iconSize !== '24'}
						label={__('Icon Size', 'theatrum-blocks')}
						onDeselect={() => {
							setAttributes({ iconSize: '24', iconSizeUnit: 'px' });
						}}
						isShownByDefault={true}
					>
						<div style={{ display: 'flex', gap: '8px' }}>
							<TextControl
								label={__('Size', 'theatrum-blocks')}
								value={iconSize}
								onChange={(value) => setAttributes({ iconSize: value })}
								type="number"
								min="1"
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								style={{ flex: 1 }}
							/>
							<SelectControl
								label={__('Unit', 'theatrum-blocks')}
								value={iconSizeUnit}
								options={[
									{ label: 'px', value: 'px' },
									{ label: 'em', value: 'em' },
									{ label: 'rem', value: 'rem' },
									{ label: '%', value: '%' },
								]}
								onChange={(value) => setAttributes({ iconSizeUnit: value })}
								style={{ width: '80px' }}
								__nextHasNoMarginBottom
							/>
						</div>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={() => iconPosition !== 'left'}
						label={__('Icon Position', 'theatrum-blocks')}
						onDeselect={() => setAttributes({ iconPosition: 'left' })}
						isShownByDefault={true}
					>
						<SelectControl
							label={__('Position', 'theatrum-blocks')}
							value={iconPosition}
							options={[
								{ label: __('Left', 'theatrum-blocks'), value: 'left' },
								{ label: __('Top', 'theatrum-blocks'), value: 'top' },
								{ label: __('Right', 'theatrum-blocks'), value: 'right' },
								{ label: __('Bottom', 'theatrum-blocks'), value: 'bottom' },
							]}
							onChange={(value) => setAttributes({ iconPosition: value })}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={() => iconSpacing !== '8'}
						label={__('Icon Spacing', 'theatrum-blocks')}
						onDeselect={() => setAttributes({ iconSpacing: '8' })}
						isShownByDefault={false}
					>
						<TextControl
							label={__('Spacing (px)', 'theatrum-blocks')}
							value={iconSpacing}
							onChange={(value) => setAttributes({ iconSpacing: value })}
							type="number"
							min="0"
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={() => !!iconColor}
						label={__('Icon Color', 'theatrum-blocks')}
						onDeselect={() => setAttributes({ iconColor: '' })}
						isShownByDefault={false}
					>
						<TextControl
							label={__('Color (hex, rgb, or CSS)', 'theatrum-blocks')}
							value={iconColor}
							onChange={(value) => setAttributes({ iconColor: value })}
							placeholder="#000000"
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={() => hoverOnly}
						label={__('Hover Only', 'theatrum-blocks')}
						onDeselect={() => setAttributes({ hoverOnly: false })}
						isShownByDefault={false}
					>
						<ToggleControl
							label={__('Show icon on hover only', 'theatrum-blocks')}
							checked={hoverOnly}
							onChange={(value) => setAttributes({ hoverOnly: value })}
							help={__('Icons will only display when hovering over the list item', 'theatrum-blocks')}
						/>
					</ToolsPanelItem>
				</ToolsPanel>

				{selectedItem && (
					<PanelBody title={__('Item Settings', 'theatrum-blocks')} initialOpen={true}>
						<TextControl
							label={__('Item Text', 'theatrum-blocks')}
							value={selectedItem.text}
							onChange={(value) => handleUpdateItem('text', value)}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>

						<div style={{ marginTop: '16px', marginBottom: '16px' }}>
							<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
								{__('Icon', 'theatrum-blocks')}
							</label>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={handleSelectIcon}
									allowedTypes={['image']}
									value={selectedItem.iconId}
									render={({ open }) => (
										<Button onClick={open} variant="primary" style={{ marginBottom: '8px', width: '100%' }}>
											{selectedItem.iconUrl
												? __('Replace Icon', 'theatrum-blocks')
												: __('Select Icon', 'theatrum-blocks')}
										</Button>
									)}
								/>
							</MediaUploadCheck>
							{selectedItem.iconUrl && (
								<Fragment>
									<img
										src={selectedItem.iconUrl}
										alt={selectedItem.iconAlt}
										style={{
											maxWidth: '100%',
											height: 'auto',
											marginBottom: '8px',
											maxHeight: '60px',
										}}
									/>
									<Button
										onClick={handleRemoveIcon}
										variant="secondary"
										isDestructive
										style={{ width: '100%' }}
									>
										{__('Remove Icon', 'theatrum-blocks')}
									</Button>
								</Fragment>
							)}
						</div>

						{selectedItem.iconUrl && (
							<TextControl
								label={__('Icon Alt Text', 'theatrum-blocks')}
								value={selectedItem.iconAlt}
								onChange={(value) => handleUpdateItem('iconAlt', value)}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						)}

						<div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
							<Button
								onClick={() => handleMoveItem(itemIndex, 'up')}
								variant="secondary"
								disabled={itemIndex === 0}
								style={{ flex: 1 }}
							>
								{__('↑ Move Up', 'theatrum-blocks')}
							</Button>
							<Button
								onClick={() => handleMoveItem(itemIndex, 'down')}
								variant="secondary"
								disabled={itemIndex === items.length - 1}
								style={{ flex: 1 }}
							>
								{__('Move Down ↓', 'theatrum-blocks')}
							</Button>
						</div>

						<Button
							onClick={handleDeleteItem}
							variant="secondary"
							isDestructive
							style={{ marginTop: '8px', width: '100%' }}
						>
							{__('Delete Item', 'theatrum-blocks')}
						</Button>
					</PanelBody>
				)}
			</InspectorControls>

			<div {...blockProps}>
				{renderPreview()}
			</div>
		</Fragment>
	);
}
