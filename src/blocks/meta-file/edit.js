import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, ToggleControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes, context }) {
  const blockProps = useBlockProps();
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
  const contextPostId = context?.postId;
  const postId = contextPostId || editorPostId;

  useEffect(() => {
    if (!attributes.keyInput || !postId) {
      setFileData(null);
      return;
    }

    setIsLoading(true);

    apiFetch({ path: `/theatrum/v1/meta-file/${postId}/${attributes.keyInput}` })
      .then((data) => {
        setFileData(data.url ? data : null);
        setIsLoading(false);
      })
      .catch(() => {
        setFileData(null);
        setIsLoading(false);
      });
  }, [attributes.keyInput, postId]);

  return (
    <Fragment>
      <InspectorControls>
        <div style={{ padding: '16px' }}>
          <TextControl
            label="Meta Key"
            value={attributes.keyInput || ''}
            onChange={(value) => setAttributes({ keyInput: value })}
            placeholder="e.g., document, pdf_file"
            help="Enter the ACF/meta key for the file field"
            __nextHasNoMarginBottom
            __next40pxDefaultSize
          />
          <TextControl
            label="Link Text"
            value={attributes.linkText || 'Open File'}
            onChange={(value) => setAttributes({ linkText: value })}
            placeholder="Open File"
            help="The text to display for the link"
            __nextHasNoMarginBottom
            __next40pxDefaultSize
          />
          <TextControl
            label="Fallback Text"
            value={attributes.fallbackText || ''}
            onChange={(value) => setAttributes({ fallbackText: value })}
            placeholder="Optional text if no file is found"
            help="Leave empty to hide the block when no file is found"
            __nextHasNoMarginBottom
            __next40pxDefaultSize
          />
          <ToggleControl
            label="Open in new tab"
            checked={attributes.openInNewTab !== false}
            onChange={(value) => setAttributes({ openInNewTab: value })}
            __nextHasNoMarginBottom
          />
          <ToggleControl
            label="Show file icon"
            checked={attributes.showIcon !== false}
            onChange={(value) => setAttributes({ showIcon: value })}
            __nextHasNoMarginBottom
          />
        </div>
      </InspectorControls>
      <div {...blockProps}>
        {isLoading && <Spinner />}
        {!isLoading && fileData && (
          <a
            href={fileData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="wp-block-theatrum-meta-file-link"
            onClick={(event) => event.preventDefault()}
          >
            {attributes.showIcon && (
              <span
                className="dashicons dashicons-media-document"
                style={{
                  marginRight: '0.5em',
                  verticalAlign: 'middle',
                  fontSize: '1em',
                  width: '1em',
                  height: '1em'
                }}
              />
            )}
            {attributes.linkText || 'Open File'}
          </a>
        )}
        {!isLoading && !fileData && attributes.keyInput && attributes.fallbackText && (
          <div style={{ color: '#666' }}>
            {attributes.fallbackText}
          </div>
        )}
        {!isLoading && !fileData && attributes.keyInput && !attributes.fallbackText && (
          <div>
            {`[${attributes.keyInput}]`}
          </div>
        )}
        {!isLoading && !fileData && !attributes.keyInput && (
          <div style={{ color: '#999', fontStyle: 'italic' }}>
            Enter a meta key to display a file link
          </div>
        )}
      </div>
    </Fragment>
  );
}
