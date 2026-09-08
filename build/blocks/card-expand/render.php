<?php

if ( ! defined('ABSPATH')) {
	exit;
}

/**
 * Expand Card Block - Server-side render callback
 *
 * The card renders server-side so its image can be the *current* post's featured image — inside a
 * Query Loop that's each queried post in turn, which saved markup could never express. `$content`
 * is the already-rendered nested blocks (save.js writes them bare, carousel-style); it is echoed
 * as-is, never re-filtered, since core's own pipeline has already escaped it.
 *
 * Reveal Style branches the markup shape:
 *   - "expand" (default): image then `__content` stacked in flow, same as this block's ancestor
 *     `theatrum/card-expanding` always rendered.
 *   - "overlay": image and `__content` both wrapped in one `__frame` so they can occupy the same
 *     box (view.js slides `__content` over the image). The frame needs no sizing of its own — it
 *     takes its height from the image in flow, plus the header-tall strip style.scss pads under it
 *     — so the card's `--theatrum-card-image-*` properties stay where every card block writes
 *     them, on `__image` itself (see inc/helpers.php).
 *
 * Activate On adds a second, independent class: `is-hover` tells view.js to reveal on pointer/focus
 * instead of on click. Only that mode offers "link the image to the post" — with no click toggle,
 * the link is both the card's own call to action and the tab stop a keyboard visitor reveals it
 * from — so the link is gated on it here too, not just in the inspector.
 *
 * This is a from-scratch block name (`theatrum/card-expand`) with no earlier saved shape of its
 * own, so there is no legacy-content check here the way `theatrum/card-expanding` needed.
 */

$is_overlay = 'overlay' === ($attributes['revealStyle'] ?? 'expand');
$is_hover   = 'hover' === ($attributes['activateOn'] ?? 'click');

$post_id = $block->context['postId'] ?? get_the_ID();

// The post the card is rendering — inside a Query Loop each queried post in turn, the same post the
// featured image comes from.
$link_url = ($is_hover && ! empty($attributes['linkImageToPost']) && $post_id)
	? (string) get_permalink($post_id)
	: '';

$image = theatrum_card_image_html(
	$attributes,
	$post_id,
	'wp-block-theatrum-card-expand',
	true,
	$link_url,
	'' !== $link_url ? (string) get_the_title($post_id) : ''
);

$classes = array();
if ($is_overlay) {
	$classes[] = 'is-overlay';
}
if ($is_hover) {
	$classes[] = 'is-hover';
}

$wrapper = get_block_wrapper_attributes($classes ? array('class' => implode(' ', $classes)) : array());

if ($is_overlay) {
	printf(
		'<div %1$s><div class="wp-block-theatrum-card-expand__frame">%2$s<div class="wp-block-theatrum-card-expand__content">%3$s</div></div></div>',
		$wrapper, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core-escaped.
		$image, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in theatrum_card_image_html().
		$content // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered inner blocks.
	);
	return;
}

printf(
	'<div %1$s>%2$s<div class="wp-block-theatrum-card-expand__content">%3$s</div></div>',
	$wrapper, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core-escaped.
	$image, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in theatrum_card_image_html().
	$content // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered inner blocks.
);
