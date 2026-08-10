<?php

/**
 * Page Nav block — server-side render callback.
 *
 * Emits an empty, accessible <nav> container. The links themselves are built
 * on the front end by view.js, which scans the page for opt-in jump targets:
 * `<section id>` elements (first heading becomes the link text) and Query
 * Loop blocks that have an HTML Anchor (one link per post, from the post
 * title). If nothing qualifies, view.js removes the container so nothing is
 * shown.
 *
 * Scope: pages, productions, and events — the post types with long-form
 * content likely to contain jump-linkable sections.
 *
 * $attributes, $content, $block are injected by WordPress.
 */

if (! is_singular(array('page', 'production', 'event'))) {
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
