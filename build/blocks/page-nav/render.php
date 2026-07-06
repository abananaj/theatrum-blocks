<?php

/**
 * Page Nav block — server-side render callback.
 *
 * Emits an empty, accessible <nav> container. The links themselves are built
 * on the front end by view.js, which scans the page for `<section id>` elements
 * and turns the first heading in each into a jump link. If no qualifying
 * sections exist, view.js removes the container so nothing is shown.
 *
 * Scope: currently limited to the "page" post type. To extend to other post
 * types later, widen the conditional below (e.g. is_singular( array( 'page', 'production' ) )).
 *
 * $attributes, $content, $block are injected by WordPress.
 */

if (! is_page()) {
	return '';
}

$content_selector = isset($attributes['contentSelector']) && '' !== trim((string) $attributes['contentSelector'])
	? sanitize_text_field($attributes['contentSelector'])
	: 'main';

$nav_label = isset($attributes['navLabel']) && '' !== trim((string) $attributes['navLabel'])
	? sanitize_text_field($attributes['navLabel'])
	: __('On this page', 'theatrum-blocks');

$wrapper_attributes = get_block_wrapper_attributes(array(
	'class'                 => 'theatrum-page-nav',
	'aria-label'            => $nav_label,
	'data-content-selector' => $content_selector,
	// Hidden until view.js confirms there is at least one section to link to.
	'hidden'                => 'hidden',
));

printf('<nav %s></nav>', $wrapper_attributes);
