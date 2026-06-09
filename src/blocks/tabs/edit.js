import { InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  SelectControl,
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { orientation } = attributes;

  const ALLOWED_BLOCKS = ['theatrum/tab'];
  const TEMPLATE = [
    ['theatrum/tab', { title: 'Tab 1' }],
    ['theatrum/tab', { title: 'Tab 2' }],
  ];

  return (
    <>
      <InspectorControls>
        <PanelBody title="Tabs Settings">
          <SelectControl
            label="Orientation"
            value={orientation}
            options={[
              { label: 'Horizontal', value: 'horizontal' },
              { label: 'Vertical', value: 'vertical' },
            ]}
            onChange={(newOrientation) =>
              setAttributes({ orientation: newOrientation })
            }
          />
        </PanelBody>
      </InspectorControls>

      <div
        className={`wp-block-theatrum-tabs wp-block-theatrum-tabs--${orientation}`}
        data-tab-component="true"
        data-tab-orientation={orientation}
      >
        <InnerBlocks
          allowedBlocks={ALLOWED_BLOCKS}
          template={TEMPLATE}
          templateLock={false}
        />
      </div>
    </>
  );
}
