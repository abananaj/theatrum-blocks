<?php

if ( ! defined('ABSPATH')) {
	exit;
}

/**
 * Post Meta Field block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$post_id = $block->context['postId'] ?? 0;

if ( ! $post_id) {
  return;
}

$post = get_post($post_id);

if ( ! $post) {
  return;
}

$key_input = $attributes['keyInput'] ?? '';
$tag_name  = theatrum_sanitize_tag(
    $attributes['tagName'] ?? 'span',
    array('span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'),
    'span'
);
$href      = $attributes['href'] ?? '';
$prepend   = $attributes['prepend'] ?? '';
$append    = $attributes['append'] ?? '';
$is_html   = ! empty($attributes['isHtml']);

$wrapper_class            = 'wp-block-theatrum-post-meta-field' . ($is_html ? ' is-html' : '');
$wrapper_attrs            = get_block_wrapper_attributes(array('class' => $wrapper_class));
$fallback_to_post_content = ! empty($attributes['fallbackToPostContent']);

if ( ! $key_input) {
  theatrum_render_meta_empty_marker($tag_name, '', array('class' => $wrapper_class));
  return;
}

// Get post meta value
// Raw value on purpose: get_field() would return ACF's formatted output, which would defeat this block's own formatting controls.
$value = get_post_meta($post->ID, $key_input, true);

if ($value === '' || $value === false) {
  if ($fallback_to_post_content) {
    $fallback = apply_filters('the_content', $post->post_content);
    if (trim($fallback) !== '') {
      // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $fallback is the_content filter output (trusted post content).
      printf('<div %s>%s</div>', wp_kses_data($wrapper_attrs), $fallback);
      return;
    }
  }
  theatrum_render_meta_empty_marker($tag_name, $key_input, array('class' => $wrapper_class));
  return;
}

// Handle arrays/objects — render each item in its own <span> instead of collapsing the value into a JSON blob.
if (is_array($value) || is_object($value)) {
  $items = is_object($value) ? (array) $value : $value;
  $spans = array();
  foreach ($items as $item) {
    $item    = (is_array($item) || is_object($item)) ? wp_json_encode($item) : (string) $item;
    $spans[] = '<span>' . esc_html($item) . '</span>';
  }

printf(
    '<div %s>%s%s%s</div>',
    wp_kses_data($wrapper_attrs),
    esc_html($prepend),
    implode('', $spans), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- each $spans entry is esc_html()'d where built.
    esc_html($append)
);
  return;
}

// WYSIWYG fields (e.g. ACF `widget_content`) store raw TinyMCE output (blank-line-separated, no <p> tags) — run wpautop() here like core's the_content, or paragraphs collapse into one clump.
// Tag/href/prepend/append don't apply to block-level HTML, so they're skipped in this mode.
if ($is_html) {
printf(
    '<div %s>%s</div>',
    wp_kses_data($wrapper_attrs),
    wp_kses_post(wpautop((string) $value))
);
  return;
}

$value = $prepend . (string) $value . $append;

if ($tag_name === 'a') {
printf(
    '<div %s><a href="%s">%s</a></div>',
    wp_kses_data($wrapper_attrs),
    esc_url($href),
    esc_html($value)
);
} else {
printf(
    '<div %s><%s>%s</%s></div>',
    wp_kses_data($wrapper_attrs),
    tag_escape($tag_name),
    esc_html($value),
    tag_escape($tag_name)
);
}
