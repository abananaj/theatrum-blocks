(function () {
  if (typeof wp === 'undefined' || !wp.blocks || !wp.blockEditor || !wp.element || !wp.components || !wp.data) {
    console.warn('WordPress block dependencies not available');
    return;
  }

  wp.blocks.registerBlockType('chance/board-member', {
    edit: (props) => {
      const { attributes, setAttributes } = props;
      const { TextControl, SelectControl, Spinner } = wp.components;
      const { useBlockProps, InspectorControls } = wp.blockEditor;
      const { Fragment, useState, useEffect } = wp.element;

      const blockProps = useBlockProps({ style: { background: 'transparent', padding: 0 } });
      const [displayValue, setDisplayValue] = useState('');
      const [displayItems, setDisplayItems] = useState([]);
      const [isLoading, setIsLoading] = useState(false);

      // Fetch the option value when optionName changes
      useEffect(() => {
        if (!attributes.optionName) {
          setDisplayValue('');
          setDisplayItems([]);
          return;
        }

        setIsLoading(true);

        // Fetch option using custom REST endpoint
        wp.apiFetch({ path: `/chance/v1/board-member/${attributes.optionName}` })
          .then((data) => {
            setDisplayValue(data.value || '');
            setDisplayItems(data.items || []);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching board member:', error);
            setDisplayValue('');
            setDisplayItems([]);
            setIsLoading(false);
          });
      }, [attributes.optionName]);

      // Render items with full formatting (matching frontend)
      const renderItems = () => {
        if (displayItems.length === 0) {
          return null;
        }

        return wp.element.createElement(
          'div',
          { style: { marginTop: '8px' } },
          displayItems.map((item, index) =>
            wp.element.createElement(
              'p',
              { key: index, style: { margin: '8px 0' } },
              item.url
                ? wp.element.createElement(
                  'a',
                  { href: item.url, target: '_blank', rel: 'noreferrer' },
                  wp.element.createElement('strong', null, item.title)
                )
                : wp.element.createElement('strong', null, item.title),
              item.position !== 'Board Members'
                ? wp.element.createElement('span', null, ', ' + item.position)
                : null,
              item.meta_title
                ? wp.element.createElement(
                  'br',
                  null
                )
                : null,
              item.meta_title
                ? wp.element.createElement('em', null, item.meta_title)
                : null
            )
          )
        );
      };

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
              placeholder: 'e.g., option_board_members',
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
            : displayItems.length > 0
              ? renderItems()
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

})();