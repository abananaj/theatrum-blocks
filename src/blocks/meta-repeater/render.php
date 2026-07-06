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
$tag_wrapper  = isset($attributes['tagName']) ? sanitize_text_field($attributes['tagName']) : 'ul';

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

// Validate wrapper tag
$allowed_wrappers = array('ul', 'ol', 'div');
if (! in_array($tag_wrapper, $allowed_wrappers, true)) {
  $tag_wrapper = 'ul';
}

// Validate subfield tags
$allowed_tags = array('span', 'div', 'p', 'em', 'strong', 'h3', 'h4', 'h5', 'h6');
if (! in_array($tag_a, $allowed_tags, true)) {
  $tag_a = 'span';
}
if (! in_array($tag_b, $allowed_tags, true)) {
  $tag_b = 'span';
}

printf('<div %s>', wp_kses_data( get_block_wrapper_attributes() ));

printf('<%s class="repeater-rows">', $tag_wrapper);

$item_tag = in_array($tag_wrapper, array('ul', 'ol')) ? 'li' : 'div';

foreach ($rows as $row) {
  if (! is_array($row)) {
    continue;
  }

  echo '<' . $item_tag . '>';

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
    }
  }

  // Display Subfield B
  if (! empty($subfield_b) && array_key_exists($subfield_b, $row)) {
    $display_b = theatrum_repeater_resolve_value($row[$subfield_b]);
    if ($display_b !== '') {
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

printf('</%s>', $tag_wrapper);

echo '</div>';
