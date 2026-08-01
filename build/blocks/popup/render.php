<?php

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

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'wp-block-theatrum-popup']);
?>
<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>
  <div
    class="popup-backdrop"
    data-popup-backdrop="true"
    aria-hidden="true"
    inert></div>

  <div
    class="popup-dialog"
    data-popup-content="true"
    role="dialog"
    aria-modal="true"
    aria-label="<?php echo esc_attr($dialog_label); ?>"
    inert>
    <div class="popup-dialog-header">
      <button
        class="popup-close-button"
        data-close-popup="true"
        aria-label="<?php esc_attr_e('Close dialog', 'theatrum-blocks'); ?>"
        type="button">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
    <div class="popup-dialog-content">
      <?php echo $content; ?>
    </div>
  </div>
</div>