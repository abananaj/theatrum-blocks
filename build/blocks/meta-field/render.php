<?php


/**
 * Post Meta Field Block - Server-side render callback
 */
function render_meta_field_block($attributes, $content, $block)
{
  $post_id = $block->context['postId'] ?? 0;

  if (!$post_id) {
    return '';
  }

  $post = get_post($post_id);

  if (!$post) {
    return '';
  }

  $key_input = $attributes['keyInput'] ?? '';
  $tag_name = $attributes['tagName'] ?? 'p';
  $href = $attributes['href'] ?? '';
  $prepend = $attributes['prepend'] ?? '';
  $append = $attributes['append'] ?? '';

  if (!$key_input) {
    return '';
  }

  // Get post meta value
  $value = get_post_meta($post->ID, $key_input, true);

  if ($value === '' || $value === false) {
    return '';
  }

  // Handle arrays/objects
  if (is_array($value) || is_object($value)) {
    $value = json_encode($value);
  }

  $value = (string) $value;
  
  // Wrap value with prepend and append text
  $value = $prepend . $value . $append;

  // Validate tag name
  $allowed_tags = array('span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a');
  if (!in_array($tag_name, $allowed_tags)) {
    $tag_name = 'p';
  }

  // Build wrapper attributes with typography, color, and spacing classes
  $wrapper_attrs = get_block_wrapper_attributes(array('class' => 'wp-block-chance-post-meta-field'));

  // Handle link tag with href
  if ($tag_name === 'a') {
    $href_attr = esc_url($href);
    return sprintf(
      '<div %s><a href="%s">%s</a></div>',
      $wrapper_attrs,
      $href_attr,
      esc_html($value)
    );
  }

  return sprintf(
    '<div %s><%s>%s</%s></div>',
    $wrapper_attrs,
    $tag_name,
    esc_html($value),
    $tag_name
  );
}

/**
 * Post Meta Field Block - REST endpoint
 */
function register_post_meta_field_rest_endpoint()
{
  register_rest_route('chance/v1', '/post-meta/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)', array(
    'methods' => 'GET',
    'callback' => 'get_post_meta_field_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
  ));
}

function get_post_meta_field_rest_callback($request)
{
  $post_id = intval($request['post_id']);
  $key = sanitize_text_field($request['key']);

  $value = get_post_meta($post_id, $key, true);

  if ($value === '' || $value === false) {
    return new WP_REST_Response(array('value' => ''), 200);
  }

  // Handle arrays/objects for JSON response
  if (is_array($value) || is_object($value)) {
    $value = json_encode($value);
  }

  return new WP_REST_Response(array('value' => esc_html((string)$value)), 200);
}

add_action('rest_api_init', 'register_post_meta_field_rest_endpoint');
