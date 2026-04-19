wp.blocks.registerBlockType('chance/cover-card', {
  edit: (props) => {
    const { attributes, setAttributes, context, children } = props;
    const { TextControl, CheckboxControl, Spinner } = wp.components;
    const { useBlockProps, InspectorControls, InnerBlocks } = wp.blockEditor;
    const { Fragment, useState, useEffect } = wp.element;
    const { useSelect } = wp.data;

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

      const url = `/wp-json/chance/v1/cover-card/${attributes.metaKey || attributes.postId}?current_post_id=${currentPostId}`;

      fetch(url)
        .then((response) => response.json())
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
    }, [attributes.metaKey, attributes.postId, currentPostId]);

    return wp.element.createElement(
      Fragment,
      null,
      wp.element.createElement(
        InspectorControls,
        null,
        wp.element.createElement(
          'div',
          { className: 'cover-card-inspector' },
          wp.element.createElement(TextControl, {
            label: 'Meta Key (to look up post)',
            value: attributes.metaKey,
            onChange: (value) => setAttributes({ metaKey: value }),
            placeholder: 'e.g., production_featured',
            help: 'Enter the post meta key that contains the post ID to display'
          }),
          wp.element.createElement(TextControl, {
            label: 'Button Text',
            value: attributes.buttonText,
            onChange: (value) => setAttributes({ buttonText: value }),
            placeholder: 'e.g., Learn More, Get Tickets',
            help: 'Optional button text (leave empty to hide button)'
          }),
          wp.element.createElement(TextControl, {
            label: 'Button URL',
            value: attributes.buttonUrl,
            onChange: (value) => setAttributes({ buttonUrl: value }),
            placeholder: 'https://example.com',
            help: 'Optional button URL'
          }),
          wp.element.createElement(CheckboxControl, {
            label: 'Open button link in new window',
            checked: attributes.openInNewWindow,
            onChange: (value) => setAttributes({ openInNewWindow: value })
          })
        )
      ),
      wp.element.createElement(
        'div',
        blockProps,
        isLoading && wp.element.createElement(Spinner, null),
        error && wp.element.createElement(
          'p',
          { className: 'cover-card-error' },
          'Error: ' + error
        ),
        !isLoading && !error && postData && wp.element.createElement(
          'div',
          { className: 'wp-block-chance-cover-card-editor' },
          wp.element.createElement(
            'div',
            {
              className: 'cover-card',
              style: {
                backgroundImage: postData.featured_image ? `url(${postData.featured_image})` : 'linear-gradient(to right, #ccc, #ddd)'
              }
            },
            wp.element.createElement(
              'div',
              { className: 'user-content' },
              wp.element.createElement(InnerBlocks, {
                placeholder: 'Add blocks for inner content...'
              })
            ),
            wp.element.createElement(
              'div',
              { className: 'bottom-bar' },
              wp.element.createElement(
                'a',
                { className: 'post-link' },
                wp.element.createElement('h3', { className: 'title' }, postData.title || '(No Title)')
              ),
              attributes.buttonText && wp.element.createElement(
                'a',
                {
                  href: attributes.buttonUrl || '#',
                  target: attributes.openInNewWindow ? '_blank' : '_self',
                  rel: attributes.openInNewWindow ? 'noopener noreferrer' : '',
                  className: 'button'
                },
                attributes.buttonText
              )
            )
          )
        ),
        !isLoading && !error && !postData && wp.element.createElement(
          'p',
          { className: 'cover-card-placeholder' },
          'Enter a meta key in the sidebar to display a post'
        )
      )
    );
  },
  save: () => {
    return wp.element.createElement(wp.blockEditor.InnerBlocks.Content, null);
  }
});
