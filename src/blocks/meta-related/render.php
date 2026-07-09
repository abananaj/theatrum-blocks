<?php

/**
 * Meta Related Block - Server-side render callback
 *
 * Reads a meta field from the current post that contains one or more post IDs
 * (or ACF Post Objects), then displays each related post's title, optionally
 * linked to its permalink.
 */

$key_input   = isset($attributes['keyInput'])  ? sanitize_text_field($attributes['keyInput'])  : '';
$tag_name    = isset($attributes['tagName'])   ? sanitize_text_field($attributes['tagName'])   : 'p';
$link_to_post = !empty($attributes['linkToPost']);
$prepend     = isset($attributes['prepend'])   ? $attributes['prepend']                        : '';
$append      = isset($attributes['append'])    ? $attributes['append']                         : '';
$separator   = isset($attributes['separator']) ? $attributes['separator']                      : ', ';

if (!$key_input) {
  return;
}

// Determine the source post ID — from Query Loop context or current post
$source_post_id = isset($block->context['postId']) ? intval($block->context['postId']) : get_the_ID();

if (!$source_post_id) {
  return;
}

// Get the meta value (supports ACF get_field returning Post Object or raw ID)
$meta_value = theatrum_get_meta($source_post_id, $key_input);

if (empty($meta_value)) {
  return;
}

// Resolve to a flat list of post IDs (supports single value or an array of them)
$related_post_ids = theatrum_meta_related_collect_ids($meta_value);

if (empty($related_post_ids)) {
  return;
}

// Build a link (or plain title) for each related post
$items = array();
foreach ($related_post_ids as $related_post_id) {
  $related_post = get_post($related_post_id);
  if (!$related_post) {
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
  return;
}

// Validate tag name
$tag_name = theatrum_sanitize_tag($tag_name, array('span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'), 'p');

$inner = esc_html($prepend) . implode(esc_html($separator), $items) . esc_html($append);

$wrapper_attrs = get_block_wrapper_attributes(['class' => 'wp-block-chance-meta-related']);

printf('<%1$s %2$s>%3$s</%1$s>', $tag_name, $wrapper_attrs, $inner);
