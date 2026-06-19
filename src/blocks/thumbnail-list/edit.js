/**
 * Thumbnail List Block Editor
 * 
 * An interactive list block that displays thumbnail images when hovering over items.
 * Each item can have a title, description, and thumbnail image.
 */

import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import {
  TextControl,
  TextareaControl,
  PanelBody,
  Button,
  ButtonGroup,
  SelectControl,
  RangeControl,
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
  const {
    items,
    thumbnailWidth,
    thumbnailWidthUnit,
    thumbnailHeight,
    thumbnailHeightUnit,
    itemHeight,
    itemHeightUnit,
    thumbnailPosition,
    animationSpeed,
  } = attributes;
  const blockProps = useBlockProps();
  const [selectedItemId, setSelectedItemId] = useState(null);

  const selectedItem = items?.find((item) => item.id === selectedItemId);

  const handleAddItem = () => {
    const newItem = {
      id: generateId(),
      title: 'List item',
      description: 'Add a description',
      thumbnailId: 0,
      thumbnailUrl: '',
      thumbnailAlt: '',
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

  const handleSelectThumbnail = (media) => {
    const updatedItems = items.map((item) =>
      item.id === selectedItemId
        ? { ...item, thumbnailId: media.id, thumbnailUrl: media.url, thumbnailAlt: media.alt || '' }
        : item
    );
    setAttributes({ items: updatedItems });
  };

  const handleRemoveThumbnail = () => {
    const updatedItems = items.map((item) =>
      item.id === selectedItemId
        ? { ...item, thumbnailId: 0, thumbnailUrl: '', thumbnailAlt: '' }
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

  const renderPreview = () => {
    if (!items || items.length === 0) {
      return (
        <p style={{ color: '#999', fontStyle: 'italic' }}>
          {__('No items yet. Click "Add Item" to get started.', 'theatrum-blocks')}
        </p>
      );
    }

    return (
      <div
        className={`wp-block-chance-thumbnail-list-preview thumbnail-position-${thumbnailPosition}`}
        style={{
          display: 'grid',
          gridTemplateColumns: thumbnailPosition === 'right' ? '1fr auto' : 'auto 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Menu/List items */}
        <div className="list-items">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`list-item ${item.id === selectedItemId ? 'selected' : ''}`}
              style={{
                height: `${itemHeight}${itemHeightUnit}`,
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                backgroundColor: item.id === selectedItemId ? '#f0f0f0' : 'transparent',
                transition: `color 0.3s ease`,
              }}
              onClick={() => setSelectedItemId(item.id)}
            >
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {item.title}
              </div>
              {item.description && (
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                  {item.description}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Thumbnail display */}
        {selectedItem?.thumbnailUrl && (
          <div
            className="thumbnail-display"
            style={{
              width: `${thumbnailWidth}${thumbnailWidthUnit}`,
              height: `${thumbnailHeight}${thumbnailHeightUnit}`,
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={selectedItem.thumbnailUrl}
              alt={selectedItem.thumbnailAlt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const itemIndex = items?.findIndex((item) => item.id === selectedItemId) ?? -1;

  return (
    <Fragment>
      <InspectorControls>
        <ToolsPanel
          label={__('Display Settings', 'theatrum-blocks')}
          resetAll={() => {
            setAttributes({
              thumbnailWidth: '400',
              thumbnailWidthUnit: 'px',
              thumbnailHeight: '300',
              thumbnailHeightUnit: 'px',
              itemHeight: '80',
              itemHeightUnit: 'px',
              thumbnailPosition: 'right',
              animationSpeed: '0.3',
            });
          }}
        >
          <ToolsPanelItem
            hasValue={() => thumbnailPosition !== 'right'}
            label={__('Thumbnail Position', 'theatrum-blocks')}
            onDeselect={() => setAttributes({ thumbnailPosition: 'right' })}
            isShownByDefault={true}
          >
            <ButtonGroup>
              {[
                { label: __('Left', 'theatrum-blocks'), value: 'left' },
                { label: __('Right', 'theatrum-blocks'), value: 'right' },
              ].map((option) => (
                <Button
                  key={option.value}
                  isPrimary={thumbnailPosition === option.value}
                  isSecondary={thumbnailPosition !== option.value}
                  onClick={() => setAttributes({ thumbnailPosition: option.value })}
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>
          </ToolsPanelItem>

          <ToolsPanelItem
            hasValue={() => itemHeight !== '80'}
            label={__('Item Height', 'theatrum-blocks')}
            onDeselect={() => setAttributes({ itemHeight: '80' })}
            isShownByDefault={false}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <RangeControl
                label={__('Item Height', 'theatrum-blocks')}
                value={parseInt(itemHeight)}
                onChange={(value) => setAttributes({ itemHeight: value.toString() })}
                min={40}
                max={200}
                step={10}
                style={{ flex: 1 }}
              />
              <SelectControl
                value={itemHeightUnit}
                options={[
                  { label: 'px', value: 'px' },
                  { label: 'em', value: 'em' },
                  { label: 'rem', value: 'rem' },
                ]}
                onChange={(value) => setAttributes({ itemHeightUnit: value })}
                style={{ width: '80px' }}
              />
            </div>
          </ToolsPanelItem>

          <ToolsPanelItem
            hasValue={() => thumbnailWidth !== '400'}
            label={__('Thumbnail Width', 'theatrum-blocks')}
            onDeselect={() => setAttributes({ thumbnailWidth: '400', thumbnailWidthUnit: 'px' })}
            isShownByDefault={false}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <TextControl
                label={__('Width', 'theatrum-blocks')}
                value={thumbnailWidth}
                onChange={(value) => setAttributes({ thumbnailWidth: value })}
                type="number"
                style={{ flex: 1 }}
              />
              <SelectControl
                value={thumbnailWidthUnit}
                options={[
                  { label: 'px', value: 'px' },
                  { label: '%', value: '%' },
                  { label: 'em', value: 'em' },
                  { label: 'rem', value: 'rem' },
                ]}
                onChange={(value) => setAttributes({ thumbnailWidthUnit: value })}
                style={{ width: '80px' }}
              />
            </div>
          </ToolsPanelItem>

          <ToolsPanelItem
            hasValue={() => thumbnailHeight !== '300'}
            label={__('Thumbnail Height', 'theatrum-blocks')}
            onDeselect={() => setAttributes({ thumbnailHeight: '300', thumbnailHeightUnit: 'px' })}
            isShownByDefault={false}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <TextControl
                label={__('Height', 'theatrum-blocks')}
                value={thumbnailHeight}
                onChange={(value) => setAttributes({ thumbnailHeight: value })}
                type="number"
                style={{ flex: 1 }}
              />
              <SelectControl
                value={thumbnailHeightUnit}
                options={[
                  { label: 'px', value: 'px' },
                  { label: 'em', value: 'em' },
                  { label: 'rem', value: 'rem' },
                ]}
                onChange={(value) => setAttributes({ thumbnailHeightUnit: value })}
                style={{ width: '80px' }}
              />
            </div>
          </ToolsPanelItem>

          <ToolsPanelItem
            hasValue={() => animationSpeed !== '0.3'}
            label={__('Animation Speed', 'theatrum-blocks')}
            onDeselect={() => setAttributes({ animationSpeed: '0.3' })}
            isShownByDefault={false}
          >
            <SelectControl
              label={__('Speed', 'theatrum-blocks')}
              value={animationSpeed}
              options={[
                { label: __('Fast (0.2s)', 'theatrum-blocks'), value: '0.2' },
                { label: __('Normal (0.3s)', 'theatrum-blocks'), value: '0.3' },
                { label: __('Slow (0.5s)', 'theatrum-blocks'), value: '0.5' },
                { label: __('Very Slow (1s)', 'theatrum-blocks'), value: '1' },
              ]}
              onChange={(value) => setAttributes({ animationSpeed: value })}
            />
          </ToolsPanelItem>
        </ToolsPanel>

        {selectedItem && (
          <PanelBody title={__('Item Settings', 'theatrum-blocks')} initialOpen={true}>
            <TextControl
              label={__('Title', 'theatrum-blocks')}
              value={selectedItem.title}
              onChange={(value) => handleUpdateItem('title', value)}
            />

            <TextareaControl
              label={__('Description', 'theatrum-blocks')}
              value={selectedItem.description}
              onChange={(value) => handleUpdateItem('description', value)}
              rows={3}
            />

            <PanelBody title={__('Thumbnail Image', 'theatrum-blocks')} initialOpen={false}>
              {selectedItem.thumbnailUrl ? (
                <Fragment>
                  <img
                    src={selectedItem.thumbnailUrl}
                    alt={selectedItem.thumbnailAlt}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '4px',
                      marginBottom: '12px',
                    }}
                  />
                  <Button
                    isDestructive
                    onClick={handleRemoveThumbnail}
                    variant="secondary"
                    size="compact"
                    fullWidth
                  >
                    {__('Remove Image', 'theatrum-blocks')}
                  </Button>
                </Fragment>
              ) : (
                <MediaUploadCheck>
                  <MediaUpload
                    onSelect={handleSelectThumbnail}
                    allowedTypes={['image']}
                    value={selectedItem.thumbnailId}
                    render={({ open }) => (
                      <Button onClick={open} variant="primary">
                        {__('Select Image', 'theatrum-blocks')}
                      </Button>
                    )}
                  />
                </MediaUploadCheck>
              )}
            </PanelBody>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              {itemIndex > 0 && (
                <Button
                  onClick={() => handleMoveItem(itemIndex, 'up')}
                  isSecondary
                  size="compact"
                  variant="secondary"
                >
                  {__('↑ Move Up', 'theatrum-blocks')}
                </Button>
              )}
              {itemIndex < (items?.length ?? 0) - 1 && (
                <Button
                  onClick={() => handleMoveItem(itemIndex, 'down')}
                  isSecondary
                  size="compact"
                  variant="secondary"
                >
                  {__('↓ Move Down', 'theatrum-blocks')}
                </Button>
              )}
              <Button
                onClick={handleDeleteItem}
                isDestructive
                size="compact"
                variant="secondary"
                style={{ marginLeft: 'auto' }}
              >
                {__('Delete Item', 'theatrum-blocks')}
              </Button>
            </div>
          </PanelBody>
        )}
      </InspectorControls>

      <div {...blockProps}>
        {renderPreview()}

        <div style={{ marginTop: '20px' }}>
          <Button onClick={handleAddItem} variant="primary">
            {__('+ Add Item', 'theatrum-blocks')}
          </Button>
        </div>
      </div>
    </Fragment>
  );
}
