import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const { svgUrl, svgAlt, width, widthUnit, alignment, customCSS } = attributes;

  if (!svgUrl) {
    return null;
  }

  const blockProps = useBlockProps.save({
    className: `align${alignment ? alignment.charAt(0).toUpperCase() + alignment.slice(1) : ''}`,
  });

  const svgStyle = {
    width: `${width}${widthUnit}`,
    height: 'auto',
    display: 'block',
    margin: alignment === 'center' ? '0 auto' : undefined,
    marginLeft: alignment === 'right' ? 'auto' : undefined,
  };

  // Create a unique ID for scoped CSS
  const blockId = blockProps.id || `svg-icon-${Math.random().toString(36).substr(2, 9)}`;

  const customCSSRule = customCSS
    ? `#${blockId} img { ${customCSS} }`
    : '';

  return (
    <div {...blockProps} id={blockId}>
      {customCSSRule && <style>{customCSSRule}</style>}
      <figure style={{ margin: 0, textAlign: alignment }}>
        <img
          src={svgUrl}
          alt={svgAlt || 'SVG icon'}
          style={svgStyle}
        />
      </figure>
    </div>
  );
}
