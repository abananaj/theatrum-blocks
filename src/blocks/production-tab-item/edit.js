import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import {
  useBlockProps,
  useInnerBlocksProps,
  InspectorControls,
  RichText,
  store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import {
  ToggleControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import clsx from 'clsx';

export default function Edit({
  attributes,
  clientId,
  setAttributes,
  context,
  isSelected: isSingleSelected,
}) {
  const { title, openByDefault, level, iconPosition, showIcon } = attributes;

  // Read settings from the parent tabs block via context.
  const {
    'chance/tabs-icon-position': ctxIconPosition,
    'chance/tabs-show-icon': ctxShowIcon,
    'chance/tabs-heading-level': ctxHeadingLevel,
  } = context;

  const { __unstableMarkNextChangeAsNotPersistent } =
    useDispatch(blockEditorStore);

  // Sync icon settings from parent context into local attributes so they are
  // serialised correctly in save.js (mirrors accordion-heading's approach).
  useEffect(() => {
    if (
      ctxIconPosition !== undefined &&
      ctxShowIcon !== undefined
    ) {
      __unstableMarkNextChangeAsNotPersistent();
      setAttributes({
        iconPosition: ctxIconPosition,
        showIcon: ctxShowIcon,
      });
    }
  }, [ctxIconPosition, ctxShowIcon]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (ctxHeadingLevel !== undefined) {
      __unstableMarkNextChangeAsNotPersistent();
      setAttributes({ level: ctxHeadingLevel });
    }
  }, [ctxHeadingLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show the panel whenever this item (or a child) is selected.
  const { isSelected } = useSelect(
    (select) => {
      if (isSingleSelected || openByDefault) {
        return { isSelected: true };
      }
      return {
        isSelected: select(blockEditorStore).hasSelectedInnerBlock(
          clientId,
          true
        ),
      };
    },
    [clientId, isSingleSelected, openByDefault]
  );

  const TagName = 'h' + (level || 3);

  const blockProps = useBlockProps({
    className: clsx({ 'is-open': openByDefault || isSelected }),
  });

  // Inner blocks go into the panel div, not the block root.
  const innerBlocksProps = useInnerBlocksProps(
    { className: 'wp-block-chance-production-tab-item__panel' },
    { templateLock: false }
  );

  return (
    <>
      <InspectorControls>
        <ToolsPanel
          label={__('Settings', 'theatrum-blocks')}
          resetAll={() =>
            setAttributes({ openByDefault: false })
          }
        >
          <ToolsPanelItem
            label={__('Open by default', 'theatrum-blocks')}
            isShownByDefault
            hasValue={() => !!openByDefault}
            onDeselect={() =>
              setAttributes({ openByDefault: false })
            }
          >
            <ToggleControl
              __nextHasNoMarginBottom
              label={__(
                'Open by default',
                'theatrum-blocks'
              )}
              checked={openByDefault}
              onChange={(value) =>
                setAttributes({ openByDefault: value })
              }
              help={__(
                'This section will be open by default in accordion mode on mobile.',
                'theatrum-blocks'
              )}
            />
          </ToolsPanelItem>
        </ToolsPanel>
      </InspectorControls>

      <div {...blockProps}>
        <TagName className="wp-block-chance-production-tab-item__heading">
          <button
            type="button"
            className="wp-block-chance-production-tab-item__toggle"
            tabIndex="-1"
          >
            {showIcon && iconPosition === 'left' && (
              <span
                className="wp-block-chance-production-tab-item__toggle-icon"
                aria-hidden="true"
              >
                +
              </span>
            )}
            <RichText
              withoutInteractiveFormatting
              disableLineBreaks
              tagName="span"
              value={title}
              onChange={(newTitle) =>
                setAttributes({ title: newTitle })
              }
              placeholder={__(
                'Tab title',
                'theatrum-blocks'
              )}
              className="wp-block-chance-production-tab-item__title"
            />
            {showIcon && iconPosition === 'right' && (
              <span
                className="wp-block-chance-production-tab-item__toggle-icon"
                aria-hidden="true"
              >
                +
              </span>
            )}
          </button>
        </TagName>

        <div {...innerBlocksProps} />
      </div>
    </>
  );
}
