<?php


/**
 * Site Option Block - Server-side render callback
 */

function render_site_option_block($attributes, $content, $block)
{
  $option_name = isset($attributes['optionName']) ? $attributes['optionName'] : '';

  if (!$option_name) {
    return '';
  }

  // Get option value from wp_options table
  $option_value = get_option($option_name);

  if ($option_value === false) {
    return '';
  }

  // Unserialize if needed
  if (is_string($option_value)) {
    $unserialized = @unserialize($option_value);
    if ($unserialized !== false) {
      $option_value = $unserialized;
    }
  }

  // Convert to string
  if (is_array($option_value) || is_object($option_value)) {
    $display_value = json_encode($option_value);
  } else {
    $display_value = (string) $option_value;
  }

  if (empty($display_value)) {
    return '';
  }

  $tag = isset($attributes['tagName']) ? $attributes['tagName'] : 'p';
  $href = isset($attributes['href']) ? $attributes['href'] : '';

  // Validate tag name to prevent injection
  $allowed_tags = array('span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a');
  if (!in_array($tag, $allowed_tags)) {
    $tag = 'p';
  }

  // Build class array for typography, spacing, and color support
  $classes = array('wp-block-chance-site-option');

  // Add generated classes from block supports
  if (isset($attributes['className'])) {
    $classes[] = $attributes['className'];
  }

  $class_string = implode(' ', $classes);
  $wrapper_attrs = get_block_wrapper_attributes(array('class' => $class_string));

  // Handle link tag with href
  if ($tag === 'a') {
    $href_attr = esc_url($href);
    return sprintf(
      '<div %s><a href="%s">%s</a></div>',
      $wrapper_attrs,
      $href_attr,
      esc_html($display_value)
    );
  }

  return sprintf(
    '<div %s><%s>%s</%s></div>',
    $wrapper_attrs,
    $tag,
    esc_html($display_value),
    $tag
  );
}

/**
 * REST endpoint to fetch site option by name
 */
function register_site_option_rest_endpoint()
{
  register_rest_route('chance/v1', '/site-option/(?P<option_name>[a-zA-Z0-9_-]+)', array(
    'methods' => 'GET',
    'callback' => 'get_site_option_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
  ));
}

function get_site_option_rest_callback($request)
{
  $option_name = sanitize_text_field($request['option_name']);

  $value = get_option($option_name);

  if ($value === false) {
    return new WP_REST_Response(array('value' => ''), 200);
  }

  // Unserialize if needed
  if (is_string($value)) {
    $unserialized = @unserialize($value);
    if ($unserialized !== false) {
      $value = $unserialized;
    }
  }

  // Convert to string
  if (is_array($value) || is_object($value)) {
    $value = json_encode($value);
  } else {
    $value = (string) $value;
  }

  // Decode HTML entities so the editor preview displays readable text (e.g. "&amp;" → "&").
  // Safe: this endpoint requires edit_posts capability, and the JS renders the value
  // as a React text node (not innerHTML), so decoded output cannot cause XSS.
  $value = html_entity_decode($value, ENT_QUOTES, 'UTF-8');

  return new WP_REST_Response(array('value' => $value), 200);
}

add_action('rest_api_init', 'register_site_option_rest_endpoint');
