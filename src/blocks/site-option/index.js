wp.blocks.registerBlockType('chance/site-option', {
  edit: (props) => {
    const { attributes, setAttributes } = props;
    const { TextControl, SelectControl, Spinner } = wp.components;
    const { useBlockProps, InspectorControls } = wp.blockEditor;
    const { Fragment, useState, useEffect } = wp.element;

    const blockProps = useBlockProps();
    const [displayValue, setDisplayValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch the option value when optionName changes
    useEffect(() => {
      if (!attributes.optionName) {
        setDisplayValue('');
        return;
      }

      setIsLoading(true);

      // Fetch option using custom REST endpoint
      wp.apiFetch({ path: `/chance/v1/site-option/${attributes.optionName}` })
        .then((data) => {
          setDisplayValue(data.value || '');
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching site option:', error);
          setDisplayValue('');
          setIsLoading(false);
        });
    }, [attributes.optionName]);

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
            label: 'Option Name',
            value: attributes.optionName,
            onChange: (value) => setAttributes({ optionName: value }),
            placeholder: 'e.g., siteurl, home, blogname',
            help: 'Enter the WordPress option key to retrieve from wp_options table'
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
          : attributes.tagName === 'a'
            ? wp.element.createElement(
              'a',
              { href: attributes.href || '#' },
              displayValue || (attributes.optionName ? '' : 'Enter an option name to display its value')
            )
            : wp.element.createElement(
              attributes.tagName,
              null,
              displayValue || (attributes.optionName ? '' : 'Enter an option name to display its value')
            )
      )
    );
  },
  save: () => null
});