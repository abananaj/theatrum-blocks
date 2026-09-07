<?php

if ( ! defined('ABSPATH')) {
	exit;
}

/**
 * Expanding Card Block - Server-side render callback
 *
 * The card renders server-side so its image can be the *current* post's featured image — inside a
 * Query Loop that's each queried post in turn, which saved markup could never express. `$content`
 * is the already-rendered nested blocks (save.js writes them bare, carousel-style); it is echoed
 * as-is, never re-filtered, since core's own pipeline has already escaped it.
 */

// Content saved before this block became dynamic already contains the whole card; echoing it
// untouched keeps it rendering as it always did until the post is re-saved and migrated.
if (theatrum_card_is_legacy_content($content, 'wp-block-theatrum-card-expanding')) {
  echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- saved, core-escaped markup.
  return;
}

$post_id = $block->context['postId'] ?? get_the_ID();

$image = theatrum_card_image_html($attributes, $post_id, 'wp-block-theatrum-card-expanding');

printf(
	'<div %1$s>%2$s<div class="wp-block-theatrum-card-expanding__content">%3$s</div></div>',
	get_block_wrapper_attributes(), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core-escaped.
	$image, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in theatrum_card_image_html().
	$content // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered inner blocks.
);
