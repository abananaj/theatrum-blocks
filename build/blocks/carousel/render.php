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

$allowed_arrow_positions = array('outside', 'inside', 'hidden');
$arrow_position = isset($attributes['arrowPosition']) && in_array($attributes['arrowPosition'], $allowed_arrow_positions, true)
  ? $attributes['arrowPosition']
  : 'outside';
$show_scrollbar = ! empty($attributes['showScrollbar']);

$modifier_classes = array('wp-block-theatrum-carousel');
if ('inside' === $arrow_position) {
  $modifier_classes[] = 'theatrum-arrows-inside';
} elseif ('hidden' === $arrow_position) {
  $modifier_classes[] = 'theatrum-arrows-hidden';
}
if ($show_scrollbar) {
  $modifier_classes[] = 'theatrum-scrollbar-visible';
}

// Let WordPress generate the wrapper class plus all supports-driven
// classes/inline styles (align, spacing, color, border, etc.) so the
// frontend wrapper matches what useBlockProps() renders in the editor.
$wrapper_attributes = get_block_wrapper_attributes(array('class' => implode(' ', $modifier_classes)));

ob_start();
?>
<div <?php echo wp_kses_data($wrapper_attributes); ?>>
  <div class="theatrum-carousel-wrapper">
    <button class="theatrum-carousel-arrow disabled theatrum-arrow-prev" aria-label="Previous"></button>
    <ul class="theatrum-carousel-content" <?php echo $content_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static attribute string; the card-width value is esc_attr()'d where $content_style is built. ?>>
      <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- InnerBlocks output, already rendered/sanitized by the block pipeline. ?>
    </ul>
    <button class="theatrum-carousel-arrow theatrum-arrow-next" aria-label="Next"></button>
  </div>
</div>
<?php
echo ob_get_clean(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- buffer assembled above from escaped parts.
