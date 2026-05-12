/**
 * Styled Text Block Editor
 * 
 * Flexible text block with:
 * - Selectable HTML tag (h1-h6, p)
 * - RichText content with inline formatting
 * - Styled spans with individual typography and color options
 */

import { useBlockProps, RichText, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { Fragment, useState, useCallback } from '@wordpress/element';
import {
  SelectControl,
  ToolbarGroup,
  ToolbarButton,
  PanelBody,
  Button,
  TextControl,
  __experimentalText as Text,
} from '@wordpress/components';
import './editor.scss';

/**
 * Generate a simple unique ID
 */
const generateId = () => {
  return 'span-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

const TAG_OPTIONS = [
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Heading 4', value: 'h4' },
  { label: 'Heading 5', value: 'h5' },
  { label: 'Heading 6', value: 'h6' },
  { label: 'Paragraph', value: 'p' },
];

export default function Edit({ attributes, setAttributes }) {
  const { content, tagName, styledSpans } = attributes;
  const blockProps = useBlockProps();
  const [selectedSpanId, setSelectedSpanId] = useState(null);

  const selectedSpan = styledSpans?.find((span) => span.id === selectedSpanId);

  const handleCreateStyledSpan = useCallback(() => {
    const selection = window.getSelection();

    if (!selection.toString()) {
      alert('Please select some text first to create a styled span.');
      return;
    }

    const spanId = generateId();
    const selectedText = selection.toString();

    // Add the new span to the array
    const newSpan = {
      id: spanId,
      text: selectedText,
      fontSize: undefined,
      fontFamily: undefined,
      fontStyle: undefined,
      fontWeight: undefined,
      letterSpacing: undefined,
      lineHeight: undefined,
      textDecoration: undefined,
      textTransform: undefined,
      color: undefined,
      backgroundColor: undefined,
    };

    setAttributes({
      styledSpans: [...(styledSpans || []), newSpan],
    });

    setSelectedSpanId(spanId);
  }, [styledSpans, setAttributes]);

  const handleUpdateSpan = useCallback(
    (property, value) => {
      const updatedSpans = styledSpans.map((span) =>
        span.id === selectedSpanId ? { ...span, [property]: value } : span
      );
      setAttributes({ styledSpans: updatedSpans });
    },
    [selectedSpanId, styledSpans, setAttributes]
  );

  const handleDeleteSpan = useCallback(() => {
    const updatedSpans = styledSpans.filter((span) => span.id !== selectedSpanId);
    setAttributes({ styledSpans: updatedSpans });
    setSelectedSpanId(null);
  }, [selectedSpanId, styledSpans, setAttributes]);

  const tagElement = tagName || 'p';

  return (
    <Fragment>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            title="Create styled span"
            icon="editor-textcolor"
            onClick={handleCreateStyledSpan}
            shortcut="Ctrl+Shift+S"
          >
            Styled Span
          </ToolbarButton>
        </ToolbarGroup>
      </BlockControls>

      <InspectorControls>
        <PanelBody title="Text Settings" initialOpen={true}>
          <SelectControl
            label="HTML Tag"
            value={tagName}
            options={TAG_OPTIONS}
            onChange={(value) => setAttributes({ tagName: value })}
            help="Select the HTML tag to render this text as"
          />
        </PanelBody>

        {selectedSpan && (
          <PanelBody title="Styled Span Settings" initialOpen={true}>
            <Text className="styled-text-span-label">
              Selected: <strong>{selectedSpan.text}</strong>
            </Text>

            <TextControl
              label="Font Size"
              value={selectedSpan.fontSize || ''}
              onChange={(value) => handleUpdateSpan('fontSize', value)}
              placeholder="e.g., 18px, 1.5em"
              __nextHasNoMarginBottom
              __next40pxDefaultSize
            />

            <TextControl
              label="Font Family"
              value={selectedSpan.fontFamily || ''}
              onChange={(value) => handleUpdateSpan('fontFamily', value)}
              placeholder="e.g., Georgia, serif"
              __nextHasNoMarginBottom
              __next40pxDefaultSize
            />

            <SelectControl
              label="Font Weight"
              value={selectedSpan.fontWeight || ''}
              options={[
                { label: 'Default', value: '' },
                { label: 'Light (300)', value: '300' },
                { label: 'Normal (400)', value: '400' },
                { label: 'Semi-bold (600)', value: '600' },
                { label: 'Bold (700)', value: '700' },
                { label: 'Extra Bold (800)', value: '800' },
              ]}
              onChange={(value) => handleUpdateSpan('fontWeight', value)}
              __nextHasNoMarginBottom
            />

            <SelectControl
              label="Font Style"
              value={selectedSpan.fontStyle || ''}
              options={[
                { label: 'Default', value: '' },
                { label: 'Italic', value: 'italic' },
                { label: 'Oblique', value: 'oblique' },
              ]}
              onChange={(value) => handleUpdateSpan('fontStyle', value)}
              __nextHasNoMarginBottom
            />

            <TextControl
              label="Letter Spacing"
              value={selectedSpan.letterSpacing || ''}
              onChange={(value) => handleUpdateSpan('letterSpacing', value)}
              placeholder="e.g., 0.05em"
              __nextHasNoMarginBottom
              __next40pxDefaultSize
            />

            <TextControl
              label="Line Height"
              value={selectedSpan.lineHeight || ''}
              onChange={(value) => handleUpdateSpan('lineHeight', value)}
              placeholder="e.g., 1.5, 24px"
              __nextHasNoMarginBottom
              __next40pxDefaultSize
            />

            <SelectControl
              label="Text Decoration"
              value={selectedSpan.textDecoration || ''}
              options={[
                { label: 'None', value: '' },
                { label: 'Underline', value: 'underline' },
                { label: 'Overline', value: 'overline' },
                { label: 'Line-through', value: 'line-through' },
              ]}
              onChange={(value) => handleUpdateSpan('textDecoration', value)}
              __nextHasNoMarginBottom
            />

            <SelectControl
              label="Text Transform"
              value={selectedSpan.textTransform || ''}
              options={[
                { label: 'None', value: '' },
                { label: 'Uppercase', value: 'uppercase' },
                { label: 'Lowercase', value: 'lowercase' },
                { label: 'Capitalize', value: 'capitalize' },
              ]}
              onChange={(value) => handleUpdateSpan('textTransform', value)}
              __nextHasNoMarginBottom
            />

            <TextControl
              label="Text Color"
              type="color"
              value={selectedSpan.color || ''}
              onChange={(value) => handleUpdateSpan('color', value)}
              __nextHasNoMarginBottom
              __next40pxDefaultSize
            />

            <TextControl
              label="Background Color"
              type="color"
              value={selectedSpan.backgroundColor || ''}
              onChange={(value) => handleUpdateSpan('backgroundColor', value)}
              __nextHasNoMarginBottom
              __next40pxDefaultSize
            />

            <Button
              isDestructive
              onClick={handleDeleteSpan}
              variant="secondary"
            >
              Delete Span
            </Button>
          </PanelBody>
        )}

        {styledSpans && styledSpans.length > 0 && (
          <PanelBody title={`Styled Spans (${styledSpans.length})`} initialOpen={false}>
            {styledSpans.map((span) => (
              <Button
                key={span.id}
                onClick={() => setSelectedSpanId(span.id)}
                variant={selectedSpanId === span.id ? 'primary' : 'secondary'}
                style={{ marginBottom: '8px', width: '100%' }}
              >
                {span.text}
              </Button>
            ))}
          </PanelBody>
        )}
      </InspectorControls>

      <div {...blockProps}>
        <RichText
          tagName={tagElement}
          value={content}
          onChange={(value) => setAttributes({ content: value })}
          placeholder="Enter your text here..."
          data-styled-text="true"
          className="styled-text-content"
        />
      </div>
    </Fragment>
  );
}
