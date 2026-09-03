<?php

if ( ! defined('ABSPATH')) {
	exit;
}

/**
 * Page Nav block — server-side render callback. Emits an empty, accessible <nav>; view.js builds
 * links on the front end from opt-in jump targets (`<section id>` elements, Query Loop blocks with
 * an HTML Anchor), removing the container if nothing qualifies. Scoped to pages/productions/events;
 * $attributes/$content/$block injected by WordPress.
 */

if ( ! is_singular(array('page', 'production', 'event'))) {
	return '';
}

$content_selector = isset($attributes['contentSelector']) && '' !== trim((string) $attributes['contentSelector'])
	? sanitize_text_field($attributes['contentSelector'])
	: 'main';

$nav_label = isset($attributes['navLabel']) && '' !== trim((string) $attributes['navLabel'])
	? sanitize_text_field($attributes['navLabel'])
	: __('On this page', 'theatrum-blocks');

$wrapper_attributes = get_block_wrapper_attributes(
    array(
	'class'                 => 'theatrum-page-nav',
	'aria-label'            => $nav_label,
	'data-content-selector' => $content_selector,
	// Hidden until view.js confirms there is at least one section to link to.
	'hidden'                => 'hidden',
    )
);

printf('<nav %s></nav>', wp_kses_data($wrapper_attributes));
