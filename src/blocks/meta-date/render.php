<?php

/**
 * Meta Date block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$key = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';
$date_format = isset($attributes['dateFormat']) ? sanitize_text_field($attributes['dateFormat']) : 'Y-m-d';

// If custom format is selected, use the custom format value
if ($date_format === 'custom') {
  $format = isset($attributes['customFormat']) && !empty($attributes['customFormat'])
    ? sanitize_text_field($attributes['customFormat'])
    : 'Y-m-d';
} else {
  $format = $date_format;
}

$tag = isset($attributes['tagName']) ? sanitize_text_field($attributes['tagName']) : 'p';

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

if (! $key || ! $post_id) {
  return;
}

// Get the meta value
$value = get_post_meta($post_id, $key, true);

if (empty($value)) {
  printf(
    '<%1$s %2$s>[%3$s]</%1$s>',
    tag_escape($tag),
    get_block_wrapper_attributes(),
    esc_html($key)
  );
  return;
}

// Ensure value is a string (in case it's serialized as array)
if (is_array($value)) {
  $value = isset($value[0]) ? $value[0] : '';
}

if (empty($value)) {
  printf(
    '<%1$s %2$s>[%3$s]</%1$s>',
    tag_escape($tag),
    get_block_wrapper_attributes(),
    esc_html($key)
  );
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

printf(
  '<%1$s %2$s>%3$s</%1$s>',
  tag_escape($tag),
  get_block_wrapper_attributes(),
  esc_html($display_value)
);

/**
 * Meta Date Block - REST endpoint for formatted dates in editor
 */
if (! function_exists('register_meta_date_rest_endpoint')) :
  function register_meta_date_rest_endpoint()
  {
    register_rest_route('chance/v1', '/meta-date/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)/(?P<format>.+)', array(
      'methods' => 'GET',
      'callback' => 'get_meta_date_rest_callback',
      'permission_callback' => function () {
        return current_user_can('edit_posts');
      },
    ));
  }
endif;

if (! function_exists('get_meta_date_rest_callback')) :
  function get_meta_date_rest_callback($request)
  {
    $post_id = intval($request['post_id']);
    $key = sanitize_text_field($request['key']);
    $format = urldecode($request['format']);
    $format = sanitize_text_field($format);

    // Get the meta value
    $value = get_post_meta($post_id, $key, true);

    if (empty($value)) {
      return new WP_REST_Response(array('value' => "[{$key}]"), 200);
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

    // Format the parsed date using the selected format
    $display_value = wp_date($format, $timestamp);

    return new WP_REST_Response(array('value' => esc_html($display_value)), 200);
  }
endif;

add_action('rest_api_init', 'register_meta_date_rest_endpoint');
