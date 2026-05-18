<?php


/**
 * Staff Member Block - Server-side render callback
 */

$option_name = isset($attributes['optionName']) ? $attributes['optionName'] : '';
$prepend = isset($attributes['prepend']) ? $attributes['prepend'] : '';
$append = isset($attributes['append']) ? $attributes['append'] : '';

if (!$option_name) {
  return;
}

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
  if (strpos($pretty_option_name, 'options_staff_') === 0) {
    $pretty_option_name = substr($pretty_option_name, 14); // Remove 'options_staff_'
  } elseif (strpos($pretty_option_name, 'option_staff_') === 0) {
    $pretty_option_name = substr($pretty_option_name, 13); // Remove 'option_staff_'
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
  $html = '<div class="wp-block-chance-staff-member">' . esc_html($prepend);

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
    $html .= '</p>';

    if (!empty($post_meta_title)) {
      $html .= '<p><em>' . esc_html($post_meta_title) . '</em></p>';
    }
  }

  $html .= '</div>' . esc_html($append);
  echo $html;
} else {
  // Single value - check if it's a post ID
  $single_id = (int) $option_value;

  if ($single_id > 0) {
    // Treat as post ID and fetch the title
    $post_title = get_the_title($single_id);
    $post_url = get_permalink($single_id);
    $post_meta_title = get_post_meta($single_id, 'title', true);

    if (empty($post_title)) {
      $post_title = 'Untitled';
    }

    $html = '<div class="wp-block-chance-staff-member">' . esc_html($prepend);
    $html .= '<p>';
    if ($post_url) {
      $html .= '<a href="' . esc_url($post_url) . '"><strong>' . esc_html($post_title) . '</strong></a>';
    } else {
      $html .= '<strong>' . esc_html($post_title) . '</strong>';
    }
    $html .= '</p>';

    if (!empty($post_meta_title)) {
      $html .= '<p><em>' . esc_html($post_meta_title) . '</em></p>';
    }

    $html .= '</div>' . esc_html($append);
    echo $html;
  } else {
    // Not a post ID - display as-is
    $display_value = (string) $option_value;
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

    // Handle link tag with href
    if ($tag === 'a') {
      $href_attr = esc_url($href);
      printf(
        '<div class="wp-block-chance-staff-member"><a href="%s">%s</a></div>',
        $href_attr,
        esc_html($display_value)
      );
      return;
    }

    printf(
      '<div class="wp-block-chance-staff-member"><%s>%s</%s></div>',
      $tag,
      esc_html($display_value),
      $tag
    );
  }
}
