import { InspectorControls, BlockControls, MediaUpload, RichText, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, Button, ToolbarButton, ToggleControl, SelectControl, RangeControl, ToolbarGroup, TextControl } from '@wordpress/components';
import { useState, Fragment } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
  const {
    items = [],
    currentSlide = 0,
    minHeight = 300,
    minHeightUnit = 'px',
    contentPosition = 'center',
    showIndicators = true,
    indicatorStyle = 'dots',
    showArrows = true,
    arrowStyle = 'light',
    autoplay = false,
    autoplaySpeed = 5000,
    transitionType = 'fade',
    transitionSpeed = 500
  } = attributes;

  const updateSlide = (index, newData) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...newData };
    setAttributes({ items: newItems });
  };

  const removeSlide = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setAttributes({ items: newItems, currentSlide: Math.min(currentSlide, newItems.length - 1) });
  };

  const addSlide = () => {
    const newItems = [...items, {
      id: Date.now(),
      url: '',
      type: 'image',
      dimRatio: 50,
      overlayColor: '',
      customOverlayColor: '#000000',
      focalPoint: { x: 0.5, y: 0.5 }
    }];
    setAttributes({ items: newItems });
  };

  const slide = items[currentSlide] || {};

  return (
    <Fragment>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => setAttributes({ currentSlide: Math.max(0, currentSlide - 1) })}
            disabled={currentSlide === 0}
            label="Previous slide"
          >
            ←
          </ToolbarButton>
          <span style={{ margin: '0 8px', alignSelf: 'center' }}>
            {currentSlide + 1} / {items.length}
          </span>
          <ToolbarButton
            onClick={() => setAttributes({ currentSlide: Math.min(items.length - 1, currentSlide + 1) })}
            disabled={currentSlide === items.length - 1}
            label="Next slide"
          >
            →
          </ToolbarButton>
        </ToolbarGroup>
      </BlockControls>

      <InspectorControls>
        {/* Slide Content Controls */}
        <PanelBody title="Slide Content" initialOpen={true}>
          {items.length === 0 ? (
            <Button variant="primary" onClick={addSlide}>
              Add First Slide
            </Button>
          ) : (
            <Fragment>
              <div style={{ marginBottom: '16px' }}>
                <strong>Slide {currentSlide + 1} of {items.length}</strong>
              </div>

              <MediaUpload
                onSelect={(media) => updateSlide(currentSlide, { url: media.url, type: media.type })}
                type={['image', 'video']}
                render={({ open }) => (
                  <Button variant="secondary" onClick={open}>
                    {slide.url ? 'Change Media' : 'Select Media'}
                  </Button>
                )}
              />

              {slide.url && (
                <div style={{ margin: '12px 0', marginBottom: '12px', textAlign: 'center' }}>
                  <small>{slide.url}</small>
                </div>
              )}

              <RangeControl
                label="Overlay Opacity"
                value={slide.dimRatio || 50}
                onChange={(value) => updateSlide(currentSlide, { dimRatio: value })}
                min={0}
                max={100}
                step={10}
              />

              <div style={{ marginBottom: '12px' }}>
                <label>Overlay Color</label>
                <ColorPalette
                  value={slide.customOverlayColor}
                  onChange={(value) => updateSlide(currentSlide, { customOverlayColor: value })}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label>Focal Point (X)</label>
                <RangeControl
                  value={Math.round((slide.focalPoint?.x || 0.5) * 100)}
                  onChange={(value) => updateSlide(currentSlide, { focalPoint: { ...slide.focalPoint, x: value / 100 } })}
                  min={0}
                  max={100}
                  step={5}
                />
                <label>Focal Point (Y)</label>
                <RangeControl
                  value={Math.round((slide.focalPoint?.y || 0.5) * 100)}
                  onChange={(value) => updateSlide(currentSlide, { focalPoint: { ...slide.focalPoint, y: value / 100 } })}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>

              <div style={{ marginTop: '16px', borderTop: '1px solid #e0e0e0', paddingTop: '16px' }}>
                <Button
                  isDestructive
                  onClick={() => removeSlide(currentSlide)}
                  style={{ width: '100%' }}
                >
                  Remove Slide
                </Button>
              </div>

              <Button
                variant="secondary"
                onClick={addSlide}
                style={{ width: '100%', marginTop: '8px' }}
              >
                Add Slide
              </Button>
            </Fragment>
          )}
        </PanelBody>

        {/* Appearance Controls */}
        <PanelBody title="Appearance">
          <RangeControl
            label="Minimum Height"
            value={minHeight}
            onChange={(value) => setAttributes({ minHeight: value })}
            min={100}
            max={800}
            step={10}
          />

          <SelectControl
            label="Height Unit"
            value={minHeightUnit}
            options={[
              { label: 'pixels (px)', value: 'px' },
              { label: 'viewport height (vh)', value: 'vh' }
            ]}
            onChange={(value) => setAttributes({ minHeightUnit: value })}
          />

          <SelectControl
            label="Content Position"
            value={contentPosition}
            options={[
              { label: 'Center', value: 'center' },
              { label: 'Top Center', value: 'top-center' },
              { label: 'Top Left', value: 'top-left' },
              { label: 'Top Right', value: 'top-right' },
              { label: 'Bottom Center', value: 'bottom-center' },
              { label: 'Bottom Left', value: 'bottom-left' },
              { label: 'Bottom Right', value: 'bottom-right' }
            ]}
            onChange={(value) => setAttributes({ contentPosition: value })}
          />
        </PanelBody>

        {/* Navigation Controls */}
        <PanelBody title="Navigation">
          <ToggleControl
            label="Show Indicators"
            checked={showIndicators}
            onChange={(value) => setAttributes({ showIndicators: value })}
          />

          {showIndicators && (
            <SelectControl
              label="Indicator Style"
              value={indicatorStyle}
              options={[
                { label: 'Dots', value: 'dots' },
                { label: 'Lines', value: 'lines' },
                { label: 'Numbers', value: 'numbers' }
              ]}
              onChange={(value) => setAttributes({ indicatorStyle: value })}
            />
          )}

          <ToggleControl
            label="Show Arrows"
            checked={showArrows}
            onChange={(value) => setAttributes({ showArrows: value })}
          />

          {showArrows && (
            <SelectControl
              label="Arrow Style"
              value={arrowStyle}
              options={[
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' }
              ]}
              onChange={(value) => setAttributes({ arrowStyle: value })}
            />
          )}
        </PanelBody>

        {/* Autoplay Controls */}
        <PanelBody title="Autoplay">
          <ToggleControl
            label="Enable Autoplay"
            checked={autoplay}
            onChange={(value) => setAttributes({ autoplay: value })}
          />

          {autoplay && (
            <RangeControl
              label="Time Between Slides (ms)"
              value={autoplaySpeed}
              onChange={(value) => setAttributes({ autoplaySpeed: value })}
              min={1000}
              max={10000}
              step={500}
            />
          )}
        </PanelBody>

        {/* Transition Controls */}
        <PanelBody title="Transition">
          <SelectControl
            label="Transition Type"
            value={transitionType}
            options={[
              { label: 'Fade', value: 'fade' },
              { label: 'Slide', value: 'slide' }
            ]}
            onChange={(value) => setAttributes({ transitionType: value })}
          />

          <RangeControl
            label="Transition Speed (ms)"
            value={transitionSpeed}
            onChange={(value) => setAttributes({ transitionSpeed: value })}
            min={100}
            max={2000}
            step={100}
          />
        </PanelBody>
      </InspectorControls>

      {/* Block Preview */}
      <div
        style={{
          minHeight: `${minHeight}${minHeightUnit}`,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {items.length === 0 ? (
          <Fragment>
            <p>No slides yet</p>
            <Button variant="primary" onClick={addSlide}>
              Add Slide
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            {slide.url && (
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${slide.url})`,
                backgroundPosition: `${(slide.focalPoint?.x || 0.5) * 100}% ${(slide.focalPoint?.y || 0.5) * 100}%`,
                backgroundSize: 'cover',
                opacity: 1 - (slide.dimRatio || 50) / 100
              }} />
            )}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: slide.customOverlayColor,
              opacity: (slide.dimRatio || 50) / 100
            }} />
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
              <p style={{ margin: 0 }}>Slide {currentSlide + 1} of {items.length}</p>
              <small>{slide.type} - {slide.url || 'No media'}</small>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
