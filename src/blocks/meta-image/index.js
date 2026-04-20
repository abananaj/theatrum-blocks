wp.blocks.registerBlockType('chance/meta-image', {
  edit: (props) => {
    const { attributes, setAttributes, context } = props;
    const { TextControl, SelectControl, ToggleControl, Spinner } = wp.components;
    const { useBlockProps, InspectorControls } = wp.blockEditor;
    const { Fragment, useState, useEffect } = wp.element;
    const { useSelect } = wp.data;

    const blockProps = useBlockProps();
    const [imageData, setImageData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
    const contextPostId = context?.postId;
    const postId = contextPostId || editorPostId;

    useEffect(() => {
      if (!attributes.keyInput || !postId) {
        setImageData(null);
        return;
      }

      setIsLoading(true);

      wp.apiFetch({ path: `/chance/v1/meta-image/${postId}/${attributes.keyInput}` })
        .then((data) => {
          setImageData(data.url ? data : null);
          setIsLoading(false);
        })
        .catch(() => {
          setImageData(null);
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
            label: 'Meta Key',
            value: attributes.keyInput,
            onChange: (value) => setAttributes({ keyInput: value }),
            placeholder: 'e.g., hero_image, poster',
            help: 'Enter the ACF/meta key for the image field'
          }),
          wp.element.createElement(SelectControl, {
            label: 'Image Size',
            value: attributes.imageSize,
            onChange: (value) => setAttributes({ imageSize: value }),
            options: [
              { label: 'Thumbnail', value: 'thumbnail' },
              { label: 'Medium', value: 'medium' },
              { label: 'Medium Large', value: 'medium_large' },
              { label: 'Large', value: 'large' },
              { label: 'Full', value: 'full' }
            ]
          }),
          wp.element.createElement(SelectControl, {
            label: 'Link To',
            value: attributes.linkTo,
            onChange: (value) => setAttributes({ linkTo: value }),
            options: [
              { label: 'None', value: 'none' },
              { label: 'Media File', value: 'media' },
              { label: 'Attachment Page', value: 'attachment' },
              { label: 'Custom URL', value: 'custom' }
            ]
          }),
          attributes.linkTo === 'custom' && wp.element.createElement(TextControl, {
            label: 'Custom URL',
            value: attributes.customLink,
            onChange: (value) => setAttributes({ customLink: value }),
            placeholder: 'https://example.com'
          }),
          (attributes.linkTo !== 'none') && wp.element.createElement(ToggleControl, {
            label: 'Open in new tab',
            checked: attributes.openInNewTab,
            onChange: (value) => setAttributes({ openInNewTab: value })
          }),
          wp.element.createElement(ToggleControl, {
            label: 'Show caption',
            checked: attributes.showCaption,
            onChange: (value) => setAttributes({ showCaption: value })
          })
        )
      ),
      wp.element.createElement(
        'figure',
        blockProps,
        isLoading && wp.element.createElement(Spinner, null),
        !isLoading && imageData && wp.element.createElement(
          'img',
          {
            src: imageData.url,
            alt: imageData.alt || '',
            style: { maxWidth: '100%', height: 'auto', display: 'block' }
          }
        ),
        !isLoading && imageData && attributes.showCaption && imageData.caption && wp.element.createElement(
          'figcaption',
          { className: 'wp-element-caption' },
          imageData.caption
        ),
        !isLoading && !imageData && wp.element.createElement(
          'div',
          {
            style: {
              background: '#f0f0f0',
              border: '2px dashed #ccc',
              padding: '40px',
              textAlign: 'center',
              color: '#999'
            }
          },
          attributes.keyInput
            ? `No image found for key: "${attributes.keyInput}"`
            : 'Enter a meta key in the sidebar to display an image'
        )
      )
    );
  },
  save: () => null
});
