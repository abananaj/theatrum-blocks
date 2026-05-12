/**
 * Icon List Block - Frontend Rendering
 * 
 * Renders the list with icons on the frontend
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const { listType, items, iconSize, iconSizeUnit, iconPosition, iconSpacing, iconColor, hoverOnly } = attributes;

  if (!items || items.length === 0) {
    return null;
  }

  const ListTag = listType === 'ol' ? 'ol' : 'ul';
  const blockProps = useBlockProps.save({
    className: `wp-block-chance-icon-list ${hoverOnly ? 'icon-hover-only' : ''} icon-position-${iconPosition}`,
  });

  const listItems = items.map((item) => {
    const iconStyle = {
      display: 'inline-block',
      width: `${iconSize}${iconSizeUnit}`,
      height: `${iconSize}${iconSizeUnit}`,
      marginRight: iconPosition === 'left' ? `${iconSpacing}px` : undefined,
      marginBottom: iconPosition === 'top' ? `${iconSpacing}px` : undefined,
      marginLeft: iconPosition === 'right' ? `${iconSpacing}px` : undefined,
      marginTop: iconPosition === 'bottom' ? `${iconSpacing}px` : undefined,
      color: iconColor,
      transition: hoverOnly ? 'opacity 0.3s ease' : 'none',
    };

    const liStyle = {
      display: 'flex',
      alignItems: iconPosition === 'top' || iconPosition === 'bottom' ? 'flex-start' : 'center',
      flexDirection: iconPosition === 'top' || iconPosition === 'bottom' ? 'column' : 'row',
    };

    return (
      <li key={item.id} style={liStyle} className="icon-list-item">
        {item.iconUrl && (
          <img
            src={item.iconUrl}
            alt={item.iconAlt || ''}
            style={iconStyle}
            className={`icon-list-icon ${hoverOnly ? 'hover-only' : ''}`}
          />
        )}
        <span className="icon-list-text">{item.text}</span>
      </li>
    );
  });

  return (
    <ListTag {...blockProps}>
      {listItems}
    </ListTag>
  );
}
