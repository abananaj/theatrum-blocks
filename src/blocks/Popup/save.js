import { InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const { buttonText, popupTitle } = attributes;
  const title = popupTitle || buttonText;

  return (
    <div className="wp-block-chance-popup">
      <button
        className="popup-toggle-button"
        data-popup-toggle="true"
        aria-expanded="false"
        aria-haspopup="dialog"
        type="button"
      >
        {buttonText}
      </button>

      <div
        className="popup-backdrop"
        data-popup-backdrop="true"
        aria-hidden="true"
        hidden
      />

      <div
        className="popup-dialog"
        data-popup-content="true"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        hidden
      >
        <div className="popup-dialog-header">
          <h2 className="popup-dialog-title">{title}</h2>
          <button
            className="popup-close-button"
            data-close-popup="true"
            aria-label="Close dialog"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="popup-dialog-content">
          <InnerBlocks.Content />
        </div>
      </div>
    </div>
  );
}