<?php

/**
 * Meta Embed block — server-side render callback
 * $attributes, $content, $block are injected by WordPress.
 */

$key = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';

// Get post ID - try multiple sources for template compatibility
$post_id = 0;

// 1. First try block context (Query Loop, etc.)
if (isset($block->context['postId']) && !empty($block->context['postId'])) {
  $post_id = $block->context['postId'];
}
// 2. Then try current post in loop
elseif (function_exists('get_the_ID')) {
  $post_id = get_the_ID();
}
// 3. Finally, try global $post object
if (!$post_id) {
  global $post;
  if ($post && isset($post->ID)) {
    $post_id = $post->ID;
  }
}

if (!$key || !$post_id) {
  return;
}

// Get the meta value (URL)
$url = get_post_meta($post_id, $key, true);

if (empty($url)) {
  return;
}

// Ensure it's a string
if (!is_string($url)) {
  $url = '';
}

$url = esc_url_raw($url);

if (empty($url)) {
  return;
}

// Try to get embed HTML using WordPress oEmbed
$embed_html = wp_oembed_get($url);

if ($embed_html) {
  printf(
    '<div %s>%s</div>',
    get_block_wrapper_attributes(),
    wp_kses_post($embed_html)
  );
} else {
  // Fallback to iframe embed for direct URLs
  printf(
    '<div %s><iframe src="%s" width="100%%" height="400" frameborder="0" allowfullscreen></iframe></div>',
    get_block_wrapper_attributes(),
    esc_attr($url)
  );
}
