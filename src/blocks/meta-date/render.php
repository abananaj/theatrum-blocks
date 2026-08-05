<?php

/**
 * Meta Date block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$key = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';
$date_format = isset($attributes['dateFormat']) ? sanitize_text_field($attributes['dateFormat']) : 'Y-m-d';
$prepend = isset($attributes['prepend']) ? $attributes['prepend'] : '';
$append = isset($attributes['append']) ? $attributes['append'] : '';

// If custom format is selected, use the custom format value
if ($date_format === 'custom') {
  $format = isset($attributes['customFormat']) && !empty($attributes['customFormat'])
    ? sanitize_text_field($attributes['customFormat'])
    : 'Y-m-d';
} else {
  $format = $date_format;
}

$tag = theatrum_sanitize_tag(
  $attributes['tagName'] ?? 'p',
  array('p', 'span', 'time', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'),
  'p'
);

// Get post ID - try multiple sources for template compatibility
$post_id = 0;

// 1. First try block context (Query Loop, etc.)
if (isset($block->context['postId']) && !empty($block->context['postId'])) {
  $post_id = $block->context['postId'];
}
// 2. Then try current post in loop
elseif (function_exists('get_the_ID')) {
  $post_id = get_the_ID();
}
// 3. Finally, try global $post object
if (!$post_id) {
  global $post;
  if ($post && isset($post->ID)) {
    $post_id = $post->ID;
  }
}

if (! $key) {
  theatrum_render_meta_empty_marker($tag, '');
  return;
}

if (! $post_id) {
  return;
}

// Get the meta value
$value = get_post_meta($post_id, $key, true);

if (empty($value)) {
  theatrum_render_meta_empty_marker($tag, $key);
  return;
}

// Ensure value is a string (in case it's serialized as array)
if (is_array($value)) {
  $value = isset($value[0]) ? $value[0] : '';
}

if (empty($value)) {
  theatrum_render_meta_empty_marker($tag, $key);
  return;
}

// Extract date-only portion (first 10 characters for YYYY-MM-DD format, or before space/time)
$date_only_value = preg_replace('/\s.*$/', '', $value); // Remove everything after first space
if (strlen($date_only_value) > 10) {
  $date_only_value = substr($date_only_value, 0, 10); // Ensure max 10 chars (YYYY-MM-DD)
}

// Parse the date-only value using theatrum_parse_flexible_date
$timestamp = theatrum_parse_flexible_date($date_only_value);

// Last resort: try strtotime
if (!$timestamp) {
  $timestamp = strtotime($date_only_value);
}

if (!$timestamp) {
  $display_value = esc_html($date_only_value);
} else {
  $display_value = wp_date($format, $timestamp);
}

$display_value = $prepend . $display_value . $append;

printf(
  '<%1$s %2$s>%3$s</%1$s>',
  $tag,
  get_block_wrapper_attributes(),
  esc_html($display_value)
);
