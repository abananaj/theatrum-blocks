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
$tag_wrapper = theatrum_sanitize_tag($tag_wrapper, array('ul', 'ol', 'div', 'p'), 'ul');

// Validate subfield tags. A <p> wrapper can only legally contain inline
// content, so its subfields are always forced to <span> regardless of the
// tagA/tagB attributes.
$allowed_subfield_tags = array('span', 'div', 'p', 'em', 'strong', 'h3', 'h4', 'h5', 'h6');
if ($tag_wrapper === 'p') {
  $tag_a = 'span';
  $tag_b = 'span';
} else {
  $tag_a = theatrum_sanitize_tag($tag_a, $allowed_subfield_tags, 'span');
  $tag_b = theatrum_sanitize_tag($tag_b, $allowed_subfield_tags, 'span');
}

// .repeater-rows suppresses list markers by default (see style.scss); this
// attribute opts back into the browser's native bullets/numbers.
$show_list_style = ! empty($attributes['showListStyle']) && in_array($tag_wrapper, array('ul', 'ol'), true);
$wrapper_class    = 'repeater-rows' . ($show_list_style ? ' repeater-rows--show-markers' : '');

printf('<div %s>', get_block_wrapper_attributes());

printf('<%s class="%s">', $tag_wrapper, esc_attr($wrapper_class));

// A <p> wrapper can only contain inline content, so each row is a <span>
// rather than the block-level <div> used for a plain div wrapper.
if (in_array($tag_wrapper, array('ul', 'ol'), true)) {
  $item_tag = 'li';
} elseif ($tag_wrapper === 'p') {
  $item_tag = 'span';
} else {
  $item_tag = 'div';
}

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
