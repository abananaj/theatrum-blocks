import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect, createElement } from '@wordpress/element';
import { TextControl, SelectControl, ToggleControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

export default function Edit({ attributes, setAttributes, context }) {
  const blockProps = useBlockProps({ style: { background: 'transparent', padding: 0 } });
  const [relatedPost, setRelatedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get post ID from Query Loop context or current editor post
  const editorPostId = useSelect((select) => select('core/editor')?.getCurrentPostId?.() ?? 0);
  const contextPostId = context?.postId;
  const postId = contextPostId || editorPostId;

  useEffect(() => {
    if (!attributes.keyInput || !postId) {
      setRelatedPost(null);
      return;
    }

    setIsLoading(true);

    apiFetch({ path: `/chance/v1/meta-related/${postId}/${attributes.keyInput}` })
      .then((data) => {
        setRelatedPost(data.title ? data : null);
        setIsLoading(false);
      })
      .catch(() => {
        setRelatedPost(null);
        setIsLoading(false);
      });
  }, [attributes.keyInput, postId]);

  const Tag = attributes.tagName || 'p';

  const renderDisplay = () => {
    const title = relatedPost
      ? (attributes.prepend || '') + relatedPost.title + (attributes.append || '')
      : (attributes.keyInput ? `[${attributes.keyInput}]` : 'Enter a meta key to display a related post');

    const titleEl = createElement(Tag, { style: { margin: 0 } }, title);

    if (relatedPost && attributes.linkToPost && relatedPost.url) {
      return createElement('a', { href: relatedPost.url, target: '_blank', rel: 'noreferrer' }, titleEl);
    }

    return titleEl;
  };

  return (
    <Fragment>
      <InspectorControls>
        <div style={{ padding: '16px' }}>
          <TextControl
            label="Meta Key"
            value={attributes.keyInput}
            onChange={(value) => setAttributes({ keyInput: value })}
            placeholder="e.g., related_production, venue_id"
            help="Enter the meta key that contains a post ID or Post Object"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
          />
          <SelectControl
            label="HTML Tag"
            value={attributes.tagName}
            onChange={(value) => setAttributes({ tagName: value })}
            options={[
              { label: '<p>', value: 'p' },
              { label: '<span>', value: 'span' },
              { label: '<h1>', value: 'h1' },
              { label: '<h2>', value: 'h2' },
              { label: '<h3>', value: 'h3' },
              { label: '<h4>', value: 'h4' },
              { label: '<h5>', value: 'h5' },
              { label: '<h6>', value: 'h6' },
            ]}
          />
          <ToggleControl
            label="Link to post"
            checked={attributes.linkToPost}
            onChange={(value) => setAttributes({ linkToPost: value })}
            help="Wrap the title in a link to the related post"
            __nextHasNoMarginBottom 
          />
          <TextControl
            label="Prepend text"
            value={attributes.prepend}
            onChange={(value) => setAttributes({ prepend: value })}
            placeholder="e.g., Venue: "
						__nextHasNoMarginBottom
						__next40pxDefaultSize
          />
          <TextControl
            label="Append text"
            value={attributes.append}
            onChange={(value) => setAttributes({ append: value })}
            placeholder="e.g., ."
						__nextHasNoMarginBottom
						__next40pxDefaultSize
          />
        </div>
      </InspectorControls>
      <div {...blockProps}>
        {isLoading ? <Spinner /> : renderDisplay()}
      </div>
    </Fragment>
  );
}
