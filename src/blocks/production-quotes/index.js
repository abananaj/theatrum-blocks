wp.blocks.registerBlockType('chance/production-quotes', {
  edit: (props) => {
    return wp.element.createElement(wp.serverSideRender, {
      block: 'chance/production-quotes',
      attributes: props.attributes
    });
  },
  save: () => null
});