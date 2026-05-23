<?php

/**
 * Site Option Block - Server-side render callback
 * Handles generic options, staff members, and board members
 */

$member_type = isset($attributes['memberType']) ? $attributes['memberType'] : '';
$option_name = isset($attributes['optionName']) ? $attributes['optionName'] : '';
$prepend = isset($attributes['prepend']) ? $attributes['prepend'] : '';
$append = isset($attributes['append']) ? $attributes['append'] : '';
$meta_key = isset($attributes['metaKey']) ? $attributes['metaKey'] : '';

if (!$option_name) {
  return;
}

// Check if this is a staff or board member block
$is_member_type = $member_type === 'staff' || $member_type === 'board';

// Get option value from wp_options table
$option_value = get_option($option_name);

if ($option_value === false) {
  return;
}

// Try to unserialize only if it's a string (PHP serialized data)
if (is_string($option_value) && is_serialized($option_value)) {
  $unserialized = unserialize($option_value, ['allowed_classes' => false]);
  if ($unserialized !== false) {
    $option_value = $unserialized;
  }
}

// Handle staff/board member display
if ($is_member_type) {
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
    // Remove type-specific prefixes based on member_type
    if ($member_type === 'staff') {
      if (strpos($pretty_option_name, 'options_staff_') === 0) {
        $pretty_option_name = substr($pretty_option_name, 14); // Remove 'options_staff_'
      } elseif (strpos($pretty_option_name, 'option_staff_') === 0) {
        $pretty_option_name = substr($pretty_option_name, 13); // Remove 'option_staff_'
      }
    } elseif ($member_type === 'board') {
      if (strpos($pretty_option_name, 'options_board_') === 0) {
        $pretty_option_name = substr($pretty_option_name, 14); // Remove 'options_board_'
      } elseif (strpos($pretty_option_name, 'option_board_') === 0) {
        $pretty_option_name = substr($pretty_option_name, 13); // Remove 'option_board_'
      }
    }
    // Remove generic prefixes
    if (strpos($pretty_option_name, 'options_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 8); // Remove 'options_'
    } elseif (strpos($pretty_option_name, 'option_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 7); // Remove 'option_'
    }
    // Capitalize each word
    $pretty_option_name = ucwords(str_replace('_', ' ', $pretty_option_name));
  }

  // Set CSS class based on member type
  $css_class = $member_type === 'board' ? 'wp-block-chance-board-member' : 'wp-block-chance-staff-member';

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
    $classes = array($css_class);
    if (isset($attributes['className'])) {
      $classes[] = $attributes['className'];
    }
    $class_string = implode(' ', $classes);
    $wrapper_attrs = get_block_wrapper_attributes(array('class' => $class_string));

    $html = '<div ' . $wrapper_attrs . '>' . esc_html($prepend);
    $html .= '<ul>';

    foreach ($post_ids as $post_id) {
      $post_id         = (int) $post_id;
      $post_title      = get_the_title($post_id);
      $post_url        = get_permalink($post_id);
      $post_meta_title = get_post_meta($post_id, 'title', true);

      if (empty($post_title)) {
        $post_title = 'Untitled';
      }

      $html .= '<li>';
      if ($post_url) {
        $html .= '<a href="' . esc_url($post_url) . '"><strong>' . esc_html($post_title) . '</strong></a>';
      } else {
        $html .= '<strong>' . esc_html($post_title) . '</strong>';
      }

      if (!empty($post_meta_title)) {
        $html .= '<br />';
        $html .= '<em>' . esc_html($post_meta_title) . '</em>';
      }

      $html .= '</li>';
    }

    $html .= '</ul>';
    $html .= '</div>' . esc_html($append);
    echo $html;
  } elseif (is_numeric($option_value)) {
    // Single post ID — resolve to title/link like the array branch
    $post_id         = (int) $option_value;
    $post_title      = get_the_title($post_id);
    $post_url        = get_permalink($post_id);
    $post_meta_title = get_post_meta($post_id, 'title', true);

    if (empty($post_title)) {
      $post_title = 'Untitled';
    }

    $classes = array($css_class);
    if (isset($attributes['className'])) {
      $classes[] = $attributes['className'];
    }
    $wrapper_attrs = get_block_wrapper_attributes(array('class' => implode(' ', $classes)));

    $html = '<div ' . $wrapper_attrs . '>' . esc_html($prepend);
    $html .= '<p>';
    if ($post_url) {
      $html .= '<a href="' . esc_url($post_url) . '"><strong>' . esc_html($post_title) . '</strong></a>';
    } else {
      $html .= '<strong>' . esc_html($post_title) . '</strong>';
    }
    if (!empty($post_meta_title)) {
      $html .= '<br />';
      $html .= '<em>' . esc_html($post_meta_title) . '</em>';
    }
    $html .= '</p>';
    $html .= '</div>' . esc_html($append);
    echo $html;
  } else {
    // Single string value
    $classes = array($css_class);
    if (isset($attributes['className'])) {
      $classes[] = $attributes['className'];
    }
    $wrapper_attrs = get_block_wrapper_attributes(array('class' => implode(' ', $classes)));

    $html = '<div ' . $wrapper_attrs . '>' . esc_html($prepend);
    if ($option_value) {
      $html .= '<p>' . esc_html($option_value) . '</p>';
    }
    $html .= '</div>' . esc_html($append);
    echo $html;
  }
  return;
}

