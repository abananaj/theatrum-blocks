<?php

/**
 * Meta Button block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$key         = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';
$button_text = isset($attributes['buttonText']) ? sanitize_text_field($attributes['buttonText']) : 'Learn More';

$post_id = isset($block->context['postId']) ? $block->context['postId'] : get_the_ID();

if (! $key || ! $post_id) {
  return;
}

$url = esc_url(get_post_meta($post_id, $key, true));

if (empty($url)) {
  return;
}

printf(
  '<a %1$s href="%2$s" class="wp-block-button__link">%3$s</a>',
  get_block_wrapper_attributes(array('class' => 'wp-block-button')),
  $url,
  esc_html($button_text)
);

/**
 * Meta Button Block - REST endpoint for retrieving URL meta in editor
 */
if (! function_exists('register_meta_button_rest_endpoint')) :
  function register_meta_button_rest_endpoint()
  {
    register_rest_route(
      'chance/v1',
      '/meta-button/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)',
      array(
        'methods' => 'GET',
        'callback' => 'get_meta_button_rest_callback',
        'permission_callback' => function () {
          return current_user_can('edit_posts');
        },
      )
    );
  }
endif;

if (! function_exists('get_meta_button_rest_callback')) :
  function get_meta_button_rest_callback($request)
  {
    $post_id = intval($request['post_id']);
    $key = sanitize_text_field($request['key']);

    // Get the meta value
    $url = get_post_meta($post_id, $key, true);

    if (empty($url)) {
      return new WP_REST_Response(array('value' => ''), 200);
    }

    // Validate URL
    $url = esc_url($url);

    if (empty($url)) {
      return new WP_REST_Response(array('value' => ''), 200);
    }

    return new WP_REST_Response(array('value' => $url), 200);
  }
endif;

add_action('rest_api_init', 'register_meta_button_rest_endpoint');
