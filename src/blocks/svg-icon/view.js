/**
 * Frontend JavaScript for SVG Icon Block
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize SVG icons if needed for any additional frontend functionality
  const svgIcons = document.querySelectorAll('.wp-block-chance-svg-icon img');

  svgIcons.forEach((icon) => {
    // Ensure SVG images load properly
    if (icon.complete && !icon.naturalWidth) {
      // Handle broken images
      icon.style.opacity = '0.5';
    }
  });
});
