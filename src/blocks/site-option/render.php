<?php

/**
 * Site Option Block - Server-side render callback
 * Handles generic options, staff members, and board members
 */

$member_type = isset($attributes['memberType']) ? $attributes['memberType'] : '';
$option_name = isset($attributes['optionName']) ? $attributes['optionName'] : '';
$prepend = isset($attributes['prepend']) ? $attributes['prepend'] : '';
$prepend_tag = isset($attributes['prependTag']) ? $attributes['prependTag'] : '';
$append = isset($attributes['append']) ? $attributes['append'] : '';
$append_tag = isset($attributes['appendTag']) ? $attributes['appendTag'] : '';
$meta_key = isset($attributes['metaKey']) ? $attributes['metaKey'] : '';
$link_post_title = isset($attributes['linkPostTitle']) ? (bool) $attributes['linkPostTitle'] : true;

// Wrap prepend/append text in an inline styling tag (em/strong/small) when set.
$affix_allowed_tags = array('em', 'strong', 'small');
$wrap_affix = function ($text, $tag) use ($affix_allowed_tags) {
  if ($text === '') {
    return '';
  }
  if (in_array($tag, $affix_allowed_tags, true)) {
    return '<' . $tag . '>' . esc_html($text) . '</' . $tag . '>';
  }
  return esc_html($text);
};
$prepend_html = $wrap_affix($prepend, $prepend_tag);
$append_html = $wrap_affix($append, $append_tag);

if (!$option_name || !theatrum_is_allowed_settings_option($option_name)) {
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
    $wrapper_attrs = wp_kses_data( get_block_wrapper_attributes(array('class' => $class_string)) );

    $html = '<div ' . $wrapper_attrs . '>' . $prepend_html;
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
    $html .= '</div>' . $append_html;
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
    $wrapper_attrs = wp_kses_data( get_block_wrapper_attributes(array('class' => implode(' ', $classes))) );

    $html = '<div ' . $wrapper_attrs . '>' . $prepend_html;
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
    $html .= '</div>' . $append_html;
    echo $html;
  } else {
    // Single string value
    $classes = array($css_class);
    if (isset($attributes['className'])) {
      $classes[] = $attributes['className'];
    }
    $wrapper_attrs = wp_kses_data( get_block_wrapper_attributes(array('class' => implode(' ', $classes))) );

    $html = '<div ' . $wrapper_attrs . '>' . $prepend_html;
    if ($option_value) {
      $html .= '<p>' . esc_html($option_value) . '</p>';
    }
    $html .= '</div>' . $append_html;
    echo $html;
  }
  return;
}

// Handle generic option display
// Resolve post/term references (single ID, array of IDs, WP_Post/WP_Term
// objects, or ACF post-object / term arrays) to linked titles — same
// resolution the meta blocks use. Bare numeric IDs resolve as posts first,
// then fall back to terms linked to their archive page.
$links = theatrum_resolve_post_links($option_value);

$has_ref_links = false;
foreach ($links as $link) {
  if ($link['id'] > 0) {
    $has_ref_links = true;
    break;
  }
}

if ($has_ref_links) {
  $classes = array('wp-block-chance-site-option');
  if (isset($attributes['className'])) {
    $classes[] = $attributes['className'];
  }
  $wrapper_attrs = wp_kses_data( get_block_wrapper_attributes(array('class' => implode(' ', $classes))) );

  $html = '<div ' . $wrapper_attrs . '>' . $prepend_html;

  foreach ($links as $link) {
    // Skip any non-reference scalars mixed into the value.
    if ($link['id'] <= 0) {
      continue;
    }

    $post_title = $link['title'] !== '' ? $link['title'] : 'Untitled';

    // Show the meta value alongside the option value (title), not in place of
    // it. Meta only applies to posts — terms don't carry post meta.
    $meta_value = (!empty($meta_key) && $link['type'] === 'post')
      ? get_post_meta($link['id'], $meta_key, true)
      : '';

    $html .= '<p>';
    if ($link['url'] !== '' && $link_post_title) {
      $html .= '<a href="' . esc_url($link['url']) . '">' . esc_html($post_title) . '</a>';
    } else {
      $html .= '<span>' . esc_html($post_title) . '</span>';
    }
    if (!empty($meta_key)) {
      $html .= ',';
    }
    if (!empty($meta_value) && is_scalar($meta_value)) {
      $html .= ' <span class="site-option-meta">' . $wrap_affix((string) $meta_value, $append_tag) . '</span>';
    }
    $html .= '</p>';
  }

  $html .= '</div>' . $append_html;
  echo $html;
  return;
}

// Not a post reference — fall through to plain value handling.
if (is_array($option_value) || is_object($option_value)) {
  $raw_value = json_encode($option_value);
} else {
  $raw_value = (string) $option_value;
}

if ($raw_value === '' && $prepend_html === '' && $append_html === '') {
  return;
}

$href = isset($attributes['href']) ? $attributes['href'] : '';

// Build class array for typography, spacing, and color support
$classes = array('wp-block-chance-site-option');

// Add generated classes from block supports
if (isset($attributes['className'])) {
  $classes[] = $attributes['className'];
}

$class_string = implode(' ', $classes);
$wrapper_attrs = get_block_wrapper_attributes(array('class' => $class_string));

$value_html = $href !== ''
  ? '<a href="' . esc_url($href) . '">' . esc_html($raw_value) . '</a>'
  : '<span>' . esc_html($raw_value) . '</span>';

printf(
  '<div %s><p>%s%s%s</p></div>',
  $wrapper_attrs,
  $prepend_html,
  $value_html,
  $append_html
);
