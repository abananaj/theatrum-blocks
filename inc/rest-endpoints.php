<?php

/**
 * REST API endpoints for Theatrum Blocks.
 * Loaded at plugin init so routes are available for block editor requests.
 */

if (! defined('ABSPATH')) {
	exit;
}

/**
 * Permission callback for editor-level REST endpoints.
 *
 * @return bool True if current user can edit posts.
 */
function theatrum_editor_permission_check()
{
	return current_user_can('edit_posts');
}

/* -----------------------------------------------------------------------
 * Cover Card
 * -------------------------------------------------------------------- */

function register_cover_card_rest_endpoint()
{
	// Public by design — only returns already-public post data (title,
	// permalink, featured image, dates). If this callback is ever extended,
	// keep it that way; add a capability check before returning anything
	// non-public.
	register_rest_route(
		'chance/v1',
		'/cover-card/(?P<meta_key>[a-zA-Z0-9_-]+)',
		array(
			'methods'             => 'GET',
			'callback'            => 'theatrum_get_cover_card_rest_callback',
			'permission_callback' => '__return_true',
			'args'                => array(
				'meta_key' => array(
					'validate_callback' => function ($param) {
						return is_string($param);
					},
				),
			),
		)
	);
}
add_action('rest_api_init', 'register_cover_card_rest_endpoint');

function theatrum_get_cover_card_rest_callback($request)
{
	$meta_key        = $request->get_param('meta_key');
	$current_post_id = intval($request->get_param('current_post_id') ?? 0);

	if (! $meta_key) {
		return new WP_REST_Response(array('message' => 'No meta key provided'), 400);
	}

	if (is_numeric($meta_key)) {
		$post_id = intval($meta_key);
	} else {
		if ($current_post_id > 0) {
			$looked_up_post_id = get_post_meta($current_post_id, $meta_key, true);
			if ($looked_up_post_id) {
				$post_id = intval($looked_up_post_id);
			} else {
				return new WP_REST_Response(
					array('message' => 'Meta key "' . esc_attr($meta_key) . '" not found on post ' . $current_post_id),
					404
				);
			}
		} else {
			$args  = array(
				'post_type'      => 'any',
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'meta_query'     => array(
					array('key' => $meta_key, 'compare' => 'EXISTS'),
				),
			);
			$posts = get_posts($args);
			if (empty($posts)) {
				return new WP_REST_Response(
					array('message' => 'No post found with meta key: ' . esc_attr($meta_key)),
					404
				);
			}
			$post_id = $posts[0]->ID;
		}
	}

	$post = get_post($post_id);
	if (! $post || ! is_post_publicly_viewable($post)) {
		return new WP_REST_Response(array('message' => 'Post not found'), 404);
	}

	$featured_image_url = has_post_thumbnail($post->ID)
		? get_the_post_thumbnail_url($post->ID, 'full')
		: '';

	// Get opening and closing dates from post meta
	$opening = get_post_meta($post->ID, 'opening', true);
	$closing = get_post_meta($post->ID, 'closing', true);

	// Format dates using PHP format (M j = Jan 15)
	$formatted_opening = '';
	$formatted_closing = '';

	if ($opening) {
		$timestamp = theatrum_parse_flexible_date($opening);
		if (!$timestamp) {
			$timestamp = strtotime($opening);
		}
		if ($timestamp) {
			$formatted_opening = wp_date('M j', $timestamp);
		}
	}

	if ($closing) {
		$timestamp = theatrum_parse_flexible_date($closing);
		if (!$timestamp) {
			$timestamp = strtotime($closing);
		}
		if ($timestamp) {
			$formatted_closing = wp_date('M j', $timestamp);
		}
	}

	return new WP_REST_Response(array(
		'post_id'              => $post->ID,
		'post_type'            => $post->post_type,
		'title'                => $post->post_title,
		'featured_image'       => $featured_image_url,
		'permalink'            => get_permalink($post->ID),
		'opening'              => $opening ?: null,
		'closing'              => $closing ?: null,
		'formatted_opening'    => $formatted_opening ?: null,
		'formatted_closing'    => $formatted_closing ?: null,
	));
}

