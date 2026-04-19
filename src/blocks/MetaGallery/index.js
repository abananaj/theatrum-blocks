wp.blocks.registerBlockType('chance/meta-gallery', {
  edit: (props) => {
    const { attributes, setAttributes, context } = props;
    const { TextControl, SelectControl, RangeControl, ToggleControl, Spinner } = wp.components;
    const { useBlockProps, InspectorControls } = wp.blockEditor;
    const { Fragment, useState, useEffect } = wp.element;
    const { useSelect } = wp.data;

    const blockProps = useBlockProps();
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
    const contextPostId = context?.postId;
    const postId = contextPostId || editorPostId;

    useEffect(() => {
      if (!attributes.keyInput || !postId) {
        setImages([]);
        return;
      }

      setIsLoading(true);

      fetch(`/wp-json/chance/v1/meta-gallery/${postId}/${attributes.keyInput}`)
        .then((r) => r.json())
        .then((data) => {
          setImages(Array.isArray(data.images) ? data.images : []);
          setIsLoading(false);
        })
        .catch(() => {
          setImages([]);
          setIsLoading(false);
        });
    }, [attributes.keyInput, postId]);

    const columns = attributes.columns || 3;
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '8px'
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
            label: 'Meta Key',
            value: attributes.keyInput,
            onChange: (value) => setAttributes({ keyInput: value }),
            placeholder: 'e.g., production_gallery, photos',
            help: 'Enter the ACF/meta key for the gallery field'
          }),
          wp.element.createElement(RangeControl, {
            label: 'Columns',
            value: columns,
            onChange: (value) => setAttributes({ columns: value }),
            min: 1,
            max: 8
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
              { label: 'Attachment Page', value: 'attachment' }
            ]
          }),
          wp.element.createElement(ToggleControl, {
            label: 'Crop images to same height',
            checked: attributes.imageCrop,
            onChange: (value) => setAttributes({ imageCrop: value })
          }),
          wp.element.createElement(ToggleControl, {
            label: 'Show captions',
            checked: attributes.showCaption,
            onChange: (value) => setAttributes({ showCaption: value })
          })
        )
      ),
      wp.element.createElement(
        'figure',
        blockProps,
        isLoading && wp.element.createElement(Spinner, null),
        !isLoading && images.length > 0 && wp.element.createElement(
          'ul',
          { className: 'wp-block-gallery blocks-gallery-grid', style: gridStyle },
          images.map((img, i) =>
            wp.element.createElement(
              'li',
              { key: i, className: 'blocks-gallery-item' },
              wp.element.createElement(
                'figure',
                null,
                wp.element.createElement('img', {
                  src: img.url,
                  alt: img.alt || '',
                  style: {
                    width: '100%',
                    height: attributes.imageCrop ? '200px' : 'auto',
                    objectFit: attributes.imageCrop ? 'cover' : 'contain',
                    display: 'block'
                  }
                }),
                attributes.showCaption && img.caption && wp.element.createElement(
                  'figcaption',
                  { className: 'wp-element-caption' },
                  img.caption
                )
              )
            )
          )
        ),
        !isLoading && images.length === 0 && wp.element.createElement(
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
            ? `No images found for key: "${attributes.keyInput}"`
            : 'Enter a meta key in the sidebar to display a gallery'
        )
      )
    );
  },
  save: () => null
});
