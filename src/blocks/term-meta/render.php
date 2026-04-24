<?php


/**
 * Render the Term Meta Field block on the frontend
 */

$term_id = isset($attributes['termId']) ? intval($attributes['termId']) : 0;
$meta_key = isset($attributes['metaKey']) ? sanitize_text_field($attributes['metaKey']) : '';
$tag = isset($attributes['tagName']) ? sanitize_text_field($attributes['tagName']) : 'p';
$prepend = isset($attributes['prepend']) ? $attributes['prepend'] : '';
$append = isset($attributes['append']) ? $attributes['append'] : '';

if (! $term_id || ! $meta_key) {
  return;
}

// Get the term meta value
$value = get_term_meta($term_id, $meta_key, true);

if (empty($value)) {
  printf(
    '<%1$s %2$s>[%3$s]</%1$s>',
    tag_escape($tag),
    get_block_wrapper_attributes(),
    esc_html($meta_key)
  );
  return;
}

$display_value = $prepend . esc_html($value) . $append;

printf(
  '<%1$s %2$s>%3$s</%1$s>',
  tag_escape($tag),
  get_block_wrapper_attributes(),
  $display_value
);
