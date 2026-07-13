<?php


/**
 * Carousel Block - Server-side render callback
 */

// Card width is user input feeding an inline CSS custom property, so it's
// restricted to a plain number (matching the editor's number field) rather
// than sanitize_text_field, which would still allow CSS-breaking characters.
$card_width = isset($attributes['cardWidth']) ? preg_replace('/[^0-9.]/', '', (string) $attributes['cardWidth']) : '';
$allowed_units = array('px', '%', 'em', 'rem');
$card_width_unit = isset($attributes['cardWidthUnit']) && in_array($attributes['cardWidthUnit'], $allowed_units, true)
  ? $attributes['cardWidthUnit']
  : 'px';
$content_style = $card_width !== '' ? 'style="--ct-carousel-card-width: ' . esc_attr($card_width . $card_width_unit) . ';"' : '';

// Let WordPress generate the wrapper class plus all supports-driven
// classes/inline styles (align, spacing, color, border, etc.) so the
// frontend wrapper matches what useBlockProps() renders in the editor.
$wrapper_attributes = get_block_wrapper_attributes(array('class' => 'wp-block-chance-carousel'));

ob_start();
?>
<div <?php echo $wrapper_attributes; ?>>
  <div class="ct-carousel-wrapper">
    <button class="ct-carousel-arrow disabled ct-arrow-prev" aria-label="Previous"></button>
    <ul class="ct-carousel-content" <?php echo $content_style; ?>>
      <?php echo $content; ?>
    </ul>
    <button class="ct-carousel-arrow ct-arrow-next" aria-label="Next"></button>
  </div>
</div>
<?php
echo ob_get_clean();
