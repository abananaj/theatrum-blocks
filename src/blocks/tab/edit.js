import { InnerBlocks, RichText } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { title } = attributes;

  return (
    <div className="wp-block-theatrum-tab">
      <div className="tab-edit-title">
        <TextControl
          label="Tab Title"
          value={title}
          onChange={(newTitle) => setAttributes({ title: newTitle })}
          placeholder="Enter tab title"
        />
      </div>
      <div className="tab-edit-content">
        <InnerBlocks />
      </div>
    </div>
  );
}
