<?php
/**
 * Meta Repeater block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$repeater_key = isset($attributes['repeaterKey']) ? sanitize_text_field($attributes['repeaterKey']) : '';
$subfields    = isset($attributes['subfields']) ? sanitize_text_field($attributes['subfields']) : '';
$tag          = isset($attributes['tagName']) ? sanitize_text_field($attributes['tagName']) : 'ul';

// Get post ID from context or current post
$post_id = isset($block->context['postId']) ? $block->context['postId'] : get_the_ID();

if (! $repeater_key || ! $post_id) {
  return;
}

// Get the repeater field (ACF)
if (! function_exists('get_field')) {
  return;
}

$rows = get_field($repeater_key, $post_id);

if (empty($rows) || ! is_array($rows)) {
  return;
}

// Parse subfield keys - can be comma-separated
$subfield_keys = array_filter(array_map('trim', explode(',', $subfields)));

if (empty($subfield_keys)) {
  return;
}

printf(
  '<%s %s>',
  tag_escape($tag),
  get_block_wrapper_attributes(array('class' => 'wp-block-chance-meta-repeater'))
);

foreach ($rows as $row) {
  echo '<li>';
  foreach ($subfield_keys as $subfield_key) {
    $value = isset($row[$subfield_key]) ? $row[$subfield_key] : '';
    if (! empty($value)) {
      echo '<span class="repeater-field">' . esc_html($value) . '</span> ';
    }
  }
  echo '</li>';
}

printf('</%s>', tag_escape($tag));

/**
 * Meta Repeater Block - REST endpoint for fetching repeater data in editor
 */
if ( ! function_exists( 'register_meta_repeater_rest_endpoint' ) ) :
function register_meta_repeater_rest_endpoint()
{
  register_rest_route(
    'chance/v1',
    '/meta-repeater/(?P<post_id>\d+)/(?P<repeater_key>[a-zA-Z0-9_-]+)',
    array(
      'methods' => 'GET',
      'callback' => 'get_meta_repeater_rest_callback',
      'permission_callback' => function () {
        return current_user_can('edit_posts');
      },
    )
  );
}
endif;

if ( ! function_exists( 'get_meta_repeater_rest_callback' ) ) :
function get_meta_repeater_rest_callback($request)
{
  $post_id = intval($request['post_id']);
  $repeater_key = sanitize_text_field($request['repeater_key']);

  if (! function_exists('get_field')) {
    return new WP_REST_Response(array('rows' => 0), 200);
  }

  $rows = get_field($repeater_key, $post_id);

  if (empty($rows) || ! is_array($rows)) {
    return new WP_REST_Response(array('rows' => 0), 200);
  }

  return new WP_REST_Response(array('rows' => count($rows)), 200);
}
endif;

add_action('rest_api_init', 'register_meta_repeater_rest_endpoint');
