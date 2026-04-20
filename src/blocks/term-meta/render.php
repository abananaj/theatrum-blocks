<?php


/**
 * Render the Term Meta Field block on the frontend
 */

$term_id = isset($attributes['termId']) ? intval($attributes['termId']) : 0;
$meta_key = isset($attributes['metaKey']) ? sanitize_text_field($attributes['metaKey']) : '';
$tag = isset($attributes['tagName']) ? sanitize_text_field($attributes['tagName']) : 'p';

if (! $term_id || ! $meta_key) {
  return;
}

// Get the term meta value
$value = get_term_meta($term_id, $meta_key, true);

if (empty($value)) {
  printf(
    '<%1$s %2$s>[%3$s]</%1$s>',
    tag_escape($tag),
    get_block_wrapper_attributes(),
    esc_html($meta_key)
  );
  return;
}

printf(
  '<%1$s %2$s>%3$s</%1$s>',
  tag_escape($tag),
  get_block_wrapper_attributes(),
  esc_html($value)
);

/**
 * Term Meta Field Block - REST endpoint for fetching term meta in editor
 */
if ( ! function_exists( 'register_term_meta_field_rest_endpoint' ) ) :
function register_term_meta_field_rest_endpoint()
{
  register_rest_route(
    'chance/v1',
    '/term-meta-field/(?P<term_id>\d+)/(?P<meta_key>[a-zA-Z0-9_-]+)',
    array(
      'methods' => 'GET',
      'callback' => 'get_term_meta_field_rest_callback',
      'permission_callback' => function () {
        return current_user_can('edit_posts');
      },
    )
  );
}

endif;

if ( ! function_exists( 'get_term_meta_field_rest_callback' ) ) :
function get_term_meta_field_rest_callback($request)
{
  $term_id = intval($request['term_id']);
  $meta_key = sanitize_text_field($request['meta_key']);

  // Get the term meta value
  $value = get_term_meta($term_id, $meta_key, true);

  if (empty($value)) {
    return new WP_REST_Response(array('value' => ''), 200);
  }

  return new WP_REST_Response(array('value' => esc_html((string) $value)), 200);
}
endif;

add_action('rest_api_init', 'register_term_meta_field_rest_endpoint');
