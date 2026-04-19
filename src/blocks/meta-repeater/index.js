wp.blocks.registerBlockType('chance/meta-repeater', {
  edit: (props) => {
    const { attributes, setAttributes, context } = props;
    const { TextControl, SelectControl, Spinner } = wp.components;
    const { useBlockProps, InspectorControls } = wp.blockEditor;
    const { Fragment, useState, useEffect } = wp.element;
    const { useSelect } = wp.data;

    const blockProps = useBlockProps();
    const [rowCount, setRowCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Get current post ID from context (Query Loop) or editor
    const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
    const contextPostId = context?.postId;
    const postId = contextPostId || editorPostId;

    // Fetch the repeater row count when repeater key or postId changes
    useEffect(() => {
      if (!attributes.repeaterKey || !postId) {
        setRowCount(0);
        return;
      }

      setIsLoading(true);

      const url = `/wp-json/chance/v1/meta-repeater/${postId}/${attributes.repeaterKey}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setRowCount(data.rows || 0);
          setIsLoading(false);
        })
        .catch(() => {
          setRowCount(0);
          setIsLoading(false);
        });
    }, [attributes.repeaterKey, postId]);

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
            label: 'Repeater Field Key',
            value: attributes.repeaterKey,
            onChange: (value) => setAttributes({ repeaterKey: value }),
            placeholder: 'e.g., team_members, gallery_items',
            help: 'Enter the ACF repeater field key'
          }),
          wp.element.createElement(TextControl, {
            label: 'Subfield Keys (comma-separated)',
            value: attributes.subfields,
            onChange: (value) => setAttributes({ subfields: value }),
            placeholder: 'e.g., name, title, email',
            help: 'Enter the subfield keys to display, separated by commas'
          }),
          wp.element.createElement(SelectControl, {
            label: 'List Tag',
            value: attributes.tagName,
            onChange: (value) => setAttributes({ tagName: value }),
            options: [
              { label: 'Unordered List', value: 'ul' },
              { label: 'Ordered List', value: 'ol' },
              { label: 'Div', value: 'div' }
            ]
          })
        )
      ),
      wp.element.createElement(
        'div',
        blockProps,
        isLoading && wp.element.createElement(Spinner, null),
        !isLoading && rowCount > 0 && wp.element.createElement(
          'p',
          { style: { color: '#666' } },
          rowCount + ' row' + (rowCount === 1 ? '' : 's') + ' found'
        ),
        !isLoading && rowCount === 0 && wp.element.createElement(
          'p',
          { style: { color: '#999', fontStyle: 'italic' } },
          'No repeater rows found for: ' + (attributes.repeaterKey || '[not set]')
        )
      )
    );
  },
  save: () => {
    return null;
  }
});
  