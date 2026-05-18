<?php

/**
 * Meta Embed block — server-side render callback
 * $attributes, $content, $block are injected by WordPress.
 */

$key        = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';
$embed_type = isset($attributes['embedType']) ? sanitize_text_field($attributes['embedType']) : '';

// Get post ID - try multiple sources for template compatibility
$post_id = 0;

// 1. First try block context (Query Loop, etc.)
if (isset($block->context['postId']) && ! empty($block->context['postId'])) {
  $post_id = $block->context['postId'];
}
// 2. Then try current post in loop
elseif (function_exists('get_the_ID')) {
  $post_id = get_the_ID();
}
// 3. Finally, try global $post object
if (! $post_id) {
  global $post;
  if ($post && isset($post->ID)) {
    $post_id = $post->ID;
  }
}

if (! $key || ! $post_id) {
  return;
}

// Get the meta value (URL)
$url = get_post_meta($post_id, $key, true);

if (empty($url) || ! is_string($url)) {
  return;
}

$url = esc_url_raw($url);

if (empty($url)) {
  return;
}

// --- YouTube variation ---
if ('youtube' === $embed_type) {
  // Extract the video ID from any standard YouTube URL
  preg_match(
    '/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_\-]{11})/',
    $url,
    $matches
  );
  $video_id = $matches[1] ?? '';

  if (empty($video_id)) {
    return;
  }

  $embed_src = 'https://www.youtube-nocookie.com/embed/' . esc_attr($video_id);

  printf(
    '<div %s><div class="meta-embed-youtube" style="position:relative;aspect-ratio:16/9"><iframe style="width:100%%;height:100%%;border:0" src="%s" title="%s" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div></div>',
    get_block_wrapper_attributes(),
    esc_url($embed_src),
    esc_attr__('YouTube video', 'theatrum-blocks')
  );
  return;
}

// --- Generic variation: oEmbed ---
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
