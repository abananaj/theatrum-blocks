<?php

if (! defined('ABSPATH')) {
	exit;
}

/**
 * Carousel Block - Server-side render callback
 */

// Card width/gap are user input feeding an inline CSS custom property, so
// they're restricted to a plain number (matching the editor's number field)
// rather than sanitize_text_field, which would still allow CSS-breaking
// characters.
$allowed_units = array('px', '%', 'em', 'rem');

$card_width = isset($attributes['cardWidth']) ? preg_replace('/[^0-9.]/', '', (string) $attributes['cardWidth']) : '';
$card_width_unit = isset($attributes['cardWidthUnit']) && in_array($attributes['cardWidthUnit'], $allowed_units, true)
  ? $attributes['cardWidthUnit']
  : 'px';

$gap = isset($attributes['gap']) ? preg_replace('/[^0-9.]/', '', (string) $attributes['gap']) : '';
$gap_unit = isset($attributes['gapUnit']) && in_array($attributes['gapUnit'], $allowed_units, true)
  ? $attributes['gapUnit']
  : 'px';

$content_style_parts = array();
if ($card_width !== '') {
  $content_style_parts[] = '--ct-carousel-card-width: ' . esc_attr($card_width . $card_width_unit) . ';';
}
if ($gap !== '') {
  $content_style_parts[] = '--ct-carousel-gap: ' . esc_attr($gap . $gap_unit) . ';';
}
$content_style = ! empty($content_style_parts) ? 'style="' . implode(' ', $content_style_parts) . '"' : '';

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

// Arrow color/background-color are sanitized via theatrum_carousel_sanitize_color()
// (inc/helpers.php, always loaded — shared with the is-style-ct-carousel
// format's render_block filter in inc/format-controls.php, which can run on
// pages that never render a theatrum/carousel block at all).
$arrow_background = ! isset($attributes['arrowBackground']) || ! empty($attributes['arrowBackground']);
$arrow_color = theatrum_carousel_sanitize_color($attributes['arrowColor'] ?? '');
$arrow_background_color = theatrum_carousel_sanitize_color($attributes['arrowBackgroundColor'] ?? '');
$arrow_size = isset($attributes['arrowSize']) ? preg_replace('/[^0-9.]/', '', (string) $attributes['arrowSize']) : '';
$arrow_size_unit = isset($attributes['arrowSizeUnit']) && in_array($attributes['arrowSizeUnit'], $allowed_units, true)
  ? $attributes['arrowSizeUnit']
  : 'px';

$arrow_style_parts = array();
if ('' !== $arrow_color) {
  $arrow_style_parts[] = '--ct-arrow-color: ' . esc_attr($arrow_color) . ';';
}
if (! $arrow_background) {
  $arrow_style_parts[] = '--ct-arrow-bg: transparent;';
} elseif ('' !== $arrow_background_color) {
  $arrow_style_parts[] = '--ct-arrow-bg: ' . esc_attr($arrow_background_color) . ';';
}
if ('' !== $arrow_size) {
  $arrow_style_parts[] = '--ct-arrow-size: ' . esc_attr($arrow_size . $arrow_size_unit) . ';';
}

// Let WordPress generate the wrapper class plus all supports-driven
// classes/inline styles (align, spacing, color, border, etc.) so the
// frontend wrapper matches what useBlockProps() renders in the editor.
//
// The arrow vars are NOT passed through get_block_wrapper_attributes()'s
// own 'style' merging — that pipeline runs the combined style string
// through safecss_filter_attr(), which only recognizes a fixed allowlist
// of known CSS properties and silently strips custom properties like
// --ct-arrow-color. They're output directly on the inner wrapper div
// instead (same raw, pre-escaped approach $content_style already uses on
// the <ul> below, for the same reason).
$wrapper_attributes = get_block_wrapper_attributes(array('class' => implode(' ', $modifier_classes)));
$arrow_style = ! empty($arrow_style_parts) ? ' style="' . implode(' ', $arrow_style_parts) . '"' : '';

ob_start();
?>
<div <?php echo wp_kses_data($wrapper_attributes); ?>>
  <div class="theatrum-carousel-wrapper"<?php echo $arrow_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static attribute string; the arrow color/size values are esc_attr()'d where $arrow_style is built. ?>>
    <button class="theatrum-carousel-arrow disabled theatrum-arrow-prev" aria-label="Previous"></button>
    <ul class="theatrum-carousel-content" <?php echo $content_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static attribute string; the card-width/gap values are esc_attr()'d where $content_style is built. ?>>
      <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- InnerBlocks output, already rendered/sanitized by the block pipeline. ?>
    </ul>
    <button class="theatrum-carousel-arrow theatrum-arrow-next" aria-label="Next"></button>
  </div>
</div>
<?php
echo ob_get_clean(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- buffer assembled above from escaped parts.
