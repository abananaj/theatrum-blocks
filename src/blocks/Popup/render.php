<?php

/**
 * Popup Block - Server-side render
 *
 * @param array  $attributes Block attributes.
 * @param string $content    InnerBlocks content.
 * @param object $block      Block instance.
 */

$button_text = $attributes['buttonText'] ?? 'Open Dialog';
$popup_title = ! empty($attributes['popupTitle']) ? $attributes['popupTitle'] : $button_text;

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'wp-block-chance-popup']);
?>
<div <?php echo $wrapper_attributes; ?>>
  <button
    class="popup-toggle-button"
    data-popup-toggle="true"
    aria-expanded="false"
    aria-haspopup="dialog"
    type="button">
    <?php echo esc_html($button_text); ?>
  </button>

  <div
    class="popup-backdrop"
    data-popup-backdrop="true"
    aria-hidden="true"
    hidden></div>

  <div
    class="popup-dialog"
    data-popup-content="true"
    role="dialog"
    aria-modal="true"
    aria-label="<?php echo esc_attr($popup_title); ?>"
    hidden>
    <div class="popup-dialog-header">
      <h2 class="popup-dialog-title"><?php echo esc_html($popup_title); ?></h2>
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