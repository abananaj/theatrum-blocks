/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes, context }) {
  const blockProps = useBlockProps();
  const [embedData, setEmbedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get current post ID from context (Query Loop) or editor
  const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
  const editorPostType = useSelect((select) => select('core/editor').getCurrentPostType());
  const contextPostId = context?.postId;
  const postId = contextPostId || editorPostId;

  // Check if we're editing a template (post type starts with 'wp_template')
  const isEditingTemplate = editorPostType && editorPostType.startsWith('wp_template');

  // Fetch the embed data when key or postId changes
  useEffect(() => {
    if (!attributes.keyInput || !postId) {
      setEmbedData(null);
      return;
    }

    // In template editor, show placeholder
    if (isEditingTemplate && !contextPostId) {
      setEmbedData({ placeholder: true });
      return;
    }

    setIsLoading(true);

    const url = `/chance/v1/meta-embed/${postId}/${attributes.keyInput}`;

    apiFetch({ path: url })
      .then((data) => {
        setEmbedData(data.html ? data : null);
        setIsLoading(false);
      })
      .catch(() => {
        setEmbedData(null);
        setIsLoading(false);
      });
  }, [attributes.keyInput, postId, isEditingTemplate, contextPostId]);

  return (
    <Fragment>
      <InspectorControls>
        <div style={{ padding: '16px' }}>
          <TextControl
            label="Meta Key"
            value={attributes.keyInput || ''}
            onChange={(value) => setAttributes({ keyInput: value })}
            placeholder="e.g., video_url, external_link"
            help="Enter the meta key that contains the URL to embed"
          />
        </div>
      </InspectorControls>
      <div {...blockProps}>
        {isLoading && <Spinner />}
        {!isLoading && embedData?.placeholder && (
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}>
            [Template: Embedded resource will display on frontend]
          </div>
        )}
        {!isLoading && embedData?.html && (
          <div dangerouslySetInnerHTML={{ __html: embedData.html }} style={{ position: 'relative' }} />
        )}
        {!isLoading && !embedData && attributes.keyInput && (
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center', color: '#666' }}>
            No embed found for meta key: {attributes.keyInput}
          </div>
        )}
        {!attributes.keyInput && (
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center', color: '#999' }}>
            Enter a meta key to display an embedded resource
          </div>
        )}
      </div>
    </Fragment>
  );
}
