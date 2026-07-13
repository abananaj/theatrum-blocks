<?php

/**
 * Post Meta Field block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$post_id = $block->context['postId'] ?? 0;

if (!$post_id) {
  return;
}

$post = get_post($post_id);

if (!$post) {
  return;
}

$key_input = $attributes['keyInput'] ?? '';
$tag_name  = theatrum_sanitize_tag(
  $attributes['tagName'] ?? 'span',
  array('span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'),
  'span'
);
$href      = $attributes['href'] ?? '';
$prepend   = $attributes['prepend'] ?? '';
$append    = $attributes['append'] ?? '';
$hide_if_empty = $attributes['hideIfEmpty'] ?? false;

if (!$key_input) {
  return;
}

// Get post meta value
$value = get_post_meta($post->ID, $key_input, true);

if ($value === '' || $value === false) {
  // If hideIfEmpty is enabled, don't render parent container
  if ($hide_if_empty) {
    return;
  }
  // Otherwise, don't render anything (previous behavior)
  return;
}

// Handle arrays/objects
if (is_array($value) || is_object($value)) {
  $value = json_encode($value);
}

$value = $prepend . (string) $value . $append;

$wrapper_attrs = wp_kses_data( get_block_wrapper_attributes(array('class' => 'wp-block-chance-post-meta-field')) );

if ($tag_name === 'a') {
  printf(
    '<div %s><a href="%s">%s</a></div>',
    $wrapper_attrs,
    esc_url($href),
    esc_html($value)
  );
} else {
  printf(
    '<div %s><%s>%s</%s></div>',
    $wrapper_attrs,
    $tag_name,
    esc_html($value),
    $tag_name
  );
}
