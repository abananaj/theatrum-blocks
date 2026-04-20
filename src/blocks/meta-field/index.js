wp.blocks.registerBlockType('chance/meta-field', {
  edit: (props) => {
    const { attributes, setAttributes, context } = props;
    const { TextControl, SelectControl, Spinner } = wp.components;
    const { useBlockProps, InspectorControls } = wp.blockEditor;
    const { Fragment, useState, useEffect } = wp.element;
    const { useSelect } = wp.data;

    const blockProps = useBlockProps();
    const [displayValue, setDisplayValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Get current post ID from context (Query Loop) or editor
    const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
    const contextPostId = context?.postId;
    const postId = contextPostId || editorPostId;

    // Fetch the post meta value when key or postId changes
    useEffect(() => {
      if (!attributes.keyInput || !postId) {
        setDisplayValue('');
        return;
      }

      setIsLoading(true);

      const url = `/chance/v1/post-meta/${postId}/${attributes.keyInput}`;

      wp.apiFetch({ path: url })
        .then((data) => {
          setDisplayValue(data.value || '');
          setIsLoading(false);
        })
        .catch(() => {
          setDisplayValue('');
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
            label: 'Key',
            value: attributes.keyInput,
            onChange: (value) => setAttributes({ keyInput: value }),
            placeholder: 'e.g., page_title, description, custom_field',
            help: 'Enter the key to retrieve the corresponding value'
          }),
          wp.element.createElement(TextControl, {
            label: 'Prepend',
            value: attributes.prepend,
            onChange: (value) => setAttributes({ prepend: value }),
            placeholder: 'Text to prepend',
            help: 'Optional plain text to add before the value'
          }),
          wp.element.createElement(TextControl, {
            label: 'Append',
            value: attributes.append,
            onChange: (value) => setAttributes({ append: value }),
            placeholder: 'Text to append',
            help: 'Optional plain text to add after the value'
          }),
          wp.element.createElement(SelectControl, {
            label: 'HTML Tag',
            value: attributes.tagName,
            onChange: (value) => setAttributes({ tagName: value }),
            options: [
              { label: '<p>', value: 'p' },
              { label: '<span>', value: 'span' },
              { label: '<a>', value: 'a' },
              { label: '<h1>', value: 'h1' },
              { label: '<h2>', value: 'h2' },
              { label: '<h3>', value: 'h3' },
              { label: '<h4>', value: 'h4' },
              { label: '<h5>', value: 'h5' },
              { label: '<h6>', value: 'h6' }
            ]
          }),
          attributes.tagName === 'a' && wp.element.createElement(TextControl, {
            label: 'Link URL',
            value: attributes.href,
            onChange: (value) => setAttributes({ href: value }),
            placeholder: 'https://example.com',
            help: 'Enter the URL for the link'
          })
        )
      ),
      wp.element.createElement(
        'div',
        blockProps,
        isLoading
          ? wp.element.createElement(Spinner, null)
          : attributes.keyInput
            ? (() => {
              const Tag = attributes.tagName || 'p';
              const className = 'wp-block-chance-post-meta-field';

              if (Tag === 'a' && attributes.href) {
                const displayText = (displayValue || `[${attributes.keyInput}]`);
                const prependText = attributes.prepend || '';
                const appendText = attributes.append || '';
                const finalText = `${prependText}${displayText}${appendText}`;

                return wp.element.createElement(
                  'a',
                  { href: attributes.href, className, style: { wordBreak: 'break-word' } },
                  finalText
                );
              }

              const displayText = (displayValue || `[${attributes.keyInput}]`);
              const prependText = attributes.prepend || '';
              const appendText = attributes.append || '';
              const finalText = `${prependText}${displayText}${appendText}`;

              return wp.element.createElement(
                Tag,
                { className, style: { margin: 0, padding: '8px 0', wordBreak: 'break-word' } },
                finalText
              );
            })()
            : wp.element.createElement('em', { style: { color: '#999' } }, 'Enter a key to display its value')
      )
    );
  },
  save: () => null
});
