import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { label, isDefault } = attributes;

  const blockProps = useBlockProps({
    className: isDefault ? 'is-default' : '',
  });

  return (
    <details {...blockProps} open={isDefault}>
      <summary>
        <RichText
          tagName="span"
          value={label}
          onChange={(value) => setAttributes({ label: value })}
          placeholder={__('Tab label…', 'theatrum-blocks')}
          allowedFormats={['core/bold', 'core/italic']}
        />
      </summary>
      <div className="tab-content">
        <InnerBlocks />
      </div>
    </details>
  );
}
