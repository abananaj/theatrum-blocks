<?php

/**
 * Post Meta Field block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$post_id = $block->context['postId'] ?? 0;

if (!$post_id) {
  return;
}

$post = get_post($post_id);

if (!$post) {
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
$is_html   = !empty($attributes['isHtml']);

$wrapper_class = 'wp-block-theatrum-post-meta-field' . ($is_html ? ' is-html' : '');
$wrapper_attrs = wp_kses_data( get_block_wrapper_attributes(array('class' => $wrapper_class)) );
$fallback_to_post_content = !empty($attributes['fallbackToPostContent']);

if (!$key_input) {
  theatrum_render_meta_empty_marker($tag_name, '', array('class' => $wrapper_class));
  return;
}

// Get post meta value
$value = get_post_meta($post->ID, $key_input, true);

if ($value === '' || $value === false) {
  if ($fallback_to_post_content) {
    $fallback = apply_filters('the_content', $post->post_content);
    if (trim($fallback) !== '') {
      printf('<div %s>%s</div>', $wrapper_attrs, $fallback);
      return;
    }
  }
  theatrum_render_meta_empty_marker($tag_name, $key_input, array('class' => $wrapper_class));
  return;
}

// Handle arrays/objects — render each item in its own <span> instead of
// collapsing the value into a JSON blob.
if (is_array($value) || is_object($value)) {
  $items = is_object($value) ? (array) $value : $value;
  $spans = array();
  foreach ($items as $item) {
    $item    = (is_array($item) || is_object($item)) ? wp_json_encode($item) : (string) $item;
    $spans[] = '<span>' . esc_html($item) . '</span>';
  }

  printf(
    '<div %s>%s%s%s</div>',
    $wrapper_attrs,
    esc_html($prepend),
    implode('', $spans),
    esc_html($append)
  );
  return;
}

// WYSIWYG/rich-text fields (e.g. ACF `widget_content`) store raw TinyMCE
// output: blank-line-separated text, not literal <p> tags. Core defers that
// conversion to wpautop() at render time (same as the_content), so it has to
// run here too or paragraphs collapse into one clump. Tag/href/prepend/append
// don't apply to block-level HTML, so they're skipped in this mode.
if ($is_html) {
  printf(
    '<div %s>%s</div>',
    $wrapper_attrs,
    wp_kses_post(wpautop((string) $value))
  );
  return;
}

$value = $prepend . (string) $value . $append;

if ($tag_name === 'a') {
  printf(
    '<div %s><a href="%s">%s</a></div>',
    $wrapper_attrs,
    esc_url($href),
    esc_html($value)
  );
} else {
  printf(
    '<div %s><%s>%s</%s></div>',
    $wrapper_attrs,
    $tag_name,
    esc_html($value),
    $tag_name
  );
}
