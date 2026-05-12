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

  const blockProps = useBlockProps.save();

  if (!items || items.length === 0) {
    return null;
  }

  // Get first item for initial thumbnail display
  const firstItem = items[0];

  return (
    <div
      {...blockProps}
      className={`${blockProps.className} wp-block-chance-thumbnail-list thumbnail-position-${thumbnailPosition}`}
      data-animation-speed={animationSpeed}
    >
      <div
        className="thumbnail-list-wrapper"
        style={{
          display: 'grid',
          gridTemplateColumns: thumbnailPosition === 'right' ? '1fr auto' : 'auto 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Menu/List items */}
        <div className="list-items">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="list-item"
              data-index={index}
              style={{
                height: `${itemHeight}${itemHeightUnit}`,
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderBottom: '1px solid currentColor',
                cursor: 'pointer',
                transition: `color ${animationSpeed}s ease`,
              }}
            >
              <div className="item-title" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {item.title}
              </div>
              {item.description && (
                <div
                  className="item-description"
                  style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.25rem' }}
                >
                  {item.description}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Thumbnail display with front/back for 3D effect */}
        <div
          className="thumbnail-container"
          style={{
            width: `${thumbnailWidth}${thumbnailWidthUnit}`,
            height: `${thumbnailHeight}${thumbnailHeightUnit}`,
            position: 'relative',
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, index) => (
            <img
              key={`${item.id}-thumbnail`}
              className={`thumbnail thumbnail-${index}`}
              src={item.thumbnailUrl}
              alt={item.thumbnailAlt}
              data-index={index}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                backfaceVisibility: 'hidden',
                transition: `transform ${animationSpeed}s ease`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
