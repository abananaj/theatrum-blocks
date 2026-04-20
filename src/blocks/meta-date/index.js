wp.blocks.registerBlockType('chance/meta-date', {
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
    const editorPostType = useSelect((select) => select('core/editor').getCurrentPostType());
    const contextPostId = context?.postId;
    const postId = contextPostId || editorPostId;

    // Check if we're editing a template (post type starts with 'wp_template')
    const isEditingTemplate = editorPostType && editorPostType.startsWith('wp_template');

    // Fetch the post meta value when key, format, or postId changes
    useEffect(() => {
      if (!attributes.keyInput || !postId) {
        setDisplayValue('');
        return;
      }

      // In template editor, show placeholder
      if (isEditingTemplate && !contextPostId) {
        setDisplayValue('[Template: Meta field will display on frontend]');
        return;
      }

      setIsLoading(true);

      // Use custom format if 'custom' is selected, otherwise use the selected preset format
      const format = attributes.dateFormat === 'custom'
        ? (attributes.customFormat || 'Y-m-d')
        : attributes.dateFormat;
      const encodedFormat = encodeURIComponent(format);
      const url = `/chance/v1/meta-date/${postId}/${attributes.keyInput}/${encodedFormat}`;

      wp.apiFetch({ path: url })
        .then((data) => {
          setDisplayValue(data.value || '');
          setIsLoading(false);
        })
        .catch(() => {
          setDisplayValue('');
          setIsLoading(false);
        });
    }, [attributes.keyInput, attributes.dateFormat, attributes.customFormat, postId, isEditingTemplate, contextPostId]);

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
            label: 'Date Field Key',
            value: attributes.keyInput,
            onChange: (value) => setAttributes({ keyInput: value }),
            placeholder: 'e.g., event_date, publication_date',
            help: 'Enter the meta key that contains the date value'
          }),
          wp.element.createElement(SelectControl, {
            label: 'Display Format',
            value: attributes.dateFormat,
            onChange: (value) => setAttributes({ dateFormat: value }),
            options: [
              { label: 'Jan 1st', value: 'M jS' },
              { label: 'January 1', value: 'F j' },
              { label: '01-01-2026', value: 'm-d-Y' },
              { label: '1-1-2026', value: 'n-j-Y' },
              { label: 'Sunday, January 1', value: 'l, F j' },
              { label: 'Custom', value: 'custom' }
            ]
          }),
          attributes.dateFormat === 'custom' && wp.element.createElement(TextControl, {
            label: 'Custom Format',
            value: attributes.customFormat,
            onChange: (value) => setAttributes({ customFormat: value }),
            placeholder: 'e.g., M j, Y',
            help: wp.element.createElement(wp.element.Fragment, null,
              wp.element.createElement('div', null, 'Y=year'),
              wp.element.createElement('div', null, 'F=Month name (full)'),
              wp.element.createElement('div', null, 'M=Month name (short)'),
              wp.element.createElement('div', null, 'm=Month ##'),
              wp.element.createElement('div', null, 'n=Month # (no leading zero)'),
              wp.element.createElement('div', null, 'd=Day #'),
              wp.element.createElement('div', null, 'j=Day # (no leading zero)'),
              wp.element.createElement('div', null, 'l=Day of week (full)'),
              wp.element.createElement('div', null, 'D=Day of week (short)'),
              wp.element.createElement('div', null, 'a=am/pm'),
              wp.element.createElement('div', null, 'A=AM/PM'),
              wp.element.createElement('div', null, 'S=Ordinal suffix (eg. st, nd, rd, th)')
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
              const className = 'wp-block-chance-meta-date';

              return wp.element.createElement(
                Tag,
                { className, style: { margin: 0, padding: '8px 0', wordBreak: 'break-word' } },
                displayValue || `[${attributes.keyInput}]`
              );
            })()
            : wp.element.createElement('em', { style: { color: '#999' } }, 'Enter a date field key to display its value')
      )
    );
  },
  save: () => null
});