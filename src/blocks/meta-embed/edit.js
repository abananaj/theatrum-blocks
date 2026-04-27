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

/**
 * Extract a YouTube video ID from any standard YouTube URL.
 * Handles: watch?v=, youtu.be/, /embed/, /shorts/
 */
function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function Edit({ attributes, setAttributes, context }) {
  const { keyInput, embedType } = attributes;
  const isYouTube = embedType === 'youtube';

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
    if (!keyInput || !postId) {
      setEmbedData(null);
      return;
    }

    // In template editor, show placeholder
    if (isEditingTemplate && !contextPostId) {
      setEmbedData({ placeholder: true });
      return;
    }

    setIsLoading(true);

    const url = `/chance/v1/meta-embed/${postId}/${keyInput}`;

    apiFetch({ path: url })
      .then((data) => {
        setEmbedData(data.html ? data : null);
        setIsLoading(false);
      })
      .catch(() => {
        setEmbedData(null);
        setIsLoading(false);
      });
  }, [keyInput, postId, isEditingTemplate, contextPostId]);

  // For YouTube: try to parse a video ID out of the oEmbed HTML src
  const youTubeId = isYouTube && embedData?.html
    ? (embedData.html.match(/embed\/([A-Za-z0-9_-]{11})/) || [])[1] || null
    : null;

  const metaKeyLabel = isYouTube ? 'YouTube URL Meta Key' : 'Meta Key';
  const metaKeyHelp = isYouTube
    ? 'Enter the meta key whose value is a YouTube URL (e.g. trailer_url)'
    : 'Enter the meta key that contains the URL to embed';

  return (
    <Fragment>
      <InspectorControls>
        <div style={{ padding: '16px' }}>
          <TextControl
            label={metaKeyLabel}
            value={keyInput || ''}
            onChange={(value) => setAttributes({ keyInput: value })}
            placeholder="e.g., trailer_url"
            help={metaKeyHelp}
          />
        </div>
      </InspectorControls>
      <div {...blockProps}>
        {isLoading && <Spinner />}
        {!isLoading && embedData?.placeholder && (
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}>
            {isYouTube
              ? '[Template: YouTube video will display on frontend]'
              : '[Template: Embedded resource will display on frontend]'}
          </div>
        )}
        {/* YouTube variation: render nocookie iframe preview */}
        {!isLoading && isYouTube && youTubeId && (
          <div style={{ position: 'relative', aspectRatio: '16/9' }}>
            <iframe
              style={{ width: '100%', height: '100%', border: 0 }}
              src={`https://www.youtube-nocookie.com/embed/${youTubeId}`}
              title="YouTube video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        {/* Generic variation: render oEmbed HTML */}
        {!isLoading && !isYouTube && embedData?.html && (
          <div dangerouslySetInnerHTML={{ __html: embedData.html }} style={{ position: 'relative' }} />
        )}
        {!isLoading && !embedData && keyInput && (
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center', color: '#666' }}>
            {isYouTube
              ? `No YouTube URL found for meta key: ${keyInput}`
              : `No embed found for meta key: ${keyInput}`}
          </div>
        )}
        {!keyInput && (
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center', color: '#999' }}>
            {isYouTube
              ? 'Enter the meta key that holds the YouTube URL'
              : 'Enter a meta key to display an embedded resource'}
          </div>
        )}
      </div>
    </Fragment>
  );
}