/* -----------------------------------------------------------------------
 * Meta Gallery
 * -------------------------------------------------------------------- */

function register_meta_gallery_rest_endpoint()
{
	register_rest_route('chance/v1', '/meta-gallery/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)', [
		'methods'             => 'GET',
		'callback'            => 'theatrum_get_meta_gallery_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
		'args' => [
			'post_id' => ['validate_callback' => function ($param) {
				return is_numeric($param);
			}],
			'key'     => ['sanitize_callback' => 'sanitize_key'],
		],
	]);
}
add_action('rest_api_init', 'register_meta_gallery_rest_endpoint');

function theatrum_get_meta_gallery_rest_callback($request)
{
	$post_id = intval($request->get_param('post_id'));
	$key     = sanitize_key($request->get_param('key'));

	if (!$post_id || !$key) {
		return new WP_REST_Response(['images' => []], 200);
	}

	$value = theatrum_get_meta($post_id, $key);

	if (empty($value) || !is_array($value)) {
		return new WP_REST_Response(['images' => []], 200);
	}

	$images = [];

	foreach ($value as $image) {
		if (is_array($image)) {
			$images[] = [
				'url'     => $image['url'] ?? '',
				'alt'     => $image['alt'] ?? '',
				'caption' => $image['caption'] ?? '',
				'id'      => $image['ID'] ?? 0,
			];
		} elseif (is_numeric($image)) {
			$attach_id = intval($image);
			$src = wp_get_attachment_image_src($attach_id, 'full');
			if ($src) {
				$images[] = [
					'url'     => $src[0],
					'alt'     => get_post_meta($attach_id, '_wp_attachment_image_alt', true),
					'caption' => wp_get_attachment_caption($attach_id),
					'id'      => $attach_id,
				];
			}
		} elseif (is_string($image) && !empty($image)) {
			$images[] = ['url' => esc_url_raw($image), 'alt' => '', 'caption' => '', 'id' => 0];
		}
	}

	return new WP_REST_Response(['images' => $images], 200);
}

/* -----------------------------------------------------------------------
 * Meta Image
 * -------------------------------------------------------------------- */

function register_meta_image_rest_endpoint()
{
	register_rest_route('chance/v1', '/meta-image/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)', [
		'methods'             => 'GET',
		'callback'            => 'theatrum_get_meta_image_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
		'args' => [
			'post_id' => ['validate_callback' => function ($param) {
				return is_numeric($param);
			}],
			'key'     => ['sanitize_callback' => 'sanitize_key'],
		],
	]);
}
add_action('rest_api_init', 'register_meta_image_rest_endpoint');

function theatrum_get_meta_image_rest_callback($request)
{
	$post_id = intval($request->get_param('post_id'));
	$key     = sanitize_key($request->get_param('key'));

	if (!$post_id || !$key) {
		return new WP_REST_Response(['url' => ''], 200);
	}

	$value = theatrum_get_meta($post_id, $key);

	if (empty($value)) {
		return new WP_REST_Response(['url' => ''], 200);
	}

	if (is_array($value)) {
		return new WP_REST_Response([
			'url'     => $value['url'] ?? '',
			'alt'     => $value['alt'] ?? '',
			'caption' => $value['caption'] ?? '',
			'id'      => $value['ID'] ?? 0,
		], 200);
	}

	if (is_numeric($value)) {
		$src = wp_get_attachment_image_src(intval($value), 'full');
		return new WP_REST_Response([
			'url'     => $src ? $src[0] : '',
			'alt'     => get_post_meta(intval($value), '_wp_attachment_image_alt', true),
			'caption' => wp_get_attachment_caption(intval($value)),
			'id'      => intval($value),
		], 200);
	}

	return new WP_REST_Response(['url' => esc_url_raw($value), 'alt' => '', 'caption' => '', 'id' => 0], 200);
}
