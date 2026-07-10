/**
 * Cover Carousel Block - Frontend JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
  const carousels = document.querySelectorAll('.wp-block-chance-cover-carousel');

  carousels.forEach((carousel) => {
    const slides = carousel.querySelectorAll('.wp-block-chance-cover-carousel__slide');
    const indicators = carousel.querySelectorAll('.wp-block-chance-cover-carousel__indicator');
    const prevBtn = carousel.querySelector('.wp-block-chance-cover-carousel__arrow--prev');
    const nextBtn = carousel.querySelector('.wp-block-chance-cover-carousel__arrow--next');

    const config = {
      autoplay: carousel.dataset.carouselAutoplay === 'true',
      speed: parseInt(carousel.dataset.carouselSpeed) || 5000,
      transition: carousel.dataset.carouselTransition || 'fade',
      transitionSpeed: parseInt(carousel.dataset.carouselTransitionSpeed) || 500
    };

    let currentSlide = 0;
    let autoplayInterval = null;

    // Show slide function
    function showSlide(index) {
      // Validate index
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      // Remove active class from all slides
      slides.forEach((slide) => slide.classList.remove('is-active'));
      indicators.forEach((indicator) => indicator.classList.remove('is-active'));

      // Add active class to current slide
      slides[index].classList.add('is-active');
      if (indicators[index]) {
        indicators[index].classList.add('is-active');
      }

      currentSlide = index;
    }

    // Next slide
    function nextSlide() {
      showSlide(currentSlide + 1);
      if (config.autoplay) {
        clearInterval(autoplayInterval);
        startAutoplay();
      }
    }

    // Previous slide
    function prevSlide() {
      showSlide(currentSlide - 1);
      if (config.autoplay) {
        clearInterval(autoplayInterval);
        startAutoplay();
      }
    }

    // Autoplay function
    function startAutoplay() {
      if (!config.autoplay) return;
      autoplayInterval = setInterval(() => {
        nextSlide();
      }, config.speed);
    }

    // Arrow buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }

    // Indicator buttons
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showSlide(index);
        if (config.autoplay) {
          clearInterval(autoplayInterval);
          startAutoplay();
        }
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (carousel.contains(e.target) || carousel.matches(':hover')) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
      }
    });

    // Touch support (swipe)
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    // Mouse hover support (pause autoplay)
    carousel.addEventListener('mouseenter', () => {
      if (config.autoplay) {
        clearInterval(autoplayInterval);
      }
    });

    carousel.addEventListener('mouseleave', () => {
      if (config.autoplay) {
        startAutoplay();
      }
    });

    // Initialize
    showSlide(0);
    if (config.autoplay) {
      startAutoplay();
    }
  });
});
