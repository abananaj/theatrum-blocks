<?php

/**
 * Video Trailer block — server-side render callback.
 * Embeds a YouTube video from a URL stored in post metadata.
 *
 * $attributes, $content, $block are injected by WordPress.
 */

$meta_key        = isset($attributes['metaKey']) ? sanitize_text_field($attributes['metaKey']) : '';
$aspect_ratio    = isset($attributes['aspectRatio']) ? sanitize_text_field($attributes['aspectRatio']) : '16-9';
$allow_responsive = ! empty($attributes['allowResponsive']);
$caption         = isset($attributes['caption']) ? wp_kses_post($attributes['caption']) : '';

if (! $meta_key) {
  return;
}

// Get post ID from block context, loop, or global $post.
$post_id = 0;

if (isset($block->context['postId']) && ! empty($block->context['postId'])) {
  $post_id = (int) $block->context['postId'];
} elseif (function_exists('get_the_ID') && get_the_ID()) {
  $post_id = get_the_ID();
} else {
  global $post;
  if ($post && isset($post->ID)) {
    $post_id = $post->ID;
  }
}

if (! $post_id) {
  return;
}

// Try ACF field first, then standard post meta.
$url = '';
if (function_exists('get_field')) {
  $url = get_field($meta_key, $post_id);
}
if (empty($url)) {
  $url = get_post_meta($post_id, $meta_key, true);
}

if (empty($url) || ! is_string($url)) {
  return;
}

$url = esc_url_raw($url);
if (empty($url)) {
  return;
}

// Extract the YouTube video ID.
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

// Build wrapper classes mirroring core embed block output.
$figure_classes = array(
  'wp-block-embed',
  'is-type-video',
  'is-provider-youtube',
  'wp-block-embed-youtube',
);

if ($allow_responsive) {
  $figure_classes[] = 'wp-embed-aspect-' . $aspect_ratio;
  $figure_classes[] = 'wp-has-aspect-ratio';
}

$wrapper_attributes = wp_kses_data( get_block_wrapper_attributes(
  array('class' => implode(' ', $figure_classes))
) );

$caption_html = '';
if (! empty($caption)) {
  $caption_html = sprintf(
    '<figcaption class="wp-element-caption">%s</figcaption>',
    $caption
  );
}

printf(
  '<figure %s><div class="wp-block-embed__wrapper"><iframe src="%s" title="%s" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>%s</figure>',
  $wrapper_attributes,
  esc_url($embed_src),
  esc_attr__('YouTube video trailer', 'theatrum-blocks'),
  $caption_html
);
