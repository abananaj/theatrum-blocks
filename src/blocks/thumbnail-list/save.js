/**
 * Thumbnail List Block Save
 * 
 * Render the thumbnail list block on the frontend.
 */

import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const {
    items,
    thumbnailWidth,
    thumbnailWidthUnit,
    thumbnailHeight,
    thumbnailHeightUnit,
    itemHeight,
    itemHeightUnit,
    thumbnailPosition,
    animationSpeed,
  } = attributes;

  const blockProps = useBlockProps.save( {
    className: `thumbnail-position-${ thumbnailPosition }`,
    style: { '--animation-speed': `${ animationSpeed }s` },
  } );

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div { ...blockProps }>
      <div className="thumbnail-list-wrapper">
        {/* Menu/List items */}
        <div className="list-items">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="list-item"
              data-index={index}
              style={{ height: `${ itemHeight }${ itemHeightUnit }` }}
            >
              <div className="item-title">{item.title}</div>
              {item.description && (
                <div className="item-description">{item.description}</div>
              )}
            </div>
          ))}
        </div>

        {/* Thumbnail display with front/back for 3D effect */}
        <div
          className="thumbnail-container"
          style={{
            width: `${ thumbnailWidth }${ thumbnailWidthUnit }`,
            height: `${ thumbnailHeight }${ thumbnailHeightUnit }`,
          }}
        >
          {items.map((item, index) => (
            <img
              key={`${ item.id }-thumbnail`}
              className={`thumbnail thumbnail-${ index }`}
              src={item.thumbnailUrl}
              alt={item.thumbnailAlt}
              data-index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
