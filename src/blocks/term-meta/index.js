wp.blocks.registerBlockType('chance/term-meta', {
  edit: (props) => {
    const { attributes, setAttributes } = props;
    const { TextControl, Spinner } = wp.components;
    const { useBlockProps, InspectorControls } = wp.blockEditor;
    const { Fragment, useState, useEffect } = wp.element;

    const blockProps = useBlockProps();
    const [metaValue, setMetaValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch the term meta value when term id or meta key changes
    useEffect(() => {
      if (!attributes.termId || !attributes.metaKey) {
        setMetaValue('');
        return;
      }

      setIsLoading(true);

      const url = `/chance/v1/term-meta-field/${attributes.termId}/${attributes.metaKey}`;

      wp.apiFetch({ path: url })
        .then((data) => {
          setMetaValue(data.value || '');
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching term meta:', error);
          setMetaValue('');
          setIsLoading(false);
        });
    }, [attributes.termId, attributes.metaKey]);

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
            label: 'Term ID',
            type: 'number',
            value: attributes.termId,
            onChange: (value) => setAttributes({ termId: value ? parseInt(value) : 0 }),
            placeholder: 'e.g., 5',
            help: 'Enter the ID of the taxonomy term'
          }),
          wp.element.createElement(TextControl, {
            label: 'Meta Key',
            value: attributes.metaKey,
            onChange: (value) => setAttributes({ metaKey: value }),
            placeholder: 'e.g., description, color, icon',
            help: 'Enter the meta key to display'
          })
        )
      ),
      wp.element.createElement(
        'div',
        blockProps,
        isLoading && wp.element.createElement(Spinner, null),
        !isLoading && metaValue && wp.element.createElement(
          'p',
          { style: { margin: 0, padding: '8px 0' } },
          metaValue
        ),
        !isLoading && !metaValue && wp.element.createElement(
          'p',
          { style: { color: '#999', fontStyle: 'italic', margin: 0 } },
          attributes.termId && attributes.metaKey
            ? `[${attributes.metaKey}]`
            : 'Enter a term ID and meta key'
        )
      )
    );
  },
  save: () => {
    return null;
  }
});