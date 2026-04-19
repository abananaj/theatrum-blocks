wp.blocks.registerBlockType('chance/meta-time', {
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

    // Fetch the post meta value when key, format, or postId changes
    useEffect(() => {
      if (!attributes.keyInput || !postId) {
        setDisplayValue('');
        return;
      }

      setIsLoading(true);

      // Use custom format if 'custom' is selected, otherwise use the selected preset format
      const format = attributes.timeFormat === 'custom'
        ? (attributes.customFormat || 'h:i A')
        : attributes.timeFormat;
      const encodedFormat = encodeURIComponent(format);
      const url = `/wp-json/chance/v1/meta-time/${postId}/${attributes.keyInput}/${encodedFormat}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setDisplayValue(data.value || '');
          setIsLoading(false);
        })
        .catch(() => {
          setDisplayValue('');
          setIsLoading(false);
        });
    }, [attributes.keyInput, attributes.timeFormat, attributes.customFormat, postId]);

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
            label: 'Time Field Key',
            value: attributes.keyInput,
            onChange: (value) => setAttributes({ keyInput: value }),
            placeholder: 'e.g., event_time, start_time',
            help: 'Enter the meta key that contains the time value'
          }),
          wp.element.createElement(SelectControl, {
            label: 'Display Format',
            value: attributes.timeFormat,
            onChange: (value) => setAttributes({ timeFormat: value }),
            options: [
              { label: '2:30 PM', value: 'g:i A' },
              { label: '02:30 PM', value: 'h:i A' },
              { label: '14:30', value: 'H:i' },
              { label: 'Custom', value: 'custom' }
            ]
          }),
          attributes.timeFormat === 'custom' && wp.element.createElement(TextControl, {
            label: 'Custom Format',
            value: attributes.customFormat,
            onChange: (value) => setAttributes({ customFormat: value }),
            placeholder: 'e.g., H:i or g:i A',
            help: wp.element.createElement(wp.element.Fragment, null,
              wp.element.createElement('div', null, 'G=Hour (24h format)'),
              wp.element.createElement('div', null, 'g=Hour (12h format)'),
              wp.element.createElement('div', null, 'i=Minutes (00-59)'),
              wp.element.createElement('div', null, 'a=am/pm'),
              wp.element.createElement('div', null, 'A=AM/PM')
            )
          }),
          wp.element.createElement(SelectControl, {
            label: 'HTML Tag',
            value: attributes.tagName,
            onChange: (value) => setAttributes({ tagName: value }),
            options: [
              { label: '<p>', value: 'p' },
              { label: '<span>', value: 'span' },
              { label: '<time>', value: 'time' },
              { label: '<h1>', value: 'h1' },
              { label: '<h2>', value: 'h2' },
              { label: '<h3>', value: 'h3' },
              { label: '<h4>', value: 'h4' },
              { label: '<h5>', value: 'h5' },
              { label: '<h6>', value: 'h6' }
            ]
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
              const className = 'wp-block-chance-meta-time';

              return wp.element.createElement(
                Tag,
                { className, style: { margin: 0, padding: '8px 0', wordBreak: 'break-word' } },
                displayValue || `[${attributes.keyInput}]`
              );
            })()
            : wp.element.createElement('em', { style: { color: '#999' } }, 'Enter a time field key to display its value')
      )
    );
  },
  save: () => null
});