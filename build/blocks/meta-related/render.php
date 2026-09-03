<?php

if ( ! defined('ABSPATH')) {
	exit;
}

/**
 * Meta Related block — server-side render.
 * Reads a meta field holding one or more post IDs (or ACF Post Objects) and displays each related post's title, optionally linked.
 */

$key_input    = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';
$tag_name     = isset($attributes['tagName']) ? sanitize_text_field($attributes['tagName']) : 'p';
$link_to_post = ! empty($attributes['linkToPost']);
$prepend      = isset($attributes['prepend']) ? $attributes['prepend'] : '';
$append       = isset($attributes['append']) ? $attributes['append'] : '';
$separator    = isset($attributes['separator']) ? $attributes['separator'] : ', ';

// Validate tag name up front so it's available to the empty-marker calls below too.
$allowed_tags = array('span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6');
if ( ! in_array($tag_name, $allowed_tags, true)) {
  $tag_name = 'p';
}

if ( ! $key_input) {
  theatrum_render_meta_empty_marker($tag_name, '', array('class' => 'wp-block-theatrum-meta-related'));
  return;
}

// Determine the source post ID — from Query Loop context or current post
$source_post_id = isset($block->context['postId']) ? intval($block->context['postId']) : get_the_ID();

if ( ! $source_post_id) {
  return;
}

// Get the meta value (supports ACF get_field returning Post Object or raw ID)
$meta_value = theatrum_get_meta($source_post_id, $key_input);

if (empty($meta_value)) {
  theatrum_render_meta_empty_marker($tag_name, $key_input, array('class' => 'wp-block-theatrum-meta-related'));
  return;
}

// Resolve to a flat list of post IDs (supports single value or an array of them)
$related_post_ids = theatrum_meta_related_collect_ids($meta_value);

if (empty($related_post_ids)) {
  theatrum_render_meta_empty_marker($tag_name, $key_input, array('class' => 'wp-block-theatrum-meta-related'));
  return;
}

// Build a link (or plain title) for each related post
$items = array();
foreach ($related_post_ids as $related_post_id) {
  $related_post = get_post($related_post_id);
  if ( ! $related_post) {
    continue;
  }

  $post_title = get_the_title($related_post);
  if (empty($post_title)) {
    continue;
  }

  $post_url = get_permalink($related_post);

  $items[] = $link_to_post && $post_url
    ? sprintf('<a href="%s">%s</a>', esc_url($post_url), esc_html($post_title))
    : esc_html($post_title);
}

if (empty($items)) {
  theatrum_render_meta_empty_marker($tag_name, $key_input, array('class' => 'wp-block-theatrum-meta-related'));
  return;
}

$inner = esc_html($prepend) . implode(esc_html($separator), $items) . esc_html($append);

$wrapper_attrs = get_block_wrapper_attributes(['class' => 'wp-block-theatrum-meta-related']);

// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $inner is esc_html()/esc_url() output concatenated above.
printf('<%1$s %2$s>%3$s</%1$s>', tag_escape($tag_name), wp_kses_data($wrapper_attrs), $inner);
