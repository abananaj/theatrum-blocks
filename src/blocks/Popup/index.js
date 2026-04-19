wp.blocks.registerBlockType('chance/popup', {
  apiVersion: 3,
  edit: (props) => {
    const { attributes, setAttributes } = props;
    const { buttonText, isOpen } = attributes;
    const blockProps = wp.blockEditor.useBlockProps({ className: 'wp-block-chance-popup' });
    const [open, setOpen] = wp.element.useState(isOpen);

    const togglePopup = () => {
      setOpen(!open);
      setAttributes({ isOpen: !open });
    };

    return wp.element.createElement(
      wp.element.Fragment,
      null,
      wp.element.createElement(
        wp.blockEditor.InspectorControls,
        null,
        wp.element.createElement(
          wp.components.PanelBody,
          { title: wp.i18n.__('Popup Settings', 'chance-ollie') },
          wp.element.createElement(wp.components.TextControl, {
            label: wp.i18n.__('Button Text', 'chance-ollie'),
            value: buttonText,
            onChange: (value) => setAttributes({ buttonText: value })
          })
        )
      ),
      wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(
          wp.components.Button,
          {
            variant: 'primary',
            onClick: togglePopup,
            className: 'popup-toggle-button'
          },
          buttonText
        ),
        open && wp.element.createElement(
          'div',
          {
            className: 'popup-backdrop',
            onClick: togglePopup,
            'data-popup-backdrop': 'true'
          }
        ),
        wp.element.createElement(
          'div',
          {
            className: open ? 'popup-content-visible' : 'popup-content-hidden',
            style: { display: open ? 'block' : 'none', marginTop: '12px' }
          },
          wp.element.createElement(
            'div',
            { className: 'wp-block-group popup-inner-content' },
            wp.element.createElement(wp.blockEditor.InnerBlocks, null)
          )
        )
      )
    );
  },

  save: (props) => {
    const { attributes } = props;
    const { buttonText, isOpen } = attributes;

    return wp.element.createElement(
      'div',
      { className: 'wp-block-chance-popup' },
      wp.element.createElement(
        'button',
        {
          className: 'popup-toggle-button',
          'data-popup-toggle': 'true',
          'aria-expanded': isOpen ? 'true' : 'false'
        },
        buttonText
      ),
      isOpen && wp.element.createElement(
        'div',
        {
          className: 'popup-backdrop',
          'data-popup-backdrop': 'true'
        }
      ),
      wp.element.createElement(
        'div',
        {
          className: isOpen ? 'popup-content-visible' : 'popup-content-hidden',
          'data-popup-content': 'true',
          style: { display: isOpen ? 'block' : 'none', marginTop: '12px' }
        },
        wp.element.createElement(
          'div',
          { className: 'wp-block-group popup-inner-content' },
          wp.element.createElement(wp.blockEditor.InnerBlocks.Content, null)
        )
      )
    );
  }
});