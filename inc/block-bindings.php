<?php

if (! defined('ABSPATH')) {
	exit;
}

/**
 * Binding source callback for chance/post-meta.
 *
 * Reads a meta value (ACF get_field or get_post_meta) for the current post
 * and returns a typed value based on which block attribute is being bound.
 *
 * Source args:
 *   key          (string, required) ACF field key or post meta key.
 *   format       (string, optional) PHP date format string — triggers date formatting.
 *   customFormat (string, optional) Used when format === 'custom'.
 *
 * @param array    $source_args    Args stored in metadata.bindings.[attr].args.
 * @param WP_Block $block_instance Block instance with context.
 * @param string   $attribute_name The block attribute being bound (id, url, href, content…).
 * @return mixed|null
 */
function chance_post_meta_binding_callback($source_args, $block_instance, $attribute_name)
{
	$post_id = isset($block_instance->context['postId'])
		? (int) $block_instance->context['postId']
		: (int) get_the_ID();

	// sanitize_key() lowercases, which silently breaks binding to any ACF/meta
	// key containing uppercase letters. Strip to the same allowed charset
	// without forcing case.
	$key = isset($source_args['key']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '', $source_args['key']) : '';

	if (! $post_id || ! $key) {
		return null;
	}

	// Try ACF first, fall back to raw post meta.
	$value = null;
	if (function_exists('get_field')) {
		$value = get_field($key, $post_id);
	}
	if ($value === null || $value === false || $value === '') {
		$value = get_post_meta($post_id, $key, true);
	}
	if ($value === null || $value === false || $value === '') {
		return null;
	}

	// --- id (core/image) — return integer attachment ID ---
	if ($attribute_name === 'id') {
		if (is_array($value) && isset($value['ID'])) {
			return (int) $value['ID'];
		}
		if (is_numeric($value)) {
			return (int) $value;
		}
		return null;
	}

	// --- url / href (core/button, core/embed, core/file) — return sanitized URL ---
	if ($attribute_name === 'url' || $attribute_name === 'href') {
		if (is_array($value) && isset($value['url'])) {
			return esc_url_raw($value['url']);
		}
		if (is_numeric($value)) {
			$url = wp_get_attachment_url((int) $value);
			return $url ? esc_url_raw($url) : null;
		}
		$sanitized = esc_url_raw((string) $value);
		return $sanitized ?: null;
	}

	// --- content (core/paragraph, core/heading) ---

	// Date formatting: when a format arg is present, parse the stored value as a date.
	$format        = $source_args['format']        ?? '';
	$custom_format = $source_args['customFormat']  ?? '';

	if ($format) {
		$actual_format = ($format === 'custom' && $custom_format) ? $custom_format : $format;
		// Strip any time component — ACF dates may be stored as Ymd or Y-m-d.
		$date_str  = preg_replace('/[\sT].*$/', '', trim((string) $value));
		$timestamp = function_exists('theatrum_parse_flexible_date')
			? theatrum_parse_flexible_date($date_str)
			: null;
		if (! $timestamp) {
			$timestamp = strtotime($date_str);
		}
		return ($timestamp) ? esc_html(wp_date($actual_format, $timestamp)) : null;
	}

	// Plain string fallback.
	if (is_array($value) || is_object($value)) {
		return null;
	}

	return esc_html((string) $value);
}

add_action('init', function () {
	if (! function_exists('register_block_bindings_source')) {
		return; // WP < 6.5 guard.
	}

	register_block_bindings_source('chance/post-meta', [
		'label'              => __('Post Meta', 'theatrum-blocks'),
		'get_value_callback' => 'chance_post_meta_binding_callback',
		'uses_context'       => ['postId'],
	]);
});
