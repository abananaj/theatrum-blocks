<?php

/**
 * Meta Time block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$key = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';
$time_format = isset($attributes['timeFormat']) ? sanitize_text_field($attributes['timeFormat']) : 'h:i A';
$prepend = isset($attributes['prepend']) ? $attributes['prepend'] : '';
$append = isset($attributes['append']) ? $attributes['append'] : '';

// If custom format is selected, use the custom format value
if ($time_format === 'custom') {
  $format = isset($attributes['customFormat']) && !empty($attributes['customFormat'])
    ? sanitize_text_field($attributes['customFormat'])
    : 'h:i A';
} else {
  $format = $time_format;
}

$tag = isset($attributes['tagName']) ? sanitize_text_field($attributes['tagName']) : 'p';

// Get post ID from context or current post
$post_id = isset($block->context['postId']) ? $block->context['postId'] : get_the_ID();

if (! $key || ! $post_id) {
  return;
}

// Get the meta value
$value = get_post_meta($post_id, $key, true);

if (empty($value)) {
  printf(
    '<%1$s %2$s>[%3$s]</%1$s>',
    tag_escape($tag),
    wp_kses_data( get_block_wrapper_attributes() ),
    esc_html($key)
  );
  return;
}

// Parse the time using theatrum_parse_flexible_time to extract timestamp
$timestamp = theatrum_parse_flexible_time($value);

if (!$timestamp) {
  $display_value = esc_html($value);
} else {
  $display_value = wp_date($format, $timestamp);
}

$display_value = $prepend . $display_value . $append;

printf(
  '<%1$s %2$s>%3$s</%1$s>',
  tag_escape($tag),
  get_block_wrapper_attributes(),
  esc_html($display_value)
);
