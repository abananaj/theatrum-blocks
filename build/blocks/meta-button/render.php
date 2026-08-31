<?php

if (! defined('ABSPATH')) {
	exit;
}

/**
 * Meta Button block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$key         = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';
$button_text = isset($attributes['buttonText']) ? sanitize_text_field($attributes['buttonText']) : 'Learn More';

$post_id = isset($block->context['postId']) ? $block->context['postId'] : get_the_ID();

if (! $key) {
  theatrum_render_meta_empty_marker('div', '', array('class' => 'wp-block-button'));
  return;
}

if (! $post_id) {
  return;
}

$url = esc_url(get_post_meta($post_id, $key, true));

if (empty($url)) {
  theatrum_render_meta_empty_marker('div', $key, array('class' => 'wp-block-button'));
  return;
}

printf(
  '<div %1$s><a href="%2$s" class="wp-block-button__link wp-element-button">%3$s</a></div>',
  wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'wp-block-button' ) ) ),
  $url, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $url is esc_url()'d at assignment.
  esc_html($button_text)
);
