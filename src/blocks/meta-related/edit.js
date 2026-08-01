import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect, createElement } from '@wordpress/element';
import { TextControl, SelectControl, ToggleControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

export default function Edit({ attributes, setAttributes, context }) {
  const blockProps = useBlockProps({ style: { background: 'transparent', padding: 0 } });
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get post ID from Query Loop context or current editor post
  const editorPostId = useSelect((select) => select('core/editor')?.getCurrentPostId?.() ?? 0);
  const contextPostId = context?.postId;
  const postId = contextPostId || editorPostId;

  useEffect(() => {
    if (!attributes.keyInput || !postId) {
      setRelatedPosts([]);
      return;
    }

    setIsLoading(true);

    apiFetch({ path: `/theatrum/v1/meta-related/${postId}/${attributes.keyInput}` })
      .then((data) => {
        // Prefer the list; fall back to the single-post shape for older payloads.
        const posts = Array.isArray(data.posts) && data.posts.length
          ? data.posts
          : (data.title ? [{ title: data.title, url: data.url }] : []);
        setRelatedPosts(posts);
        setIsLoading(false);
      })
      .catch(() => {
        setRelatedPosts([]);
        setIsLoading(false);
      });
  }, [attributes.keyInput, postId]);

  const Tag = attributes.tagName || 'p';
  const separator = attributes.separator ?? ', ';

  const renderLink = (post, index) => {
    const text = post.title;
    if (attributes.linkToPost && post.url) {
      return createElement('a', { key: index, href: post.url, target: '_blank', rel: 'noreferrer' }, text);
    }
    return text;
  };

  const renderDisplay = () => {
    if (!relatedPosts.length) {
      const placeholder = attributes.keyInput
        ? `[${attributes.keyInput}]`
        : 'Enter a meta key to display a related post';
      return createElement(Tag, { style: { margin: 0 } }, placeholder);
    }

    // Interleave links with the separator: prepend, link, sep, link, …, append.
    const children = [attributes.prepend || ''];
    relatedPosts.forEach((post, index) => {
      if (index > 0) {
        children.push(separator);
      }
      children.push(renderLink(post, index));
    });
    children.push(attributes.append || '');

    return createElement(Tag, { style: { margin: 0 } }, children);
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
          <TextControl
            label="Separator"
            value={attributes.separator}
            onChange={(value) => setAttributes({ separator: value })}
            placeholder="e.g., ', '"
            help="Text placed between each linked post when the meta holds multiple IDs"
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
