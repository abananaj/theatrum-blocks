// Frontend carousel functionality
import './editor.scss';
document.addEventListener('DOMContentLoaded', initializeCarousels);

function initializeCarousels() {
  const COMPONENT_SELECTOR = '.wp-block-chance-card-carousel .wrapper';
  const CONTROLS_SELECTOR = '.controls';
  const CONTENT_SELECTOR = '.content';

  const components = document.querySelectorAll(COMPONENT_SELECTOR);

  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    const content = component.querySelector(CONTENT_SELECTOR);
    let x = 0;
    let mx = 0;
    const maxScrollWidth = content.scrollWidth - content.clientWidth / 2 - content.clientWidth / 2;
    const nextButton = component.querySelector('.arrow-next');
    const prevButton = component.querySelector('.arrow-prev');

    if (maxScrollWidth !== 0) {
      component.classList.add('has-arrows');
    }

    if (nextButton) {
      nextButton.addEventListener('click', function (event) {
        event.preventDefault();
        x = content.clientWidth / 2 + content.scrollLeft + 0;
        content.scroll({
          left: x,
          behavior: 'smooth',
        });
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function (event) {
        event.preventDefault();
        x = content.clientWidth / 2 - content.scrollLeft + 0;
        content.scroll({
          left: -x,
          behavior: 'smooth',
        });
      });
    }

    /**
     * Mouse move handler.
     *
     * @param {object} e event object.
     */
    const mousemoveHandler = (e) => {
      const mx2 = e.pageX - content.offsetLeft;
      if (mx) {
        content.scrollLeft = content.sx + mx - mx2;
      }
    };

    /**
     * Mouse down handler.
     *
     * @param {object} e event object.
     */
    const mousedownHandler = (e) => {
      content.sx = content.scrollLeft;
      mx = e.pageX - content.offsetLeft;
      content.classList.add('dragging');
    };

    /**
     * Scroll handler.
     */
    const scrollHandler = () => {
      toggleArrows();
    };

    /**
     * Toggle arrow handler.
     */
    const toggleArrows = () => {
      if (content.scrollLeft > maxScrollWidth - 10) {
        nextButton.classList.add('disabled');
      } else if (content.scrollLeft < 10) {
        prevButton.classList.add('disabled');
      } else {
        nextButton.classList.remove('disabled');
        prevButton.classList.remove('disabled');
      }
    };

    /**
     * Mouse up handler.
     */
    const mouseupHandler = () => {
      mx = 0;
      content.classList.remove('dragging');
    };

    content.addEventListener('mousemove', mousemoveHandler);
    content.addEventListener('mousedown', mousedownHandler);
    if (component.querySelector(CONTROLS_SELECTOR) !== undefined) {
      content.addEventListener('scroll', scrollHandler);
    }
    content.addEventListener('mouseup', mouseupHandler);
    content.addEventListener('mouseleave', mouseupHandler);
  }
}