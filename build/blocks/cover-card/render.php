<?php


/**
 * Render the Cover Card block on the frontend
 */

function render_cover_card_block($attributes = array(), $content = '', $block = null)
{
  $meta_key = isset($attributes['metaKey']) ? sanitize_text_field($attributes['metaKey']) : '';
  $post_id = isset($attributes['postId']) ? intval($attributes['postId']) : 0;
  $button_text = isset($attributes['buttonText']) ? sanitize_text_field($attributes['buttonText']) : '';
  $button_url = isset($attributes['buttonUrl']) ? esc_url($attributes['buttonUrl']) : '';
  $open_in_new_window = isset($attributes['openInNewWindow']) ? (bool) $attributes['openInNewWindow'] : false;

  // Get the post
  $post = get_post($post_id);

  if (! $post) {
    return '';
  }

  // Get featured image
  $featured_image_url = '';
  if (has_post_thumbnail($post->ID)) {
    $featured_image_url = get_the_post_thumbnail_url($post->ID, 'full');
  }

  // Get post title and permalink
  $post_title = $post->post_title;
  $post_permalink = get_permalink($post->ID);

  // Build inline style for background image
  $bg_style = '';
  if ($featured_image_url) {
    $bg_style = 'background-image: url(' . esc_url($featured_image_url) . ');';
  }

  // Start output
  $output = '<div ' . get_block_wrapper_attributes(array('class' => 'wp-block-chance-cover-card')) . '>';
  $output .= '<div class="cover-card" style="' . esc_attr($bg_style) . '">';
  $output .= '<div class="user-content">' . do_blocks($content) . '</div>';
  $output .= '<div class="bottom-bar">';
  $output .= '<a href="' . esc_url($post_permalink) . '" class="post-link"><h3 class="title">' . esc_html($post_title) . '</h3></a>';

  // Add button if text and URL are provided
  if ($button_text && $button_url) {
    $target = $open_in_new_window ? 'target="_blank" rel="noopener noreferrer"' : '';
    $output .= '<a href="' . esc_url($button_url) . '" class="button" ' . $target . '>' . esc_html($button_text) . '</a>';
  }

  $output .= '</div></div></div>';

  return $output;
}


/**
 * Cover Card Block - REST endpoint for retrieving post data in editor
 */
function register_cover_card_rest_endpoint()
{
  register_rest_route(
    'chance/v1',
    '/cover-card/(?P<meta_key>[a-zA-Z0-9_-]+)',
    array(
      'methods' => 'GET',
      'callback' => 'cover_card_rest_callback',
      'permission_callback' => '__return_true',
      'args' => array(
        'meta_key' => array(
          'validate_callback' => function ($param) {
            return is_string($param);
          },
        ),
      ),
    )
  );
}
add_action('rest_api_init', 'register_cover_card_rest_endpoint');

/**
 * REST callback for cover card endpoint
 */
function cover_card_rest_callback($request)
{
  $meta_key = $request->get_param('meta_key');
  $current_post_id = intval($request->get_param('current_post_id') ?? 0);

  if (! $meta_key) {
    return new WP_REST_Response(
      array('message' => 'No meta key provided'),
      400
    );
  }

  // If meta_key is numeric, treat it as a post ID
  if (is_numeric($meta_key)) {
    $post_id = intval($meta_key);
  } else {
    // If we have a current_post_id, look up the meta key from that post
    if ($current_post_id > 0) {
      $looked_up_post_id = get_post_meta($current_post_id, $meta_key, true);
      if ($looked_up_post_id) {
        $post_id = intval($looked_up_post_id);
      } else {
        return new WP_REST_Response(
          array('message' => 'Meta key "' . esc_attr($meta_key) . '" not found on post ' . $current_post_id),
          404
        );
      }
    } else {
      // Fallback: search for posts with this meta value
      $args = array(
        'post_type' => 'any',
        'posts_per_page' => 1,
        'meta_query' => array(
          array(
            'key' => $meta_key,
            'compare' => 'EXISTS',
          ),
        ),
      );

      $posts = get_posts($args);

      if (empty($posts)) {
        return new WP_REST_Response(
          array('message' => 'No post found with meta key: ' . esc_attr($meta_key)),
          404
        );
      }

      $post_id = $posts[0]->ID;
    }
  }

  // Get the post
  $post = get_post($post_id);

  if (! $post) {
    return new WP_REST_Response(
      array('message' => 'Post not found'),
      404
    );
  }

  // Get featured image
  $featured_image_url = '';
  if (has_post_thumbnail($post->ID)) {
    $featured_image_url = get_the_post_thumbnail_url($post->ID, 'full');
  }

  return new WP_REST_Response(
    array(
      'post_id' => $post->ID,
      'post_type' => $post->post_type,
      'title' => $post->post_title,
      'featured_image' => $featured_image_url,
      'permalink' => get_permalink($post->ID),
    )
  );
}
