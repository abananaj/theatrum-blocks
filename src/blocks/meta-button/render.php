<?php

/**
 * Meta Button block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$key         = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';
$button_text = isset($attributes['buttonText']) ? sanitize_text_field($attributes['buttonText']) : 'Learn More';

$post_id = isset($block->context['postId']) ? $block->context['postId'] : get_the_ID();

if (! $key || ! $post_id) {
  return;
}

$url = esc_url(get_post_meta($post_id, $key, true));

if (empty($url)) {
  return;
}

printf(
  '<div %1$s><a href="%2$s" class="wp-block-button__link wp-element-button">%3$s</a></div>',
  get_block_wrapper_attributes( array( 'class' => 'wp-block-button' ) ),
  $url,
  esc_html($button_text)
);
