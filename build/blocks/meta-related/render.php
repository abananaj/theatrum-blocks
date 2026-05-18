<?php

/**
 * Meta Related Block - Server-side render callback
 *
 * Reads a meta field from the current post that contains a post ID or ACF Post Object,
 * then displays the related post's title.
 */

$key_input   = isset($attributes['keyInput'])  ? sanitize_text_field($attributes['keyInput'])  : '';
$tag_name    = isset($attributes['tagName'])   ? sanitize_text_field($attributes['tagName'])   : 'p';
$link_to_post = !empty($attributes['linkToPost']);
$prepend     = isset($attributes['prepend'])   ? $attributes['prepend']                        : '';
$append      = isset($attributes['append'])    ? $attributes['append']                         : '';

if (!$key_input) {
  return;
}

// Determine the source post ID — from Query Loop context or current post
$source_post_id = isset($block->context['postId']) ? intval($block->context['postId']) : get_the_ID();

if (!$source_post_id) {
  return;
}

// Get the meta value (supports ACF get_field returning Post Object or raw ID)
$meta_value = false;
if (function_exists('get_field')) {
  $meta_value = get_field($key_input, $source_post_id);
}
if ($meta_value === false || $meta_value === null || $meta_value === '') {
  $meta_value = get_post_meta($source_post_id, $key_input, true);
}

if (empty($meta_value)) {
  return;
}

// Resolve to a post ID from whatever was returned
$related_post_id = 0;

if (is_a($meta_value, 'WP_Post')) {
  // ACF Post Object return format = Post Object
  $related_post_id = $meta_value->ID;
} elseif (is_array($meta_value) && isset($meta_value['ID'])) {
  // ACF Post Object return format = Array
  $related_post_id = intval($meta_value['ID']);
} elseif (is_numeric($meta_value)) {
  // Raw post ID (integer or numeric string)
  $related_post_id = intval($meta_value);
}

if (!$related_post_id) {
  return;
}

$related_post = get_post($related_post_id);

if (!$related_post) {
  return;
}

$post_title = get_the_title($related_post);
$post_url   = get_permalink($related_post);

if (empty($post_title)) {
  return;
}

// Validate tag name
$allowed_tags = array('span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6');
if (!in_array($tag_name, $allowed_tags, true)) {
  $tag_name = 'p';
}

$display_text = esc_html($prepend) . esc_html($post_title) . esc_html($append);

$inner = $link_to_post && $post_url
  ? sprintf('<a href="%s">%s</a>', esc_url($post_url), $display_text)
  : $display_text;

$wrapper_attrs = get_block_wrapper_attributes(['class' => 'wp-block-chance-meta-related']);

printf('<%1$s %2$s>%3$s</%1$s>', $tag_name, $wrapper_attrs, $inner);
