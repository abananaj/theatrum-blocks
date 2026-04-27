<?php

/**
 * Meta Icon block — server-side render
 * $attributes, $content, $block are injected by WordPress.
 *
 * Resolves an ACF icon picker field value and renders it as:
 * - A dashicon <span> for dashicon names
 * - An <img> for URLs or attachment IDs
 */

$post_id   = $block->context['postId'] ?? get_the_ID();
$key_input = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';
$icon_size = isset($attributes['iconSize']) ? intval($attributes['iconSize']) : 48;

if (!$post_id || !$key_input) {
  return;
}

// Resolve value — try ACF first, then post meta
$value = null;
if (function_exists('get_field')) {
  $value = get_field($key_input, $post_id);
}
if ($value === null || $value === false || $value === '') {
  $value = get_post_meta($post_id, $key_input, true);
}

if (empty($value)) {
  return;
}

// Determine icon type and output
$icon_type   = '';
$icon_output = '';

if (is_numeric($value) && intval($value) > 0) {
  // Attachment ID
  $attach_id = intval($value);
  $src       = wp_get_attachment_image_src($attach_id, 'full');
  if ($src) {
    $url         = esc_url($src[0]);
    $icon_type   = 'attachment';
    $icon_output = sprintf(
      '<img src="%s" alt="" width="%d" height="%d" class="meta-icon-img" loading="lazy" decoding="async" />',
      $url,
      $icon_size,
      $icon_size
    );
  }
} elseif (is_array($value) && isset($value['url'])) {
  // ACF image/file array
  $url         = esc_url($value['url']);
  $icon_type   = 'url';
  $icon_output = sprintf(
    '<img src="%s" alt="%s" width="%d" height="%d" class="meta-icon-img" loading="lazy" decoding="async" />',
    $url,
    esc_attr($value['alt'] ?? ''),
    $icon_size,
    $icon_size
  );
} elseif (is_string($value)) {
  $trimmed = trim($value);

  if (filter_var($trimmed, FILTER_VALIDATE_URL)) {
    // Plain URL
    $icon_type   = 'url';
    $icon_output = sprintf(
      '<img src="%s" alt="" width="%d" height="%d" class="meta-icon-img" loading="lazy" decoding="async" />',
      esc_url($trimmed),
      $icon_size,
      $icon_size
    );
  } else {
    // Dashicon name — strip "dashicons-" prefix if present, then re-apply
    $dashicon_name = preg_replace('/^dashicons-/', '', $trimmed);
    if (preg_match('/^[a-z0-9_-]+$/', $dashicon_name)) {
      $icon_type   = 'dashicon';
      $icon_output = sprintf(
        '<span class="dashicons dashicons-%s" style="font-size:%dpx;width:%dpx;height:%dpx;" aria-hidden="true"></span>',
        esc_attr($dashicon_name),
        $icon_size,
        $icon_size,
        $icon_size
      );
    }
  }
}

if (!$icon_output) {
  return;
}

$wrapper_attrs = get_block_wrapper_attributes(array('class' => 'wp-block-chance-meta-icon'));

printf('<span %s>%s</span>', $wrapper_attrs, $icon_output);
