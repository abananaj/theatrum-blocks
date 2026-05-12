<?php

/**
 * Styled Text Block — Server-side render callback
 * 
 * Renders the styled text block with selected HTML tag and applies
 * individual styling to any marked spans.
 * 
 * $attributes, $content, $block are injected by WordPress.
 */

$tag_name      = isset($attributes['tagName']) ? sanitize_text_field($attributes['tagName']) : 'p';
$content       = isset($attributes['content']) ? $attributes['content'] : '';
$styled_spans  = isset($attributes['styledSpans']) ? $attributes['styledSpans'] : array();

// Validate tag name to prevent XSS
$allowed_tags = array('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p');
if (! in_array($tag_name, $allowed_tags, true)) {
  $tag_name = 'p';
}

// Generate CSS for each styled span
$inline_styles = '';
if (! empty($styled_spans)) {
  foreach ($styled_spans as $span) {
    $span_id = isset($span['id']) ? sanitize_text_field($span['id']) : '';
    if (empty($span_id)) {
      continue;
    }

    $styles = array();

    // Typography properties
    if (! empty($span['fontSize'])) {
      $styles[] = 'font-size: ' . sanitize_text_field($span['fontSize']) . ';';
    }
    if (! empty($span['fontFamily'])) {
      $styles[] = 'font-family: ' . sanitize_text_field($span['fontFamily']) . ';';
    }
    if (! empty($span['fontWeight'])) {
      $styles[] = 'font-weight: ' . sanitize_text_field($span['fontWeight']) . ';';
    }
    if (! empty($span['fontStyle'])) {
      $styles[] = 'font-style: ' . sanitize_text_field($span['fontStyle']) . ';';
    }
    if (! empty($span['letterSpacing'])) {
      $styles[] = 'letter-spacing: ' . sanitize_text_field($span['letterSpacing']) . ';';
    }
    if (! empty($span['lineHeight'])) {
      $styles[] = 'line-height: ' . sanitize_text_field($span['lineHeight']) . ';';
    }
    if (! empty($span['textDecoration'])) {
      $styles[] = 'text-decoration: ' . sanitize_text_field($span['textDecoration']) . ';';
    }
    if (! empty($span['textTransform'])) {
      $styles[] = 'text-transform: ' . sanitize_text_field($span['textTransform']) . ';';
    }

    // Color properties
    if (! empty($span['color'])) {
      $styles[] = 'color: ' . sanitize_text_field($span['color']) . ';';
    }
    if (! empty($span['backgroundColor'])) {
      $styles[] = 'background-color: ' . sanitize_text_field($span['backgroundColor']) . ';';
    }

    if (! empty($styles)) {
      $inline_styles .= '.styled-span-' . $span_id . ' { ' . implode(' ', $styles) . ' }' . "\n";
    }
  }
}

// Get block wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes();

// Build the output
$output = '';

// Add inline styles if any spans are styled
if (! empty($inline_styles)) {
  $output .= '<style scoped>' . $inline_styles . '</style>';
}

$output .= sprintf(
  '<%1$s %2$s data-styled-text>%3$s</%1$s>',
  tag_escape($tag_name),
  $wrapper_attributes,
  wp_kses_post($content)
);

echo $output;
