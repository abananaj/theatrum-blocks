<?php

if ( ! defined('ABSPATH')) {
	exit;
}

/**
 * Carousel Block - Server-side render callback
 */

// Card width/gap feed an inline CSS custom property, so digits-only (not sanitize_text_field, which allows CSS-breaking characters).
$allowed_units = array('px', '%', 'em', 'rem');

$card_width      = isset($attributes['cardWidth']) ? preg_replace('/[^0-9.]/', '', (string) $attributes['cardWidth']) : '';
$card_width_unit = isset($attributes['cardWidthUnit']) && in_array($attributes['cardWidthUnit'], $allowed_units, true)
  ? $attributes['cardWidthUnit']
  : 'px';

$gap      = isset($attributes['gap']) ? preg_replace('/[^0-9.]/', '', (string) $attributes['gap']) : '';
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
$arrow_position          = isset($attributes['arrowPosition']) && in_array($attributes['arrowPosition'], $allowed_arrow_positions, true)
  ? $attributes['arrowPosition']
  : 'outside';
$show_scrollbar          = ! empty($attributes['showScrollbar']);

$modifier_classes = array('wp-block-theatrum-carousel');
if ('inside' === $arrow_position) {
  $modifier_classes[] = 'theatrum-arrows-inside';
} elseif ('hidden' === $arrow_position) {
  $modifier_classes[] = 'theatrum-arrows-hidden';
}
if ($show_scrollbar) {
  $modifier_classes[] = 'theatrum-scrollbar-visible';
}

// Sanitized via theatrum_carousel_sanitize_color() (inc/helpers.php, always loaded — shared with the is-style-ct-carousel format's render_block filter in inc/format-controls.php).
$arrow_background       = ! isset($attributes['arrowBackground']) || ! empty($attributes['arrowBackground']);
$arrow_color            = theatrum_carousel_sanitize_color($attributes['arrowColor'] ?? '');
$arrow_background_color = theatrum_carousel_sanitize_color($attributes['arrowBackgroundColor'] ?? '');
$arrow_size             = isset($attributes['arrowSize']) ? preg_replace('/[^0-9.]/', '', (string) $attributes['arrowSize']) : '';
$arrow_size_unit        = isset($attributes['arrowSizeUnit']) && in_array($attributes['arrowSizeUnit'], $allowed_units, true)
  ? $attributes['arrowSizeUnit']
  : 'px';

$arrow_style_parts = array();
if ('' !== $arrow_color) {
  $arrow_style_parts[] = '--ct-arrow-color: ' . esc_attr($arrow_color) . ';';
}
if ( ! $arrow_background) {
  $arrow_style_parts[] = '--ct-arrow-bg: transparent;';
} elseif ('' !== $arrow_background_color) {
  $arrow_style_parts[] = '--ct-arrow-bg: ' . esc_attr($arrow_background_color) . ';';
}
if ('' !== $arrow_size) {
  $arrow_style_parts[] = '--ct-arrow-size: ' . esc_attr($arrow_size . $arrow_size_unit) . ';';
}

// get_block_wrapper_attributes() generates supports-driven classes/styles to match useBlockProps() in the editor.
// Arrow vars bypass its 'style' merging — safecss_filter_attr() strips unknown custom properties like --ct-arrow-color — so they're output directly on the inner div instead (same as $content_style below).
$wrapper_attributes = get_block_wrapper_attributes(array('class' => implode(' ', $modifier_classes)));
$arrow_style        = ! empty($arrow_style_parts) ? ' style="' . implode(' ', $arrow_style_parts) . '"' : '';

ob_start();
?>
<div <?php echo wp_kses_data($wrapper_attributes); ?>>
  <div class="theatrum-carousel-wrapper"<?php echo $arrow_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static attribute string; the arrow color/size values are esc_attr()'d where $arrow_style is built. ?>>
    <button class="theatrum-carousel-arrow disabled theatrum-arrow-prev" aria-label="<?php esc_attr_e('Previous', 'theatrum-blocks'); ?>" aria-disabled="true"></button>
    <ul class="theatrum-carousel-content" <?php echo $content_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static attribute string; the card-width/gap values are esc_attr()'d where $content_style is built. ?>>
      <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- InnerBlocks output, already rendered/sanitized by the block pipeline. ?>
    </ul>
    <button class="theatrum-carousel-arrow theatrum-arrow-next" aria-label="<?php esc_attr_e('Next', 'theatrum-blocks'); ?>"></button>
  </div>
</div>
<?php
echo ob_get_clean(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- buffer assembled above from escaped parts.
