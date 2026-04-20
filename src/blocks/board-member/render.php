<?php


/**
 * Board Member Block - Server-side render callback
 */

$option_name = isset($attributes['optionName']) ? $attributes['optionName'] : '';

if (!$option_name) {
  return;
}

// Get option value from wp_options table
$option_value = get_option($option_name);

if ($option_value === false) {
  return;
}

// Try to unserialize only if it's a string (PHP serialized data)
if (is_string($option_value)) {
  $unserialized = unserialize($option_value, ['allowed_classes' => false]);
  if ($unserialized !== false) {
    $option_value = $unserialized;
  }
}

// Generate pretty option name from ACF field label
$pretty_option_name = '';

// Get the ACF field key from the underscore-prefixed option
$field_key = get_option('_' . $option_name);

if ($field_key && function_exists('acf_get_field')) {
  // Get the ACF field definition to retrieve its label
  $field = acf_get_field($field_key);
  if ($field && isset($field['label'])) {
    $pretty_option_name = $field['label'];
  }
}

// Fallback to the old method if ACF field not found
if (empty($pretty_option_name)) {
  $pretty_option_name = $option_name;
  if (strpos($pretty_option_name, 'options_board_') === 0) {
    $pretty_option_name = substr($pretty_option_name, 14); // Remove 'options_board_'
  } elseif (strpos($pretty_option_name, 'option_board_') === 0) {
    $pretty_option_name = substr($pretty_option_name, 13); // Remove 'option_board_'
  } elseif (strpos($pretty_option_name, 'options_') === 0) {
    $pretty_option_name = substr($pretty_option_name, 8); // Remove 'options_'
  } elseif (strpos($pretty_option_name, 'option_') === 0) {
    $pretty_option_name = substr($pretty_option_name, 7); // Remove 'option_'
  }
  // Capitalize each word
  $pretty_option_name = ucwords(str_replace('_', ' ', $pretty_option_name));
}

// Check if the value is an array of post IDs
if (is_array($option_value)) {
  // Filter out empty values and non-numeric IDs
  $post_ids = array_filter($option_value, function ($id) {
    return is_numeric($id) && !empty($id);
  });

  if (empty($post_ids)) {
    return;
  }

  // Build HTML for each person
  $html = '<div class="wp-block-chance-board-member">';

    foreach ($post_ids as $post_id) {
      $post_id = (int) $post_id;
      $post_title = get_the_title($post_id);
      $post_url = get_permalink($post_id);
      $post_meta_title = get_post_meta($post_id, 'title', true);

      if (empty($post_title)) {
        $post_title = 'Untitled';
      }

      $html .= '<p>';
      if ($post_url) {
        $html .= '<a href="' . esc_url($post_url) . '"><strong>' . esc_html($post_title) . '</strong></a>';
      } else {
        $html .= '<strong>' . esc_html($post_title) . '</strong>';
      }

      // Don't add the position title for "Board Members"
      if ($pretty_option_name !== 'Board Members') {
        $html .= ', ' . esc_html($pretty_option_name);
      }

    if (!empty($post_meta_title)) {
      $html .= '<br /><em>' . esc_html($post_meta_title) . '</em>';
    }

    $html .= '</p>';
  }

  $html .= '</div>';
  echo $html;
} else {
  // Single value - display as-is
  $display_value = (string) $option_value;
  if (empty($display_value)) {
    return;
  }

  $tag = isset($attributes['tagName']) ? $attributes['tagName'] : 'p';
  $href = isset($attributes['href']) ? $attributes['href'] : '';

  // Validate tag name to prevent injection
  $allowed_tags = array('span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a');
  if (!in_array($tag, $allowed_tags)) {
    $tag = 'p';
  }

  // Handle link tag with href
  if ($tag === 'a') {
    $href_attr = esc_url($href);
    printf(
      '<div class="wp-block-chance-board-member"><a href="%s">%s</a></div>',
      $href_attr,
      esc_html($display_value)
    );
    return;
  }

  printf(
    '<div class="wp-block-chance-board-member"><%s>%s</%s></div>',
    $tag,
    esc_html($display_value),
    $tag
  );
}

/**
 * REST endpoint to fetch board member by name
 */
if ( ! function_exists( 'register_board_member_rest_endpoint' ) ) :
function register_board_member_rest_endpoint()
{
  register_rest_route('chance/v1', '/board-member/(?P<option_name>[a-zA-Z0-9_-]+)', array(
    'methods' => 'GET',
    'callback' => 'get_board_member_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
  ));
}

endif;

if ( ! function_exists( 'get_board_member_rest_callback' ) ) :
function get_board_member_rest_callback($request)
{
  $option_name = sanitize_text_field($request['option_name']);

  $value = get_option($option_name);

  if ($value === false) {
    return new WP_REST_Response(array('value' => '', 'items' => array()), 200);
  }

  // Try to unserialize if needed
  if (is_string($value)) {
    $unserialized = unserialize($value, ['allowed_classes' => false]);
    if ($unserialized !== false) {
      $value = $unserialized;
    }
  }

  // Generate pretty option name from ACF field label
  $pretty_option_name = '';

  // Get the ACF field key from the underscore-prefixed option
  $field_key = get_option('_' . $option_name);

  if ($field_key && function_exists('acf_get_field')) {
    // Get the ACF field definition to retrieve its label
    $field = acf_get_field($field_key);
    if ($field && isset($field['label'])) {
      $pretty_option_name = $field['label'];
    }
  }

  // Fallback to the old method if ACF field not found
  if (empty($pretty_option_name)) {
    $pretty_option_name = $option_name;
    if (strpos($pretty_option_name, 'options_board_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 14);
    } elseif (strpos($pretty_option_name, 'option_board_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 13);
    } elseif (strpos($pretty_option_name, 'options_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 8);
    } elseif (strpos($pretty_option_name, 'option_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 7);
    }
    $pretty_option_name = ucwords(str_replace('_', ' ', $pretty_option_name));
  }

  // If array, check if it's an array of post IDs
  if (is_array($value)) {
    $post_ids = array_filter($value, function ($id) {
      return is_numeric($id) && !empty($id);
    });

    if (!empty($post_ids) && count($post_ids) === count($value)) {
      // All values are numeric IDs, so resolve them to full post data
      $items = array();
      foreach ($post_ids as $post_id) {
        $post_id = (int) $post_id;
        $post_title = get_the_title($post_id);
        $post_url = get_permalink($post_id);
        $post_meta_title = get_post_meta($post_id, 'title', true);

        if (!empty($post_title)) {
          $items[] = array(
            'title' => html_entity_decode($post_title, ENT_QUOTES, 'UTF-8'),
            'url' => $post_url,
            'meta_title' => html_entity_decode($post_meta_title, ENT_QUOTES, 'UTF-8'),
            'position' => $pretty_option_name
          );
        }
      }
      return new WP_REST_Response(array('value' => '', 'items' => $items), 200);
    } else {
      // Not all numeric, convert to JSON
      $value = json_encode($value);
    }
  } elseif (is_object($value)) {
    $value = json_encode($value);
  }

  // Decode any remaining HTML entities
  if (is_string($value)) {
    $value = html_entity_decode($value, ENT_QUOTES, 'UTF-8');
  }

  return new WP_REST_Response(array('value' => $value, 'items' => array()), 200);
}
endif;

add_action('rest_api_init', 'register_board_member_rest_endpoint');