// Handle generic option display
// If value is an array of post IDs, resolve to linked titles or meta values
if (is_array($option_value)) {
  $post_ids = array_filter($option_value, function ($id) {
    return is_numeric($id) && !empty($id);
  });

  if (!empty($post_ids)) {
    $classes = array('wp-block-chance-site-option');
    if (isset($attributes['className'])) {
      $classes[] = $attributes['className'];
    }
    $wrapper_attrs = get_block_wrapper_attributes(array('class' => implode(' ', $classes)));

    $html = '<div ' . $wrapper_attrs . '>' . esc_html($prepend);

    foreach ($post_ids as $post_id) {
      $post_id    = (int) $post_id;
      $post_url   = get_permalink($post_id);
      $post_title = get_the_title($post_id);
      if (empty($post_title)) {
        $post_title = 'Untitled';
      }

      $display_text = $post_title;
      if (!empty($meta_key)) {
        $meta_value = get_post_meta($post_id, $meta_key, true);
        if (!empty($meta_value)) {
          $display_text = $meta_value;
        }
      }

      $html .= '<p>';
      if ($post_url) {
        $html .= '<a href="' . esc_url($post_url) . '"><strong>' . esc_html($display_text) . '</strong></a>';
      } else {
        $html .= '<strong>' . esc_html($display_text) . '</strong>';
      }
      $html .= '</p>';
    }

    $html .= '</div>' . esc_html($append);
    echo $html;
    return;
  } else {
    $display_value = json_encode($option_value);
  }
} elseif (is_numeric($option_value) && (int) $option_value > 0 && get_post((int) $option_value)) {
  // Single post ID — render as a linked title
  $post_id    = (int) $option_value;
  $post_url   = get_permalink($post_id);
  $post_title = get_the_title($post_id);
  if (empty($post_title)) {
    $post_title = 'Untitled';
  }

  $display_text = $post_title;
  if (!empty($meta_key)) {
    $meta_value = get_post_meta($post_id, $meta_key, true);
    if (!empty($meta_value)) {
      $display_text = $meta_value;
    }
  }

  $classes = array('wp-block-chance-site-option');
  if (isset($attributes['className'])) {
    $classes[] = $attributes['className'];
  }
  $wrapper_attrs = get_block_wrapper_attributes(array('class' => implode(' ', $classes)));

  $html = '<div ' . $wrapper_attrs . '>' . esc_html($prepend) . '<p>';
  if ($post_url) {
    $html .= '<a href="' . esc_url($post_url) . '"><strong>' . esc_html($display_text) . '</strong></a>';
  } else {
    $html .= '<strong>' . esc_html($display_text) . '</strong>';
  }
  $html .= '</p></div>' . esc_html($append);
  echo $html;
  return;
} else {
  $display_value = (string) $option_value;
}

$display_value = $prepend . $display_value . $append;

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
  printf(
    '<div %s><a href="%s">%s</a></div>',
    $wrapper_attrs,
    $href_attr,
    esc_html($display_value)
  );
  return;
}

// Handle other tags
printf(
  '<div %s><%s>%s</%s></div>',
  $wrapper_attrs,
  $tag,
  esc_html($display_value),
  $tag
);
