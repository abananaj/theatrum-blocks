/******/ (() => { // webpackBootstrap
/*!**************************************!*\
  !*** ./src/blocks/Popup/frontend.js ***!
  \**************************************/
// Popup Block Frontend Script
document.addEventListener('DOMContentLoaded', function () {
  // Get all popup toggle buttons
  const popupButtons = document.querySelectorAll('[data-popup-toggle="true"]');
  popupButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      // Find the corresponding popup content (next sibling div with data-popup-content)
      const popupContent = this.parentElement.querySelector('[data-popup-content="true"]');
      if (popupContent) {
        // Toggle the visible/hidden classes and display property
        const isVisible = popupContent.classList.contains('popup-content-visible');
        if (isVisible) {
          closePopup(popupContent, this);
        } else {
          openPopup(popupContent, this);
        }
      }
    });
  });

  // Handle backdrop clicks to close popup
  document.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-popup-backdrop')) {
      // Find the associated button and popup content
      const popupWrapper = e.target.parentElement.querySelector('[data-popup-toggle="true"]');
      const popupContent = e.target.parentElement.querySelector('[data-popup-content="true"]');
      if (popupContent && popupWrapper) {
        closePopup(popupContent, popupWrapper);
      }
    }
    if (e.target.hasAttribute('data-close-popup')) {
      const popupContent = e.target.parentElement;
      const wrapper = popupContent.parentElement;
      const popupWrapper = wrapper.querySelector('[data-popup-toggle="true"]');
      if (popupContent && popupWrapper) {
        closePopup(popupContent, popupWrapper);
      }
    }
  });

  /**
   * Close popup helper function
   */
  function closePopup(popupContent, button) {
    popupContent.classList.remove('popup-content-visible');
    popupContent.classList.add('popup-content-hidden');
    popupContent.style.display = 'none';
    button.setAttribute('aria-expanded', 'false');

    // Remove close button
    const closeBtn = popupContent.querySelector('[data-close-popup]');
    if (closeBtn) {
      closeBtn.remove();
    }

    // Remove backdrop
    const backdrop = button.parentElement.querySelector('[data-popup-backdrop="true"]');
    if (backdrop) {
      backdrop.remove();
    }

    // Unlock page scroll
    document.body.style.overflow = '';
  }

  /**
   * Open popup helper function
   */
  function openPopup(popupContent, button) {
    popupContent.classList.remove('popup-content-hidden');
    popupContent.classList.add('popup-content-visible');
    popupContent.style.display = 'block';
    button.setAttribute('aria-expanded', 'true');

    // Create and add close button
    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('data-close-popup', 'true');
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '✕';
    popupContent.prepend(closeBtn);

    // Lock page scroll
    document.body.style.overflow = 'hidden';

    // Create and add backdrop if it doesn't exist
    const parentElement = button.parentElement;
    const existingBackdrop = parentElement.querySelector('[data-popup-backdrop="true"]');
    if (!existingBackdrop) {
      const backdrop = document.createElement('div');
      backdrop.className = 'popup-backdrop';
      backdrop.setAttribute('data-popup-backdrop', 'true');
      parentElement.insertBefore(backdrop, popupContent);
    }
  }
});
/******/ })()
;
//# sourceMappingURL=frontend.js.map