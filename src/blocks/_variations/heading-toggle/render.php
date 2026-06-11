<?php

/**
 * Heading Toggle Block — Render template
 * 
 * @var array $attributes Block attributes (content, level, isOpen)
 * @var string $content Rendered inner blocks HTML
 * @var WP_Block $block Block object
 */

$heading_text = isset($attributes['content']) ? wp_kses_post($attributes['content']) : '';
$level = isset($attributes['level']) ? intval($attributes['level']) : 2;
$is_open = isset($attributes['isOpen']) ? (bool) $attributes['isOpen'] : false;

// Ensure level is valid (1-6)
$level = max(1, min(6, $level));

// Build the heading tag
$heading_tag = 'h' . $level;

// Open state attribute
$open_attr = $is_open ? 'open' : '';

// Frontend + editor styles live in style.scss (loaded in both contexts via
// block.json "style"), so no inline CSS is needed here. Build the wrapper with
// get_block_wrapper_attributes() so supports-driven classes/styles apply, while
// preserving the .wp-block-chance-toggle-heading class the stylesheet targets.
$wrapper_attributes = get_block_wrapper_attributes(array(
  'class' => 'wp-block-chance-toggle-heading toggle-heading-level-' . intval($level),
));

// Render the details/summary structure
echo '<details ' . $wrapper_attributes . ' ' . $open_attr . '>';
echo '<summary>';
echo '<' . $heading_tag . ' class="toggle-heading-title">';
echo $heading_text;
echo '</' . $heading_tag . '>';
echo '</summary>';
echo '<div class="toggle-heading-content">';
echo $content;
echo '</div>';
echo '</details>';
