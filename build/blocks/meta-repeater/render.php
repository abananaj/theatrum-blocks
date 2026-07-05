<?php

/**
 * Meta Repeater block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

/**
 * Resolve an ACF subfield value to a display string.
 * Handles: string, int (post ID), WP_Post, ACF link array, array of IDs/Posts.
 */
if (! function_exists('theatrum_repeater_resolve_value')) :
  function theatrum_repeater_resolve_value($value)
  {
    if (is_null($value) || $value === false || $value === '') {
      return '';
    }

    // WP_Post object — return title
    if ($value instanceof WP_Post) {
      return html_entity_decode(get_the_title($value), ENT_QUOTES, 'UTF-8');
    }

    // ACF link array: { url, title, target }
    if (is_array($value) && isset($value['url'])) {
      return isset($value['title']) && $value['title'] !== ''
        ? (string) $value['title']
        : esc_url_raw($value['url']);
    }

    // Array of items (IDs, WP_Posts, or strings) — join them
    if (is_array($value)) {
      $parts = array();
      foreach ($value as $item) {
        if ($item instanceof WP_Post) {
          $parts[] = html_entity_decode(get_the_title($item), ENT_QUOTES, 'UTF-8');
        } elseif (is_numeric($item) && intval($item) > 0) {
          $title = get_the_title(intval($item));
          if ($title) {
            $parts[] = html_entity_decode($title, ENT_QUOTES, 'UTF-8');
          }
        } elseif (is_string($item)) {
          $parts[] = $item;
        }
      }
      return implode(', ', $parts);
    }

    // Numeric string that looks like a post ID — fetch title
    if (is_numeric($value) && intval($value) > 0) {
      $title = get_the_title(intval($value));
      if ($title) {
        return html_entity_decode($title, ENT_QUOTES, 'UTF-8');
      }
    }

    return (string) $value;
  }
endif;

$repeater_key   = isset($attributes['repeaterKey']) ? sanitize_text_field($attributes['repeaterKey']) : '';
$heading_text   = isset($attributes['headingText']) ? sanitize_text_field($attributes['headingText']) : '';
$heading_level  = isset($attributes['headingLevel']) ? sanitize_text_field($attributes['headingLevel']) : 'h2';
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

// Validate heading level
$allowed_headings = array('h2', 'h3', 'h4', 'h5', 'h6');
if (! in_array($heading_level, $allowed_headings, true)) {
  $heading_level = 'h2';
}

printf('<div %s>', wp_kses_data( get_block_wrapper_attributes() ));

if ($heading_text !== '') {
  printf('<%s class="repeater-heading">%s</%s>', $heading_level, esc_html($heading_text), $heading_level);
}

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
