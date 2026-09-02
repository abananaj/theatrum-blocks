<?php

if (! defined('ABSPATH')) {
	exit;
}

/**
 * Popup Block - Server-side render
 *
 * @param array  $attributes Block attributes.
 * @param string $content    InnerBlocks content.
 * @param object $block      Block instance.
 */

$dialog_label = $attributes['dialogLabel'] ?? '';
if ($dialog_label === '') {
    $dialog_label = $attributes['anchor'] ?? __('Dialog', 'theatrum-blocks');
}

$auto_open_delay = (float) ($attributes['autoOpenDelay'] ?? 0);
$should_auto_open = $auto_open_delay > 0;

$allowed_positions = array('center', 'top', 'right', 'bottom', 'left');
$position = isset($attributes['position']) && in_array($attributes['position'], $allowed_positions, true)
    ? $attributes['position']
    : 'center';

$allowed_sizes = array('small', 'medium', 'large', 'full');
$size = isset($attributes['size']) && in_array($attributes['size'], $allowed_sizes, true)
    ? $attributes['size']
    : 'medium';

$wrapper_extra_attributes = ['class' => 'wp-block-theatrum-popup'];
if ($should_auto_open) {
    $wrapper_extra_attributes['data-auto-open-delay'] = $auto_open_delay;
}

$wrapper_attributes = get_block_wrapper_attributes($wrapper_extra_attributes);
$dialog_classes = 'popup-dialog is-position-' . $position . ' is-size-' . $size;
?>
<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>
  <div
    class="popup-backdrop"
    data-popup-backdrop="true"
    aria-hidden="true"
    inert></div>

  <div
    class="<?php echo esc_attr($dialog_classes); ?>"
    data-popup-content="true"
    role="dialog"
    aria-modal="true"
    aria-label="<?php echo esc_attr($dialog_label); ?>"
    inert>
    <div class="popup-dialog-content">
      <button
        class="popup-close-button"
        data-close-popup="true"
        aria-label="<?php esc_attr_e('Close dialog', 'theatrum-blocks'); ?>"
        type="button">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- InnerBlocks output rendered by the block pipeline. ?>
    </div>
  </div>
</div>