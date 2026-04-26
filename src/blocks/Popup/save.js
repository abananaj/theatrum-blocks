import { InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const { buttonText, isOpen } = attributes;

  return (
    <div className="wp-block-chance-popup">
      <button
        className="popup-toggle-button"
        data-popup-toggle="true"
        aria-expanded={isOpen ? 'true' : 'false'}
      >
        {buttonText}
      </button>
      {isOpen && (
        <div className="popup-backdrop" data-popup-backdrop="true" />
      )}
      <div
        className={isOpen ? 'popup-content-visible' : 'popup-content-hidden'}
        data-popup-content="true"
        style={{ display: isOpen ? 'block' : 'none', marginTop: '12px' }}
      >
        <div className="wp-block-group popup-inner-content">
          <InnerBlocks.Content />
        </div>
      </div>
    </div>
  );
}