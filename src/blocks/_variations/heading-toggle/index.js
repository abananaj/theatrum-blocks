/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './editor.scss';

/**
 * Edit component for the Heading Toggle block
 */
function Edit({ attributes, setAttributes, className }) {
  const { content, level, isOpen } = attributes;
  const blockProps = useBlockProps({
    className: `wp-block-chance-toggle-heading toggle-heading-level-${level}`,
  });

  const headingLevelOptions = [
    { label: 'H1', value: 1 },
    { label: 'H2', value: 2 },
    { label: 'H3', value: 3 },
    { label: 'H4', value: 4 },
    { label: 'H5', value: 5 },
    { label: 'H6', value: 6 },
  ];

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Heading Settings', 'theatrum-blocks')}>
          <RangeControl
            label={__('Heading Level', 'theatrum-blocks')}
            value={level}
            onChange={(newLevel) => setAttributes({ level: newLevel })}
            min={1}
            max={6}
            marks={headingLevelOptions.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
          />
          <ToggleControl
            label={__('Open by Default', 'theatrum-blocks')}
            checked={isOpen}
            onChange={(newIsOpen) => setAttributes({ isOpen: newIsOpen })}
            help={isOpen ? __('Toggle content will be open', 'theatrum-blocks') : __('Toggle content will be closed', 'theatrum-blocks')}
          />
        </PanelBody>
      </InspectorControls>
      <details {...blockProps} open={isOpen}>
        <summary>
          <RichText
            value={content}
            onChange={(newContent) => setAttributes({ content: newContent })}
            placeholder={__('Enter heading text...', 'theatrum-blocks')}
            tagName="span"
            allowedFormats={['core/bold', 'core/italic', 'core/link']}
          />
        </summary>
        <div className="toggle-heading-content">
          <InnerBlocks
            allowedBlocks={true}
            renderAppender={InnerBlocks.ButtonBlockAppender}
          />
        </div>
      </details>
    </>
  );
}

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save() {
    // Server-side rendering via render.php
    return null;
  },
});
