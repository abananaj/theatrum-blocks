<?php

/**
 * Subtitle + Title block — render template.
 * $attributes, $content, $block are injected by WordPress.
 */

$subtitle_position = isset($attributes['subtitlePosition']) ? sanitize_text_field($attributes['subtitlePosition']) : 'before';
$level             = isset($attributes['level']) ? absint($attributes['level']) : 1;
$is_link           = ! empty($attributes['isLink']);
$link_target       = isset($attributes['linkTarget']) ? sanitize_text_field($attributes['linkTarget']) : '_self';

// Validate heading level
if ($level < 1 || $level > 6) {
	$level = 1;
}

// Resolve post ID from block context or current post
$post_id = isset($block->context['postId']) ? absint($block->context['postId']) : get_the_ID();

$subtitle = $post_id ? wp_kses_post(get_post_meta($post_id, 'subtitle', true)) : '';

if (! $post_id) {
	return;
}

$title    = get_the_title($post_id);
$post_url = get_permalink($post_id);

$title_tag  = 'h' . $level;
$title_html = esc_html($title);

if ($is_link && $post_url) {
	$target      = '_blank' === $link_target ? ' target="_blank" rel="noopener noreferrer"' : '';
	$title_html  = '<a href="' . esc_url($post_url) . '"' . $target . '>' . $title_html . '</a>';
}

$title_output    = '<' . $title_tag . ' class="subtitle-title__title">' . $title_html . '</' . $title_tag . '>';
$subtitle_output = $subtitle ? '<h2 class="subtitle-title__subtitle">' . $subtitle . '</h2>' : '';

echo '<div ' . get_block_wrapper_attributes() . '>';

if ('before' === $subtitle_position) {
	echo $subtitle_output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- already sanitized above
}

echo $title_output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- assembled from escaped parts

if ('after' === $subtitle_position) {
	echo $subtitle_output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- already sanitized above
}

echo '</div>';
