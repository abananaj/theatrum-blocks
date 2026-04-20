<?php


/**
 * Site Option Block - Server-side render callback
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

// Unserialize if needed
if (is_string($option_value) && is_serialized($option_value)) {
  $unserialized = unserialize($option_value, ['allowed_classes' => false]);
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

printf(
  '<div %s><%s>%s</%s></div>',
  $wrapper_attrs,
  $tag,
  esc_html($display_value),
  $tag
);
