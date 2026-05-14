import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
  const blockProps = useBlockProps({ className: 'performances-list-editor' });

  return (
    <div {...blockProps}>
      <div className="performances-list-placeholder">
        <span className="dashicons dashicons-calendar-alt" />
        <p>{__('Performances List', 'performances-list')}</p>
        <p className="description">
          {__(
            'Displays the next 5 upcoming performances from the performances repeater field.',
            'performances-list'
          )}
        </p>
      </div>
    </div>
  );
}
