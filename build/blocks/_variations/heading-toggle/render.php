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

// Add inline frontend styles if not already enqueued
if (!wp_style_is('chance-toggle-heading-frontend', 'enqueued')) {
  wp_enqueue_style(
    'chance-toggle-heading-frontend',
    false,
    array(),
    null
  );
  wp_add_inline_style(
    'chance-toggle-heading-frontend',
    '.wp-block-chance-toggle-heading details{margin:1em 0;border:1px solid #e0e0e0;border-radius:4px;overflow:hidden}.wp-block-chance-toggle-heading details summary{cursor:pointer;padding:1em;background-color:#f5f5f5;user-select:none;transition:background-color 0.2s ease;list-style:none}.wp-block-chance-toggle-heading details summary:hover{background-color:#efefef}.wp-block-chance-toggle-heading details summary::-webkit-details-marker{display:none}.wp-block-chance-toggle-heading details summary::before{content:"▶ ";display:inline-block;margin-right:0.5em;transition:transform 0.2s ease;font-size:0.8em}.wp-block-chance-toggle-heading details summary .toggle-heading-title{display:inline;margin:0;font-size:inherit;font-weight:inherit}.wp-block-chance-toggle-heading details[open] summary{background-color:#f0f0f0;border-bottom:1px solid #e0e0e0}.wp-block-chance-toggle-heading details[open] summary::before{transform:rotate(90deg)}.wp-block-chance-toggle-heading details .toggle-heading-content{padding:1em;background-color:#fff}.wp-block-chance-toggle-heading details .toggle-heading-content>*{margin-top:0}.wp-block-chance-toggle-heading details .toggle-heading-content>*:last-child{margin-bottom:0}'
  );
}

// Render the details/summary structure
echo '<details class="wp-block-chance-toggle-heading toggle-heading-level-' . intval($level) . '" ' . $open_attr . '>';
echo '<summary>';
echo '<' . $heading_tag . ' class="toggle-heading-title">';
echo $heading_text;
echo '</' . $heading_tag . '>';
echo '</summary>';
echo '<div class="toggle-heading-content">';
echo $content;
echo '</div>';
echo '</details>';
