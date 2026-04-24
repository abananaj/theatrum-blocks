wp.blocks.registerBlockType('chance/meta-button', {
  edit: (props) => {
    const { attributes, setAttributes, context } = props;
    const { TextControl, Spinner } = wp.components;
    const { useBlockProps, InspectorControls } = wp.blockEditor;
    const { Fragment, useState, useEffect } = wp.element;
    const { useSelect } = wp.data;

    const blockProps = useBlockProps();
    const [urlValue, setUrlValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Get current post ID from context (Query Loop) or editor
    const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
    const contextPostId = context?.postId;
    const postId = contextPostId || editorPostId;

    // Fetch the post meta value when key or postId changes
    useEffect(() => {
      if (!attributes.keyInput || !postId) {
        setUrlValue('');
        return;
      }

      setIsLoading(true);

      const url = `/chance/v1/meta-button/${postId}/${attributes.keyInput}`;

      wp.apiFetch({ path: url })
        .then((data) => {
          setUrlValue(data.value || '');
          setIsLoading(false);
        })
        .catch(() => {
          setUrlValue('');
          setIsLoading(false);
        });
    }, [attributes.keyInput, postId]);

    return wp.element.createElement(
      Fragment,
      null,
      wp.element.createElement(
        InspectorControls,
        null,
        wp.element.createElement(
          'div',
          { style: { padding: '16px' } },
          wp.element.createElement(TextControl, {
            label: 'URL Field Key',
            value: attributes.keyInput,
            onChange: (value) => setAttributes({ keyInput: value }),
            placeholder: 'e.g., video_link, registration_url',
            help: 'Enter the meta key that contains the URL'
          }),
          wp.element.createElement(TextControl, {
            label: 'Button Text',
            value: attributes.buttonText,
            onChange: (value) => setAttributes({ buttonText: value }),
            placeholder: 'Learn More',
            help: 'Text to display on the button'
          })
        )
      ),
      wp.element.createElement(
        'div',
        blockProps,
        isLoading && wp.element.createElement(Spinner, null),
        !isLoading && urlValue && wp.element.createElement(
          'a',
          {
            href: urlValue,
            className: ['wp-block-button__link', 'wp-element-button'],
            style: {
              // display: 'inline-block',
              // padding: '12px 24px',
              // backgroundColor: '#3858e9',
              // color: 'white',
              // textDecoration: 'none',
              // borderRadius: '4px',
              // cursor: 'pointer'
            }
          },
          attributes.buttonText || 'Learn More'
        ),
        !isLoading && !urlValue && wp.element.createElement(
          'p',
          { style: { color: '#999', fontStyle: 'italic' } },
          'No URL found for key: ' + (attributes.keyInput || '[not set]')
        )
      )
    );
  },
  save: () => {
    return null;
  }
});