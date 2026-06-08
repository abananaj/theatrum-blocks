import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const { label, isDefault } = attributes;
  const blockProps = useBlockProps.save();

  return (
    <details {...blockProps} name="tabs" open={isDefault || undefined}>
      <summary>
        <RichText.Content tagName="span" value={label} />
      </summary>
      <div className="tab-content">
        <InnerBlocks.Content />
      </div>
    </details>
  );
}
