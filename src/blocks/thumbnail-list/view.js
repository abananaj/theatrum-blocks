/**
 * Thumbnail List Block Frontend Script
 * 
 * Handles the interactive thumbnail display with 3D flip effect
 * on hover over list items.
 */

document.addEventListener('DOMContentLoaded', function () {
  const thumbnailListBlocks = document.querySelectorAll('.wp-block-chance-thumbnail-list');

  thumbnailListBlocks.forEach((block) => {
    const listItems = block.querySelectorAll('.list-item');
    const thumbnailContainer = block.querySelector('.thumbnail-container');
    const thumbnails = block.querySelectorAll('.thumbnail');
    const animationSpeed = block.dataset.animationSpeed || '0.3';

    if (!thumbnailContainer || thumbnails.length === 0) {
      return;
    }

    // Update thumbnail display on item hover
    listItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        updateThumbnail(index, thumbnails, thumbnailContainer, animationSpeed);
      });
    });

    // Set initial thumbnail
    if (thumbnails.length > 0) {
      updateThumbnail(0, thumbnails, thumbnailContainer, animationSpeed);
    }
  });

  /**
   * Update the displayed thumbnail with 3D flip effect
   */
  function updateThumbnail(index, thumbnails, container, speed) {
    // Determine if this should be displayed on front or back
    const isBack = Boolean(index % 2);

    // Update transform to show appropriate thumbnail
    thumbnails.forEach((img, i) => {
      const shouldShow = i === index;

      if (shouldShow) {
        // Show this thumbnail
        if (isBack) {
          img.style.transform = `rotateX(180deg)`;
          img.style.zIndex = '10';
        } else {
          img.style.transform = `rotateX(0deg)`;
          img.style.zIndex = '10';
        }
      } else {
        // Hide other thumbnails
        const imgIndex = parseInt(img.dataset.index || i);
        const imgIsBack = Boolean(imgIndex % 2);

        if (imgIsBack) {
          img.style.transform = `rotateX(180deg)`;
        } else {
          img.style.transform = `rotateX(0deg)`;
        }
        img.style.zIndex = '0';
      }
    });

    // Update container transform for the flip effect
    container.style.transitionDuration = `${speed}s`;
    container.style.transform = `translateY(${index * 100}%) rotateX(${index * -180}deg)`;
  }
});
