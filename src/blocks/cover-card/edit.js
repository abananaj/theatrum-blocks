import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, CheckboxControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes, context }) {
  const blockProps = useBlockProps();
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get current post ID from context (Query Loop) or editor
  const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
  const contextPostId = context?.postId;
  const currentPostId = contextPostId || editorPostId;

  // Fetch post data when metaKey or postId changes
  useEffect(() => {
    if (!attributes.metaKey && !attributes.postId) {
      setPostData(null);
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');

    const url = `/chance/v1/cover-card/${attributes.metaKey || attributes.postId}?current_post_id=${currentPostId}`;

    apiFetch({ path: url })
      .then((data) => {
        if (data.post_id) {
          setPostData(data);
          setAttributes({ postId: data.post_id });
        } else {
          setPostData(null);
          setError(data.message || 'Post not found');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setPostData(null);
        setError('Error fetching post data');
        setIsLoading(false);
      });
  }, [attributes.metaKey, attributes.postId, currentPostId, setAttributes]);

  return (
    <Fragment>
      <InspectorControls>
        <div className="cover-card-inspector">
          <TextControl
            label="Meta Key (to look up post)"
            value={attributes.metaKey || ''}
            onChange={(value) => setAttributes({ metaKey: value })}
            placeholder="e.g., production_featured"
            help="Enter the post meta key that contains the post ID to display"
          />
          <TextControl
            label="Button Text"
            value={attributes.buttonText || ''}
            onChange={(value) => setAttributes({ buttonText: value })}
            placeholder="e.g., Learn More, Get Tickets"
            help="Optional button text (leave empty to hide button)"
          />
          <TextControl
            label="Button URL"
            value={attributes.buttonUrl || ''}
            onChange={(value) => setAttributes({ buttonUrl: value })}
            placeholder="https://example.com"
            help="Optional button URL"
          />
          <CheckboxControl
            label="Open button link in new window"
            checked={attributes.openInNewWindow || false}
            onChange={(value) => setAttributes({ openInNewWindow: value })}
          />
        </div>
      </InspectorControls>
      <div {...blockProps}>
        {isLoading && <Spinner />}
        {error && <p className="cover-card-error">Error: {error}</p>}
        {!isLoading && !error && postData && (
          <div className="wp-block-chance-cover-card-editor">
            <div
              className="cover-card"
              style={{
                backgroundImage: postData.featured_image
                  ? `url(${postData.featured_image})`
                  : 'linear-gradient(to right, #ccc, #ddd)'
              }}
            >
              <div className="user-content">
                <InnerBlocks placeholder="Add blocks for inner content..." />
              </div>
              <div className="bottom-bar">
                <a href="#" className="post-link">
                  <h3 className="title">{postData.title || '(No Title)'}</h3>
                </a>
                {attributes.buttonText && (
                  <a
                    href={attributes.buttonUrl || '#'}
                    target={attributes.openInNewWindow ? '_blank' : '_self'}
                    rel={attributes.openInNewWindow ? 'noopener noreferrer' : ''}
                    className="button"
                  >
                    {attributes.buttonText}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
        {!isLoading && !error && !postData && (
          <p className="cover-card-placeholder">
            Enter a meta key in the sidebar to display a post
          </p>
        )}
      </div>
    </Fragment>
  );
}
