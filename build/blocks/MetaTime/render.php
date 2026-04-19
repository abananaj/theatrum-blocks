<?php

/**
 * Render the Meta Time block on the frontend
 */

function render_meta_time_block($attributes = array(), $content = '', $block = null)
{
  $key = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';
  $time_format = isset($attributes['timeFormat']) ? sanitize_text_field($attributes['timeFormat']) : 'h:i A';

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
    return '';
  }

  // Get the meta value
  $value = get_post_meta($post_id, $key, true);

  if (empty($value)) {
    return sprintf(
      '<%1$s %2$s>[%3$s]</%1$s>',
      tag_escape($tag),
      get_block_wrapper_attributes(),
      esc_html($key)
    );
  }

  // Parse the time using ct_parse_flexible_time to extract timestamp
  $timestamp = ct_parse_flexible_time($value);

  if (!$timestamp) {
    // If parsing fails, show the raw value
    $display_value = esc_html($value);
  } else {
    // Use wp_date which properly handles timezone conversion
    $display_value = wp_date($format, $timestamp);
  }

  return sprintf(
    '<%1$s %2$s>%3$s</%1$s>',
    tag_escape($tag),
    get_block_wrapper_attributes(),
    esc_html($display_value)
  );
}

/**
 * Meta Time Block - REST endpoint for formatted times in editor
 */
function register_meta_time_rest_endpoint()
{
  register_rest_route('chance/v1', '/meta-time/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)/(?P<format>.+)', array(
    'methods' => 'GET',
    'callback' => 'get_meta_time_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
  ));
}

function get_meta_time_rest_callback($request)
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

  // Parse the date using ct_parse_flexible_time
  $timestamp = ct_parse_flexible_time($value);

  if (!$timestamp) {
    // If parsing fails, return raw value
    return new WP_REST_Response(array('value' => esc_html((string)$value)), 200);
  }

  // Format the time using the selected format
  $display_value = wp_date($format, $timestamp);

  return new WP_REST_Response(array('value' => esc_html($display_value)), 200);
}

add_action('rest_api_init', 'register_meta_time_rest_endpoint');
