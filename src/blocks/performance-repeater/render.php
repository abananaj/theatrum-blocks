<?php

/**
 * Performance Repeater block — server-side render
 * $attributes, $content, $block are injected by WordPress.
 *
 * Like meta-repeater but renders subfield A as a formatted date.
 */

$repeater_key  = isset($attributes['repeaterKey'])  ? sanitize_text_field($attributes['repeaterKey'])  : '';
$date_subfield = isset($attributes['dateSubfield']) ? sanitize_text_field($attributes['dateSubfield']) : '';
$label_subfield = isset($attributes['labelSubfield']) ? sanitize_text_field($attributes['labelSubfield']) : '';
$heading_text  = isset($attributes['headingText'])  ? sanitize_text_field($attributes['headingText'])  : '';
$heading_level = isset($attributes['headingLevel']) ? sanitize_text_field($attributes['headingLevel']) : 'h2';
$tag_wrapper   = isset($attributes['tagName'])      ? sanitize_text_field($attributes['tagName'])      : 'ul';
$date_format   = isset($attributes['dateFormat'])   ? sanitize_text_field($attributes['dateFormat'])   : 'l, F j';

if ($date_format === 'custom') {
  $date_format = isset($attributes['customFormat']) && ! empty($attributes['customFormat'])
    ? sanitize_text_field($attributes['customFormat'])
    : 'Y-m-d';
}

$post_id = isset($block->context['postId']) ? $block->context['postId'] : get_the_ID();

if (! $repeater_key || ! $post_id) {
  return;
}

if (! function_exists('get_field')) {
  return;
}

$rows = get_field($repeater_key, $post_id);

if (empty($rows) || ! is_array($rows)) {
  return;
}

if (empty($date_subfield) && empty($label_subfield)) {
  return;
}

// Validate wrapper tag
$allowed_wrappers = array('ul', 'ol', 'div');
if (! in_array($tag_wrapper, $allowed_wrappers, true)) {
  $tag_wrapper = 'ul';
}

// Validate heading level
$allowed_headings = array('h2', 'h3', 'h4', 'h5', 'h6');
if (! in_array($heading_level, $allowed_headings, true)) {
  $heading_level = 'h2';
}

$item_tag = in_array($tag_wrapper, array('ul', 'ol')) ? 'li' : 'div';

printf('<div %s>', get_block_wrapper_attributes());

if ($heading_text !== '') {
  printf('<%s class="repeater-heading">%s</%s>', $heading_level, esc_html($heading_text), $heading_level);
}

printf('<%s class="repeater-rows">', $tag_wrapper);

foreach ($rows as $row) {
  if (! is_array($row)) {
    continue;
  }

  echo '<' . $item_tag . ' class="performance-row">';

  // Date subfield — parse and format
  if (! empty($date_subfield) && array_key_exists($date_subfield, $row)) {
    $raw = $row[$date_subfield];

    // ACF date picker returns a string like 'Ymd' or 'Y-m-d'
    if (is_array($raw)) {
      $raw = '';
    }
    $raw = (string) $raw;

    if ($raw !== '') {
      // Strip time component — keep only first 10 chars of ISO or Ymd (8 chars)
      $date_only = preg_replace('/\s.*$/', '', $raw);
      if (strlen($date_only) > 10) {
        $date_only = substr($date_only, 0, 10);
      }

      // Parse flexible date formats
      $timestamp = false;
      if (function_exists('theatrum_parse_flexible_date')) {
        $timestamp = theatrum_parse_flexible_date($date_only);
      }
      if (! $timestamp) {
        $timestamp = strtotime($date_only);
      }

      $display_date = $timestamp ? wp_date($date_format, $timestamp) : esc_html($raw);

      printf('<span class="performance-date">%s</span>', esc_html($display_date));
    }
  }

  // Label subfield — plain text
  if (! empty($label_subfield) && array_key_exists($label_subfield, $row)) {
    $label = (string) $row[$label_subfield];
    if ($label !== '') {
      printf('<span class="performance-label">%s</span>', esc_html($label));
    }
  }

  echo '</' . $item_tag . '>';
}

printf('</%s>', $tag_wrapper);

echo '</div>';
