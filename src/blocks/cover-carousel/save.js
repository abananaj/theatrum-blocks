import { Fragment } from '@wordpress/element';

export default function save({ attributes }) {
  const {
    items = [],
    minHeight = 300,
    minHeightUnit = 'px',
    contentPosition = 'center',
    showIndicators = true,
    indicatorStyle = 'dots',
    showArrows = true,
    arrowStyle = 'light',
    autoplay = false,
    autoplaySpeed = 5000,
    transitionType = 'fade',
    transitionSpeed = 500
  } = attributes;

  return (
    <div
      className="wp-block-chance-cover-carousel"
      data-carousel-autoplay={autoplay ? 'true' : 'false'}
      data-carousel-speed={autoplaySpeed}
      data-carousel-transition={transitionType}
      data-carousel-transition-speed={transitionSpeed}
      style={{
        minHeight: `${minHeight}${minHeightUnit}`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Slides */}
      <div className="wp-block-chance-cover-carousel__slides">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className={`wp-block-chance-cover-carousel__slide ${index === 0 ? 'is-active' : ''}`}
            data-slide-index={index}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: index === 0 ? 1 : 0,
              transition: `opacity ${transitionSpeed}ms ${transitionType === 'fade' ? 'ease-in-out' : 'ease'}`
            }}
          >
            {/* Background Media */}
            <div
              className="wp-block-chance-cover-carousel__background"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: item.url ? `url(${item.url})` : 'none',
                backgroundPosition: `${(item.focalPoint?.x || 0.5) * 100}% ${(item.focalPoint?.y || 0.5) * 100}%`,
                backgroundSize: 'cover',
                backgroundAttachment: 'scroll'
              }}
            />

            {/* Overlay */}
            <div
              className="wp-block-chance-cover-carousel__overlay"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: item.customOverlayColor || '#000000',
                opacity: (item.dimRatio || 50) / 100
              }}
            />

            {/* Content */}
            <div
              className={`wp-block-chance-cover-carousel__content wp-block-chance-cover-carousel__content--${contentPosition}`}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: contentPosition.includes('top') ? 'flex-start' : contentPosition.includes('bottom') ? 'flex-end' : 'center',
                justifyContent: contentPosition.includes('left') ? 'flex-start' : contentPosition.includes('right') ? 'flex-end' : 'center',
                padding: '2rem',
                zIndex: 10
              }}
            >
              <div style={{ maxWidth: '100%', textAlign: 'center' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      {showIndicators && (
        <div className={`wp-block-chance-cover-carousel__indicators wp-block-chance-cover-carousel__indicators--${indicatorStyle}`}>
          {items.map((item, index) => (
            <button
              key={item.id || index}
              className={`wp-block-chance-cover-carousel__indicator ${index === 0 ? 'is-active' : ''}`}
              data-indicator-index={index}
              aria-current={index === 0 ? 'true' : 'false'}
              aria-label={`Go to slide ${index + 1}`}
            >
              {indicatorStyle === 'numbers' ? index + 1 : ''}
            </button>
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {showArrows && (
        <Fragment>
          <button
            className={`wp-block-chance-cover-carousel__arrow wp-block-chance-cover-carousel__arrow--prev wp-block-chance-cover-carousel__arrow--${arrowStyle}`}
            aria-label="Previous slide"
          >
            <span>❮</span>
          </button>
          <button
            className={`wp-block-chance-cover-carousel__arrow wp-block-chance-cover-carousel__arrow--next wp-block-chance-cover-carousel__arrow--${arrowStyle}`}
            aria-label="Next slide"
          >
            <span>❯</span>
          </button>
        </Fragment>
      )}
    </div>
  );
}
