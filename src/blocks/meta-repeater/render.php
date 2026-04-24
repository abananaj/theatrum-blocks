<?php

/**
 * Meta Repeater block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$repeater_key = isset($attributes['repeaterKey']) ? sanitize_text_field($attributes['repeaterKey']) : '';
$subfield_a   = isset($attributes['subfieldA']) ? sanitize_text_field($attributes['subfieldA']) : '';
$subfield_b   = isset($attributes['subfieldB']) ? sanitize_text_field($attributes['subfieldB']) : '';
$tag_a        = isset($attributes['tagA']) ? sanitize_text_field($attributes['tagA']) : 'span';
$tag_b        = isset($attributes['tagB']) ? sanitize_text_field($attributes['tagB']) : 'span';
$tag_wrapper  = isset($attributes['tagName']) ? sanitize_text_field($attributes['tagName']) : 'ul';

// Get post ID from context or current post
$post_id = isset($block->context['postId']) ? $block->context['postId'] : get_the_ID();

if (! $repeater_key || ! $post_id) {
  return;
}

// Get the repeater field (ACF)
if (! function_exists('get_field')) {
  return;
}

$rows = get_field($repeater_key, $post_id);

if (empty($rows) || ! is_array($rows)) {
  return;
}

// At least one subfield should be configured
if (empty($subfield_a) && empty($subfield_b)) {
  return;
}

printf(
  '<%s %s>',
  tag_escape($tag_wrapper),
  get_block_wrapper_attributes(array('class' => 'wp-block-chance-meta-repeater'))
);

foreach ($rows as $row) {
  echo '<li>';

  // Display Subfield A
  if (! empty($subfield_a)) {
    $value_a = isset($row[$subfield_a]) ? $row[$subfield_a] : '';
    if (! empty($value_a)) {
      printf(
        '<%s class="repeater-subfield-a">%s</%s>',
        tag_escape($tag_a),
        esc_html($value_a),
        tag_escape($tag_a)
      );
    }
  }

  // Display Subfield B
  if (! empty($subfield_b)) {
    $value_b = isset($row[$subfield_b]) ? $row[$subfield_b] : '';
    if (! empty($value_b)) {
      printf(
        '<%s class="repeater-subfield-b">%s</%s>',
        tag_escape($tag_b),
        esc_html($value_b),
        tag_escape($tag_b)
      );
    }
  }

  echo '</li>';
}

printf('</%s>', tag_escape($tag_wrapper));
