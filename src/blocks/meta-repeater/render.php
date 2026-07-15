<?php

/**
 * Meta Repeater block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$repeater_key   = isset($attributes['repeaterKey']) ? sanitize_text_field($attributes['repeaterKey']) : '';
$subfield_a   = isset($attributes['subfieldA']) ? sanitize_text_field($attributes['subfieldA']) : '';
$subfield_b   = isset($attributes['subfieldB']) ? sanitize_text_field($attributes['subfieldB']) : '';
$tag_a        = isset($attributes['tagA']) ? sanitize_text_field($attributes['tagA']) : 'span';
$tag_b        = isset($attributes['tagB']) ? sanitize_text_field($attributes['tagB']) : 'span';
$row_style    = isset($attributes['tagName']) ? sanitize_text_field($attributes['tagName']) : 'p';

// Get post ID: explicit override > block context > current post
$override_post_id = ! empty($attributes['overridePostId']) ? absint($attributes['overridePostId']) : 0;
$context_post_id  = isset($block->context['postId']) ? absint($block->context['postId']) : get_the_ID();
$post_id          = $override_post_id ?: $context_post_id;

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

// One attribute (tagName) drives both the block wrapper and the row tag
// together, since they're structurally paired: <li> only makes sense
// inside <ul>/<ol>, and <p> rows need a plain <div> around them.
if (! in_array($row_style, array('ul', 'ol', 'p'), true)) {
  $row_style = 'p';
}

$is_paragraph_rows = ($row_style === 'p');
$wrapper_tag       = $is_paragraph_rows ? 'div' : $row_style;
$item_tag          = $is_paragraph_rows ? 'p' : 'li';

// <p> rows can only hold inline content, so subfields collapse to <span> —
// matches the lock applied in edit.js.
if ($is_paragraph_rows) {
  $tag_a = 'span';
  $tag_b = 'span';
}

// Validate subfield tags
$allowed_tags = array('span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6');
if (! in_array($tag_a, $allowed_tags, true)) {
  $tag_a = 'span';
}
if (! in_array($tag_b, $allowed_tags, true)) {
  $tag_b = 'span';
}

printf('<div %s>', wp_kses_data( get_block_wrapper_attributes() ));

printf('<%s class="repeater-rows">', $wrapper_tag);

foreach ($rows as $row) {
  if (! is_array($row)) {
    continue;
  }

  echo '<' . $item_tag . '>';

  $printed_a = false;

  // Display Subfield A
  if (! empty($subfield_a) && array_key_exists($subfield_a, $row)) {
    $display_a = theatrum_repeater_resolve_value($row[$subfield_a]);
    if ($display_a !== '') {
      printf(
        '<%s class="repeater-subfield-a">%s</%s>',
        $tag_a,
        esc_html($display_a),
        $tag_a
      );
      $printed_a = true;
    }
  }

  // Display Subfield B
  if (! empty($subfield_b) && array_key_exists($subfield_b, $row)) {
    $display_b = theatrum_repeater_resolve_value($row[$subfield_b]);
    if ($display_b !== '') {
      if ($printed_a) {
        echo ' ';
      }
      printf(
        '<%s class="repeater-subfield-b">%s</%s>',
        $tag_b,
        esc_html($display_b),
        $tag_b
      );
    }
  }

  echo '</' . $item_tag . '>';
}

printf('</%s>', $wrapper_tag);

echo '</div>';
