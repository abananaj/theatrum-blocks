import {
  useBlockProps,
  useInnerBlocksProps,
  InspectorControls,
  BlockControls,
  store as blockEditorStore,
  HeadingLevelDropdown,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
  ToggleControl,
  RangeControl,
  ToolbarButton,
  ToolbarGroup,
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { useDispatch, useSelect, useRegistry } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

const TAB_ITEM_BLOCK = 'chance/production-tab-item';

export default function Edit({
  attributes: {
    autoclose,
    iconPosition,
    showIcon,
    headingLevel,
    initialTab,
    mobileBreakpoint,
  },
  clientId,
  setAttributes,
  isSelected: isSingleSelected,
}) {
  const registry = useRegistry();
  const { getBlockOrder } = useSelect(blockEditorStore);
  const { updateBlockAttributes, insertBlock } = useDispatch(blockEditorStore);

  const blockProps = useBlockProps({ role: 'group' });

  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    template: [[TAB_ITEM_BLOCK]],
    defaultBlock: { name: TAB_ITEM_BLOCK },
    directInsert: true,
    templateInsertUpdatesSelection: true,
  });

  const addTabItem = () => {
    insertBlock(createBlock(TAB_ITEM_BLOCK, {}), undefined, clientId);
  };

  const updateHeadingLevel = (newLevel) => {
    const innerBlockClientIds = getBlockOrder(clientId);
    registry.batch(() => {
      setAttributes({ headingLevel: newLevel });
      updateBlockAttributes(innerBlockClientIds, { level: newLevel });
    });
  };

  return (
    <>
      {isSingleSelected && (
        <>
          <BlockControls>
            <ToolbarGroup>
              <HeadingLevelDropdown
                value={headingLevel}
                onChange={updateHeadingLevel}
              />
            </ToolbarGroup>
          </BlockControls>
          <BlockControls group="other">
            <ToolbarButton onClick={addTabItem}>
              {__('Add tab', 'theatrum-blocks')}
            </ToolbarButton>
          </BlockControls>
        </>
      )}

      <InspectorControls>
        <ToolsPanel
          label={__('Settings', 'theatrum-blocks')}
          resetAll={() => {
            setAttributes({
              autoclose: false,
              showIcon: true,
              iconPosition: 'right',
              initialTab: 0,
              mobileBreakpoint: 768,
            });
          }}
        >
          <ToolsPanelItem
            label={__('Initial tab', 'theatrum-blocks')}
            isShownByDefault
            hasValue={() => initialTab !== 0}
            onDeselect={() => setAttributes({ initialTab: 0 })}
          >
            <RangeControl
              __next40pxDefaultSize
              __nextHasNoMarginBottom
              label={__('Initial tab', 'theatrum-blocks')}
              value={initialTab}
              onChange={(value) =>
                setAttributes({ initialTab: value })
              }
              min={0}
              max={20}
              help={__(
                'Zero-based index of the tab open on page load.',
                'theatrum-blocks'
              )}
            />
          </ToolsPanelItem>

          <ToolsPanelItem
            label={__('Auto-close (mobile)', 'theatrum-blocks')}
            isShownByDefault
            hasValue={() => !!autoclose}
            onDeselect={() =>
              setAttributes({ autoclose: false })
            }
          >
            <ToggleControl
              __nextHasNoMarginBottom
              label={__('Auto-close (mobile)', 'theatrum-blocks')}
              checked={autoclose}
              onChange={(value) =>
                setAttributes({ autoclose: value })
              }
              help={__(
                'Automatically close other sections when one is opened in accordion mode.',
                'theatrum-blocks'
              )}
            />
          </ToolsPanelItem>

          <ToolsPanelItem
            label={__('Show icon', 'theatrum-blocks')}
            isShownByDefault
            hasValue={() => !showIcon}
            onDeselect={() => setAttributes({ showIcon: true })}
          >
            <ToggleControl
              __nextHasNoMarginBottom
              label={__('Show icon', 'theatrum-blocks')}
              checked={showIcon}
              onChange={(value) =>
                setAttributes({
                  showIcon: value,
                  iconPosition: value ? iconPosition : 'right',
                })
              }
              help={__(
                'Display a plus icon in accordion headings on mobile.',
                'theatrum-blocks'
              )}
            />
          </ToolsPanelItem>

          {showIcon && (
            <ToolsPanelItem
              label={__('Icon position', 'theatrum-blocks')}
              isShownByDefault
              hasValue={() => iconPosition !== 'right'}
              onDeselect={() =>
                setAttributes({ iconPosition: 'right' })
              }
            >
              <ToggleGroupControl
                __next40pxDefaultSize
                isBlock
                label={__('Icon position', 'theatrum-blocks')}
                value={iconPosition}
                onChange={(value) =>
                  setAttributes({ iconPosition: value })
                }
              >
                <ToggleGroupControlOption
                  label={__('Left', 'theatrum-blocks')}
                  value="left"
                />
                <ToggleGroupControlOption
                  label={__('Right', 'theatrum-blocks')}
                  value="right"
                />
              </ToggleGroupControl>
            </ToolsPanelItem>
          )}

          <ToolsPanelItem
            label={__('Mobile breakpoint', 'theatrum-blocks')}
            isShownByDefault={false}
            hasValue={() => mobileBreakpoint !== 768}
            onDeselect={() =>
              setAttributes({ mobileBreakpoint: 768 })
            }
          >
            <RangeControl
              __next40pxDefaultSize
              __nextHasNoMarginBottom
              label={__(
                'Mobile breakpoint (px)',
                'theatrum-blocks'
              )}
              value={mobileBreakpoint}
              onChange={(value) =>
                setAttributes({ mobileBreakpoint: value })
              }
              min={480}
              max={1200}
              step={1}
              help={__(
                'Viewport width below which the block switches to accordion mode.',
                'theatrum-blocks'
              )}
            />
          </ToolsPanelItem>
        </ToolsPanel>
      </InspectorControls>

      <div {...innerBlocksProps} />
    </>
  );
}
