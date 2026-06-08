import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import './editor.scss';

const TEMPLATE = [
  ['chance/tab', { label: 'Tab 1', isDefault: true }],
  ['chance/tab', { label: 'Tab 2' }],
];

const ALLOWED_BLOCKS = ['chance/tab'];

export default function Edit({ attributes, setAttributes, clientId }) {
  const { tabCount } = attributes;

  const innerBlockCount = useSelect(
    (select) => select('core/block-editor').getBlockCount(clientId),
    [clientId]
  );

  useEffect(() => {
    if (innerBlockCount > 0 && innerBlockCount !== tabCount) {
      setAttributes({ tabCount: innerBlockCount });
    }
  }, [innerBlockCount]);

  const blockProps = useBlockProps({
    className: 'is-editor-preview',
    style: { '--tab-count': innerBlockCount || tabCount },
  });

  return (
    <div {...blockProps}>
      <InnerBlocks
        template={TEMPLATE}
        allowedBlocks={ALLOWED_BLOCKS}
        orientation="horizontal"
      />
    </div>
  );
}
