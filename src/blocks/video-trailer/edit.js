import { useBlockProps, InspectorControls, BlockControls, RichText } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import {
  TextControl,
  Spinner,
  PanelBody,
  ToolbarGroup,
  ToolbarButton,
  SelectControl,
} from '@wordpress/components';
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

const ASPECT_RATIO_OPTIONS = [
  { label: '16:9', value: '16-9' },
  { label: '4:3', value: '4-3' },
  { label: '1:1', value: '1-1' },
  { label: '9:16', value: '9-16' },
  { label: '21:9', value: '21-9' },
];

export default function Edit({ attributes, setAttributes, context }) {
  const { metaKey, aspectRatio, caption, allowResponsive } = attributes;

  const blockProps = useBlockProps({
    className: [
      'wp-block-embed',
      'is-type-video',
      'is-provider-youtube',
      'wp-block-embed-youtube',
      allowResponsive ? `wp-embed-aspect-${aspectRatio} wp-has-aspect-ratio` : '',
    ]
      .filter(Boolean)
      .join(' '),
  });

  const [youTubeUrl, setYouTubeUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get current post ID from context (Query Loop) or editor
  const editorPostId = useSelect((select) =>
    select('core/editor').getCurrentPostId()
  );
  const editorPostType = useSelect((select) =>
    select('core/editor').getCurrentPostType()
  );
  const contextPostId = context?.postId;
  const postId = contextPostId || editorPostId;
  const isEditingTemplate =
    editorPostType && editorPostType.startsWith('wp_template');

  // Fetch the raw URL from post meta when metaKey or postId changes
  useEffect(() => {
    if (!metaKey || !postId) {
      setYouTubeUrl(null);
      return;
    }

    if (isEditingTemplate && !contextPostId) {
      setYouTubeUrl('__template__');
      return;
    }

    setIsLoading(true);

    apiFetch({ path: `/chance/v1/post-meta/${postId}/${metaKey}` })
      .then((data) => {
        setYouTubeUrl(data.value || null);
        setIsLoading(false);
      })
      .catch(() => {
        setYouTubeUrl(null);
        setIsLoading(false);
      });
  }, [metaKey, postId, isEditingTemplate, contextPostId]);

  const videoId = youTubeUrl !== '__template__' ? getYouTubeId(youTubeUrl) : null;
  const isTemplate = youTubeUrl === '__template__';

  const aspectStyle = allowResponsive
    ? { aspectRatio: aspectRatio.replace('-', '/') }
    : {};

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title="Video Trailer Settings">
          <TextControl
            label="YouTube URL Meta Key"
            value={metaKey || ''}
            onChange={(value) => setAttributes({ metaKey: value })}
            placeholder="e.g., video-trailer-url"
            help="Enter the meta key whose value is a YouTube URL."
            __nextHasNoMarginBottom
            __next40pxDefaultSize
          />
          <SelectControl
            label="Aspect Ratio"
            value={aspectRatio}
            options={ASPECT_RATIO_OPTIONS}
            onChange={(value) => setAttributes({ aspectRatio: value })}
            __nextHasNoMarginBottom
            __next40pxDefaultSize
          />
        </PanelBody>
      </InspectorControls>

      <BlockControls>
        <ToolbarGroup>
          {ASPECT_RATIO_OPTIONS.map((option) => (
            <ToolbarButton
              key={option.value}
              isActive={aspectRatio === option.value}
              onClick={() => setAttributes({ aspectRatio: option.value })}
            >
              {option.label}
            </ToolbarButton>
          ))}
        </ToolbarGroup>
      </BlockControls>

      <figure {...blockProps}>
        <div className="wp-block-embed__wrapper" style={aspectStyle}>
          {isLoading && <Spinner />}

          {!isLoading && isTemplate && (
            <div className="video-trailer-placeholder video-trailer-placeholder--template">
              [Template: YouTube video will display here on the frontend]
            </div>
          )}

          {!isLoading && !isTemplate && videoId && (
            <iframe
              style={{ width: '100%', height: '100%', border: 0 }}
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title="YouTube video trailer preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {!isLoading && !isTemplate && !videoId && metaKey && (
            <div className="video-trailer-placeholder video-trailer-placeholder--empty">
              {youTubeUrl
                ? `URL found for "${metaKey}" is not a valid YouTube URL`
                : `No YouTube URL found for meta key: ${metaKey}`}
            </div>
          )}

          {!metaKey && (
            <div className="video-trailer-placeholder video-trailer-placeholder--no-key">
              Enter the meta key that holds the YouTube trailer URL
            </div>
          )}
        </div>

        {(!RichText.isEmpty(caption) || videoId) && (
          <RichText
            tagName="figcaption"
            className="wp-element-caption"
            placeholder="Write caption…"
            value={caption}
            onChange={(value) => setAttributes({ caption: value })}
          />
        )}
      </figure>
    </Fragment>
  );
}
