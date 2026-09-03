<?php

if (! defined('ABSPATH')) {
	exit;
}

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
// 3. Finally, fall back to the global post object
if (! $post_id) {
  global $post;
  if ($post && isset($post->ID)) {
    $post_id = $post->ID;
  }
}

if (! $key) {
  theatrum_render_meta_empty_marker('div', '');
  return;
}

if (! $post_id) {
  return;
}

// Get the meta value (URL)
$url = get_post_meta($post_id, $key, true);

if (empty($url) || ! is_string($url)) {
  theatrum_render_meta_empty_marker('div', $key);
  return;
}

$url = esc_url_raw($url);

if (empty($url)) {
  theatrum_render_meta_empty_marker('div', $key);
  return;
}

// Same "Resize for smaller devices" toggle as core/embed — wraps the embed in an aspect-ratio box when enabled.
$allow_responsive = ! isset($attributes['allowResponsive']) || (bool) $attributes['allowResponsive'];

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
    theatrum_render_meta_empty_marker('div', $key);
    return;
  }

  $embed_src = 'https://www.youtube-nocookie.com/embed/' . esc_attr($video_id);
  $iframe    = sprintf(
    '<iframe src="%s" width="1200" height="675" title="%s" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>',
    esc_url($embed_src),
    esc_attr__('YouTube video', 'theatrum-blocks')
  );

  $wrapper_class = theatrum_embed_aspect_ratio_classnames(16, 9, $allow_responsive);

  printf(
    '<div %s><div class="wp-block-embed__wrapper">%s</div></div>',
    wp_kses_data(get_block_wrapper_attributes(array('class' => $wrapper_class))),
    $iframe // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $iframe built above from esc_url()/esc_attr() output; wp_kses_post() would strip the <iframe>.
  );
  return;
}

// --- Generic variation: oEmbed ---
$embed_html = wp_oembed_get($url);

if (! $embed_html) {
  // Fallback to iframe embed for direct URLs
  $embed_html = sprintf(
    '<iframe src="%s" width="1200" height="675" frameborder="0" allowfullscreen></iframe>',
    esc_url($url)
  );
}

$width  = 0;
$height = 0;
if (preg_match('/width=["\']?(\d+)/i', $embed_html, $width_match)) {
  $width = (int) $width_match[1];
}
if (preg_match('/height=["\']?(\d+)/i', $embed_html, $height_match)) {
  $height = (int) $height_match[1];
}

$wrapper_class = theatrum_embed_aspect_ratio_classnames($width ?: 16, $height ?: 9, $allow_responsive);

printf(
  '<div %s><div class="wp-block-embed__wrapper">%s</div></div>',
  wp_kses_data(get_block_wrapper_attributes(array('class' => $wrapper_class))),
  wp_kses($embed_html, theatrum_embed_allowed_html())
);
