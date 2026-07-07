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
 * Meta Date
 * -------------------------------------------------------------------- */

function register_meta_date_rest_endpoint()
{
	register_rest_route('chance/v1', '/meta-date/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)/(?P<format>[^/]+)', array(
		'methods'             => 'GET',
		'callback'            => 'get_meta_date_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
	));
}
add_action('rest_api_init', 'register_meta_date_rest_endpoint');

function get_meta_date_rest_callback($request)
{
	$post_id = intval($request['post_id']);
	$key     = sanitize_text_field($request['key']);
	$format  = sanitize_text_field(urldecode($request['format']));

	$value = get_post_meta($post_id, $key, true);

	if (empty($value)) {
		return new WP_REST_Response(array('value' => "[{$key}]"), 200);
	}

	$date_only_value = preg_replace('/\s.*$/', '', $value);
	if (strlen($date_only_value) > 10) {
		$date_only_value = substr($date_only_value, 0, 10);
	}

	$timestamp = theatrum_parse_flexible_date($date_only_value);
	if (!$timestamp) {
		$timestamp = strtotime($date_only_value);
	}

	if (!$timestamp) {
		return new WP_REST_Response(array('value' => theatrum_decode_entities($value)), 200);
	}

	$display_value = wp_date($format, $timestamp);
	return new WP_REST_Response(array('value' => theatrum_decode_entities($display_value)), 200);
}

/* -----------------------------------------------------------------------
 * Meta Time
 * -------------------------------------------------------------------- */

function register_meta_time_rest_endpoint()
{
	register_rest_route('chance/v1', '/meta-time/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)/(?P<format>[^/]+)', array(
		'methods'             => 'GET',
		'callback'            => 'get_meta_time_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
	));
}
add_action('rest_api_init', 'register_meta_time_rest_endpoint');

function get_meta_time_rest_callback($request)
{
	$post_id = intval($request['post_id']);
	$key     = sanitize_text_field($request['key']);
	$format  = sanitize_text_field(urldecode($request['format']));

	$value = get_post_meta($post_id, $key, true);

	if (empty($value)) {
		return new WP_REST_Response(array('value' => "[{$key}]"), 200);
	}

	$timestamp = theatrum_parse_flexible_time($value);
	if (!$timestamp) {
		return new WP_REST_Response(array('value' => theatrum_decode_entities($value)), 200);
	}

	$display_value = wp_date($format, $timestamp);
	return new WP_REST_Response(array('value' => theatrum_decode_entities($display_value)), 200);
}

/* -----------------------------------------------------------------------
 * Meta Field (post-meta)
 * -------------------------------------------------------------------- */

function register_post_meta_field_rest_endpoint()
{
	register_rest_route('chance/v1', '/post-meta/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)', array(
		'methods'             => 'GET',
		'callback'            => 'get_post_meta_field_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
	));
}
add_action('rest_api_init', 'register_post_meta_field_rest_endpoint');

function get_post_meta_field_rest_callback($request)
{
	$post_id = intval($request['post_id']);
	$key     = sanitize_text_field($request['key']);

	$value = get_post_meta($post_id, $key, true);

	if ($value === '' || $value === false) {
		return new WP_REST_Response(array('value' => ''), 200);
	}

	if (is_array($value) || is_object($value)) {
		$value = json_encode($value);
	}

	return new WP_REST_Response(array('value' => theatrum_decode_entities($value)), 200);
}

/* -----------------------------------------------------------------------
 * Meta Repeater
 * -------------------------------------------------------------------- */

function register_meta_repeater_rest_endpoint()
{
	register_rest_route(
		'chance/v1',
		'/meta-repeater/(?P<post_id>\d+)/(?P<repeater_key>[a-zA-Z0-9_-]+)',
		array(
			'methods'             => 'GET',
			'callback'            => 'get_meta_repeater_rest_callback',
			'permission_callback' => 'theatrum_editor_permission_check',
		)
	);
}
add_action('rest_api_init', 'register_meta_repeater_rest_endpoint');

function get_meta_repeater_rest_callback($request)
{
	$post_id      = intval($request['post_id']);
	$repeater_key = sanitize_text_field($request['repeater_key']);

	if (! function_exists('get_field')) {
		return new WP_REST_Response(array('rows' => []), 200);
	}

	$rows = get_field($repeater_key, $post_id);

	if (empty($rows) || ! is_array($rows)) {
		return new WP_REST_Response(array('rows' => []), 200);
	}

	// Sanitize each row — resolve values with the same logic the frontend
	// render.php uses, so the editor preview matches actual output.
	$sanitized = array();
	foreach ($rows as $row) {
		if (! is_array($row)) {
			continue;
		}
		$clean = array();
		foreach ($row as $sub_key => $sub_val) {
			$clean[sanitize_key($sub_key)] = theatrum_repeater_resolve_value($sub_val);
		}
		$sanitized[] = $clean;
	}

	return new WP_REST_Response(array('rows' => $sanitized), 200);
}

/* -----------------------------------------------------------------------
 * Meta Button
 * -------------------------------------------------------------------- */

function register_meta_button_rest_endpoint()
{
	register_rest_route(
		'chance/v1',
		'/meta-button/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)',
		array(
			'methods'             => 'GET',
			'callback'            => 'get_meta_button_rest_callback',
			'permission_callback' => 'theatrum_editor_permission_check',
		)
	);
}
add_action('rest_api_init', 'register_meta_button_rest_endpoint');

function get_meta_button_rest_callback($request)
{
	$post_id = intval($request['post_id']);
	$key     = sanitize_text_field($request['key']);

	$url = get_post_meta($post_id, $key, true);

	if (empty($url)) {
		return new WP_REST_Response(array('value' => ''), 200);
	}

	$url = esc_url($url);
	if (empty($url)) {
		return new WP_REST_Response(array('value' => ''), 200);
	}

	return new WP_REST_Response(array('value' => $url), 200);
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

	$value = get_field($key, $post_id);
	if ($value === null || $value === false || $value === '') {
		$value = get_post_meta($post_id, $key, true);
	}

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

	$value = get_field($key, $post_id);
	if ($value === null || $value === false || $value === '') {
		$value = get_post_meta($post_id, $key, true);
	}

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

/* -----------------------------------------------------------------------
 * Meta Icon
 * -------------------------------------------------------------------- */

function register_meta_icon_rest_endpoint()
{
	register_rest_route('chance/v1', '/meta-icon/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)', [
		'methods'             => 'GET',
		'callback'            => 'theatrum_get_meta_icon_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
		'args' => [
			'post_id' => ['validate_callback' => function ($param) {
				return is_numeric($param);
			}],
			'key' => ['sanitize_callback' => 'sanitize_key'],
		],
	]);
}
add_action('rest_api_init', 'register_meta_icon_rest_endpoint');

function theatrum_get_meta_icon_rest_callback($request)
{
	$post_id = intval($request->get_param('post_id'));
	$key     = sanitize_key($request->get_param('key'));

	if (!$post_id || !$key) {
		return new WP_REST_Response(['type' => '', 'value' => '', 'url' => ''], 200);
	}

	$value = function_exists('get_field') ? get_field($key, $post_id) : null;
	if ($value === null || $value === false || $value === '') {
		$value = get_post_meta($post_id, $key, true);
	}

	if (empty($value)) {
		return new WP_REST_Response(['type' => '', 'value' => '', 'url' => ''], 200);
	}

	// Attachment ID
	if (is_numeric($value) && intval($value) > 0) {
		$attach_id = intval($value);
		$src       = wp_get_attachment_image_src($attach_id, 'full');
		if ($src) {
			return new WP_REST_Response(['type' => 'attachment', 'value' => $attach_id, 'url' => esc_url_raw($src[0])], 200);
		}
		return new WP_REST_Response(['type' => '', 'value' => '', 'url' => ''], 200);
	}

	// ACF file/image array
	if (is_array($value) && isset($value['url'])) {
		return new WP_REST_Response(['type' => 'url', 'value' => esc_url_raw($value['url']), 'url' => esc_url_raw($value['url'])], 200);
	}

	if (is_string($value)) {
		$trimmed = trim($value);

		// Plain URL
		if (filter_var($trimmed, FILTER_VALIDATE_URL)) {
			return new WP_REST_Response(['type' => 'url', 'value' => esc_url_raw($trimmed), 'url' => esc_url_raw($trimmed)], 200);
		}

		// Dashicon name (with or without "dashicons-" prefix)
		$dashicon_name = preg_replace('/^dashicons-/', '', $trimmed);
		if (preg_match('/^[a-z0-9_-]+$/', $dashicon_name)) {
			return new WP_REST_Response(['type' => 'dashicon', 'value' => $dashicon_name, 'url' => ''], 200);
		}
	}

	return new WP_REST_Response(['type' => '', 'value' => '', 'url' => ''], 200);
}

/* -----------------------------------------------------------------------
 * Board Member
 * -------------------------------------------------------------------- */

function register_board_member_rest_endpoint()
{
	register_rest_route('chance/v1', '/board-member/(?P<option_name>[a-zA-Z0-9_-]+)', array(
		'methods'             => 'GET',
		'callback'            => 'get_board_member_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
	));
}
add_action('rest_api_init', 'register_board_member_rest_endpoint');

function get_board_member_rest_callback($request)
{
	$option_name = sanitize_text_field($request['option_name']);

	if (! theatrum_is_allowed_settings_option($option_name)) {
		return new WP_REST_Response(array('value' => '', 'items' => array()), 200);
	}

	$value       = get_option($option_name);

	if ($value === false) {
		return new WP_REST_Response(array('value' => '', 'items' => array()), 200);
	}

	if (is_string($value) && is_serialized($value)) {
		$unserialized = unserialize($value, ['allowed_classes' => false]);
		if ($unserialized !== false) {
			$value = $unserialized;
		}
	}

	$pretty_option_name = '';
	$field_key          = get_option('_' . $option_name);

	if ($field_key && function_exists('acf_get_field')) {
		$field = acf_get_field($field_key);
		if ($field && isset($field['label'])) {
			$pretty_option_name = $field['label'];
		}
	}

	if (empty($pretty_option_name)) {
		$pretty_option_name = $option_name;
		if (strpos($pretty_option_name, 'options_board_') === 0) {
			$pretty_option_name = substr($pretty_option_name, 14);
		} elseif (strpos($pretty_option_name, 'option_board_') === 0) {
			$pretty_option_name = substr($pretty_option_name, 13);
		} elseif (strpos($pretty_option_name, 'options_') === 0) {
			$pretty_option_name = substr($pretty_option_name, 8);
		} elseif (strpos($pretty_option_name, 'option_') === 0) {
			$pretty_option_name = substr($pretty_option_name, 7);
		}
		$pretty_option_name = ucwords(str_replace('_', ' ', $pretty_option_name));
	}

	if (is_array($value)) {
		$post_ids = array_filter($value, function ($id) {
			return is_numeric($id) && !empty($id);
		});

		if (!empty($post_ids) && count($post_ids) === count($value)) {
			$items = array();
			foreach ($post_ids as $post_id) {
				$post_id         = (int) $post_id;
				$post_title      = get_the_title($post_id);
				$post_url        = get_permalink($post_id);
				$post_meta_title = get_post_meta($post_id, 'title', true);

				if (!empty($post_title)) {
					$items[] = array(
						'title'      => theatrum_decode_entities($post_title),
						'url'        => $post_url,
						'meta_title' => theatrum_decode_entities($post_meta_title),
						'position'   => $pretty_option_name,
					);
				}
			}
			return new WP_REST_Response(array('value' => '', 'items' => $items), 200);
		} else {
			$value = json_encode($value);
		}
	} elseif (is_object($value)) {
		$value = json_encode($value);
	}

	if (is_string($value)) {
		// Check if it's a single numeric post ID
		if (is_numeric($value) && !empty($value)) {
			$post_id = (int) $value;
			$post_title = get_the_title($post_id);
			$post_url = get_permalink($post_id);
			$post_meta_title = get_post_meta($post_id, 'title', true);

			if (!empty($post_title)) {
				return new WP_REST_Response(array(
					'value' => '',
					'items' => array(array(
						'title' => theatrum_decode_entities($post_title),
						'url' => $post_url,
						'meta_title' => theatrum_decode_entities($post_meta_title),
						'position' => $pretty_option_name,
					))
				), 200);
			}
		}
		$value = theatrum_decode_entities($value);
	}

	return new WP_REST_Response(array('value' => $value, 'items' => array()), 200);
}

function register_site_option_rest_endpoint()
{
	register_rest_route('chance/v1', '/site-option/(?P<option_name>[a-zA-Z0-9_-]+)', array(
		'methods'             => 'GET',
		'callback'            => 'get_site_option_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
	));
}
add_action('rest_api_init', 'register_site_option_rest_endpoint');

function get_site_option_rest_callback($request)
{
	$option_name = sanitize_text_field($request['option_name']);
	$meta_key    = sanitize_text_field($request->get_param('meta_key') ?? '');

	if (! theatrum_is_allowed_settings_option($option_name)) {
		return new WP_REST_Response(array('value' => ''), 200);
	}

	$value       = get_option($option_name);

	if ($value === false) {
		return new WP_REST_Response(array('value' => ''), 200);
	}

	if (is_string($value) && is_serialized($value)) {
		$unserialized = unserialize($value, ['allowed_classes' => false]);
		if ($unserialized !== false) {
			$value = $unserialized;
		}
	}

	// Resolve post references (single ID, array of IDs, WP_Post objects, or ACF
	// post-object arrays) to linked titles — same resolution the frontend uses.
	$links = theatrum_resolve_post_links($value);

	$has_post_links = false;
	foreach ($links as $link) {
		if ($link['id'] > 0) {
			$has_post_links = true;
			break;
		}
	}

	if ($has_post_links) {
		$items = array();
		foreach ($links as $link) {
			if ($link['id'] <= 0) {
				continue;
			}

			$display_text = $link['title'];
			if (!empty($meta_key)) {
				$meta_value = get_post_meta($link['id'], $meta_key, true);
				if (!empty($meta_value) && is_scalar($meta_value)) {
					$display_text = (string) $meta_value;
				}
			}

			$items[] = array(
				'title' => $display_text !== '' ? $display_text : 'Untitled',
				'url'   => $link['url'],
			);
		}
		return new WP_REST_Response(array('value' => '', 'items' => $items), 200);
	}

	if (is_array($value) || is_object($value)) {
		$value = json_encode($value);
	} else {
		$value = (string) $value;
	}

	$value = theatrum_decode_entities($value);
	return new WP_REST_Response(array('value' => $value), 200);
}

/* -----------------------------------------------------------------------
 * Staff Member
 * -------------------------------------------------------------------- */

function register_staff_member_rest_endpoint()
{
	register_rest_route('chance/v1', '/staff-member/(?P<option_name>[a-zA-Z0-9_-]+)', array(
		'methods'             => 'GET',
		'callback'            => 'get_staff_member_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
	));
}
add_action('rest_api_init', 'register_staff_member_rest_endpoint');

function get_staff_member_rest_callback($request)
{
	$option_name = sanitize_text_field($request['option_name']);

	if (! theatrum_is_allowed_settings_option($option_name)) {
		return new WP_REST_Response(array('value' => '', 'items' => array()), 200);
	}

	$value       = get_option($option_name);

	if ($value === false) {
		return new WP_REST_Response(array('value' => '', 'items' => array()), 200);
	}

	if (is_string($value) && is_serialized($value)) {
		$unserialized = unserialize($value, ['allowed_classes' => false]);
		if ($unserialized !== false) {
			$value = $unserialized;
		}
	}

	$pretty_option_name = '';
	$field_key          = get_option('_' . $option_name);

	if ($field_key && function_exists('acf_get_field')) {
		$field = acf_get_field($field_key);
		if ($field && isset($field['label'])) {
			$pretty_option_name = $field['label'];
		}
	}

	if (empty($pretty_option_name)) {
		$pretty_option_name = $option_name;
		if (strpos($pretty_option_name, 'options_staff_') === 0) {
			$pretty_option_name = substr($pretty_option_name, 14);
		} elseif (strpos($pretty_option_name, 'option_staff_') === 0) {
			$pretty_option_name = substr($pretty_option_name, 13);
		} elseif (strpos($pretty_option_name, 'options_') === 0) {
			$pretty_option_name = substr($pretty_option_name, 8);
		} elseif (strpos($pretty_option_name, 'option_') === 0) {
			$pretty_option_name = substr($pretty_option_name, 7);
		}
		$pretty_option_name = ucwords(str_replace('_', ' ', $pretty_option_name));
	}

	if (is_array($value)) {
		$post_ids = array_filter($value, function ($id) {
			return is_numeric($id) && !empty($id);
		});

		if (!empty($post_ids) && count($post_ids) === count($value)) {
			$items = array();
			foreach ($post_ids as $post_id) {
				$post_id         = (int) $post_id;
				$post_title      = get_the_title($post_id);
				$post_url        = get_permalink($post_id);
				$post_meta_title = get_post_meta($post_id, 'title', true);

				if (!empty($post_title)) {
					$items[] = array(
						'title'      => theatrum_decode_entities($post_title),
						'url'        => $post_url,
						'meta_title' => theatrum_decode_entities($post_meta_title),
						'position'   => $pretty_option_name,
					);
				}
			}
			return new WP_REST_Response(array('value' => '', 'items' => $items), 200);
		} else {
			$value = json_encode($value);
		}
	} elseif (is_object($value)) {
		$value = json_encode($value);
	}

	if (is_string($value)) {
		// Check if it's a single numeric post ID
		if (is_numeric($value) && !empty($value)) {
			$post_id = (int) $value;
			$post_title = get_the_title($post_id);
			$post_url = get_permalink($post_id);
			$post_meta_title = get_post_meta($post_id, 'title', true);

			if (!empty($post_title)) {
				return new WP_REST_Response(array(
					'value' => '',
					'items' => array(array(
						'title' => theatrum_decode_entities($post_title),
						'url' => $post_url,
						'meta_title' => theatrum_decode_entities($post_meta_title),
						'position' => $pretty_option_name,
					))
				), 200);
			}
		}
		$value = theatrum_decode_entities($value);
	}

	return new WP_REST_Response(array('value' => $value, 'items' => array()), 200);
}

/* -----------------------------------------------------------------------
 * Term Meta
 * -------------------------------------------------------------------- */

function register_term_meta_field_rest_endpoint()
{
	register_rest_route(
		'chance/v1',
		'/term-meta-field/(?P<term_id>\d+)/(?P<meta_key>[a-zA-Z0-9_-]+)',
		array(
			'methods'             => 'GET',
			'callback'            => 'get_term_meta_field_rest_callback',
			'permission_callback' => 'theatrum_editor_permission_check',
		)
	);
}
add_action('rest_api_init', 'register_term_meta_field_rest_endpoint');

function get_term_meta_field_rest_callback($request)
{
	$term_id  = intval($request['term_id']);
	$meta_key = sanitize_text_field($request['meta_key']);

	$value = get_term_meta($term_id, $meta_key, true);

	if (empty($value)) {
		return new WP_REST_Response(array('value' => '', 'items' => array()), 200);
	}

	// Resolve post IDs / post objects (single or array) to linked titles so the
	// editor preview matches the frontend render.php output.
	$links = theatrum_resolve_post_links($value);

	if (! empty($links)) {
		$titles = wp_list_pluck($links, 'title');
		return new WP_REST_Response(array(
			'value' => implode(', ', $titles),
			'items' => $links,
		), 200);
	}

	$plain = is_scalar($value) ? (string) $value : wp_json_encode($value);

	return new WP_REST_Response(array(
		'value' => theatrum_decode_entities($plain),
		'items' => array(),
	), 200);
}

/* -----------------------------------------------------------------------
 * Production Cast
 * -------------------------------------------------------------------- */

function register_production_cast_rest_endpoint()
{
	register_rest_route('chance/v1', '/production-cast/(?P<post_id>\d+)', array(
		'methods'             => 'GET',
		'callback'            => 'theatrum_get_production_cast_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
	));
}

add_action('rest_api_init', 'register_production_cast_rest_endpoint');

function theatrum_get_production_cast_rest_callback($request)
{
	$post_id = intval($request['post_id']);

	$args = array(
		'post_type'      => 'credit',
		'posts_per_page' => 200,
		'meta_query'     => array(
			'relation' => 'AND',
			array('key' => 'production', 'value' => $post_id, 'compare' => '='),
			array('key' => 'role-group', 'value' => 'actor', 'compare' => '='),
		),
		'orderby' => 'menu_order title',
		'order'   => 'ASC',
	);

	$query = new WP_Query($args);
	$cast  = array();

	while ($query->have_posts()) {
		$query->the_post();
		$credit_id = get_the_ID();
		$artist_id = get_post_meta($credit_id, 'artist', true);
		$role      = get_post_meta($credit_id, 'role', true);

		if ($artist_id) {
			$display_role = $role ?: get_post_meta($credit_id, 'role-group', true);
			$role_group   = get_post_meta($credit_id, 'role-group', true);
			$cast[]       = array(
				'id'               => $credit_id,
				'artist_title'     => get_the_title($artist_id),
				'artist_url'       => get_permalink($artist_id),
				'artist_thumbnail' => get_the_post_thumbnail_url($artist_id) ?: '',
				'role'             => $display_role,
				'role_group'       => $role_group,
			);
		}
	}

	wp_reset_postdata();
	return new WP_REST_Response(array('cast' => $cast), 200);
}

/* -----------------------------------------------------------------------
 * Meta Embed
 * -------------------------------------------------------------------- */

function register_meta_embed_rest_endpoint()
{
	register_rest_route('chance/v1', '/meta-embed/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)', [
		'methods'             => 'GET',
		'callback'            => 'theatrum_get_meta_embed_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
		'args' => [
			'post_id' => ['validate_callback' => function ($param) {
				return is_numeric($param);
			}],
			'key'     => ['sanitize_callback' => 'sanitize_key'],
		],
	]);
}
add_action('rest_api_init', 'register_meta_embed_rest_endpoint');

function theatrum_get_meta_embed_rest_callback($request)
{
	$post_id = intval($request->get_param('post_id'));
	$key     = sanitize_key($request->get_param('key'));

	if (!$post_id || !$key) {
		return new WP_REST_Response(['html' => ''], 200);
	}

	// Get the URL from meta or ACF
	$url = get_field($key, $post_id);
	if ($url === null || $url === false || $url === '') {
		$url = get_post_meta($post_id, $key, true);
	}

	if (empty($url) || !is_string($url)) {
		return new WP_REST_Response(['html' => ''], 200);
	}

	$url = esc_url_raw($url);
	if (empty($url)) {
		return new WP_REST_Response(['html' => ''], 200);
	}

	// Try oEmbed first
	$embed_html = wp_oembed_get($url);

	if ($embed_html) {
		return new WP_REST_Response(['html' => $embed_html], 200);
	}

	// Fallback to iframe embed for direct URLs
	$iframe_html = sprintf(
		'<iframe src="%s" width="100%%" height="400" style="border:0" allowfullscreen></iframe>',
		esc_url($url)
	);

	return new WP_REST_Response(['html' => $iframe_html], 200);
}

/* -----------------------------------------------------------------------
 * Meta Related
 * -------------------------------------------------------------------- */

function register_meta_related_rest_endpoint()
{
	register_rest_route('chance/v1', '/meta-related/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)', array(
		'methods'             => 'GET',
		'callback'            => 'get_meta_related_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
	));
}
add_action('rest_api_init', 'register_meta_related_rest_endpoint');

function get_meta_related_rest_callback($request)
{
	$post_id = intval($request['post_id']);
	$key     = sanitize_text_field($request['key']);

	// Empty payload keeps the single-post shape ('title'/'url') plus an empty list.
	$empty = array('title' => '', 'url' => '', 'posts' => array());

	if (!$post_id || !$key) {
		return new WP_REST_Response($empty, 200);
	}

	// Get meta value — supports ACF get_field returning Post Object, array, or raw ID
	$meta_value = false;
	if (function_exists('get_field')) {
		$meta_value = get_field($key, $post_id);
	}
	if ($meta_value === false || $meta_value === null || $meta_value === '') {
		$meta_value = get_post_meta($post_id, $key, true);
	}

	// Resolve to a flat list of post IDs (single value or an array of them)
	$related_post_ids = theatrum_meta_related_collect_ids($meta_value);

	if (empty($related_post_ids)) {
		return new WP_REST_Response($empty, 200);
	}

	$posts = array();
	foreach ($related_post_ids as $related_post_id) {
		$related_post = get_post($related_post_id);
		if (!$related_post) {
			continue;
		}
		$title = get_the_title($related_post);
		if (empty($title)) {
			continue;
		}
		$posts[] = array(
			'title' => theatrum_decode_entities($title),
			'url'   => get_permalink($related_post),
		);
	}

	if (empty($posts)) {
		return new WP_REST_Response($empty, 200);
	}

	// Include the first post at the top level for backward compatibility.
	return new WP_REST_Response(array(
		'title' => $posts[0]['title'],
		'url'   => $posts[0]['url'],
		'posts' => $posts,
	), 200);
}

/* -----------------------------------------------------------------------
 * Season Producer
 * -------------------------------------------------------------------- */

function register_season_producer_rest_endpoint()
{
	register_rest_route('chance/v1', '/season-producer/(?P<post_id>\d+)/(?P<meta_key>[a-zA-Z0-9_-]+)', array(
		'methods'             => 'GET',
		'callback'            => 'theatrum_get_season_producer_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
		'args'                => array(
			'post_id'  => array('validate_callback' => function ($param) {
				return is_numeric($param);
			}),
			'meta_key' => array('sanitize_callback' => 'sanitize_key'),
		),
	));
}
add_action('rest_api_init', 'register_season_producer_rest_endpoint');

function theatrum_get_season_producer_rest_callback($request)
{
	$post_id  = intval($request->get_param('post_id'));
	$meta_key = sanitize_key($request->get_param('meta_key'));

	if (!$post_id || !$meta_key) {
		return new WP_REST_Response(array('producers' => array()), 200);
	}

	// Get the season term for the post
	$terms = wp_get_post_terms($post_id, 'season');

	if (empty($terms) || is_wp_error($terms)) {
		return new WP_REST_Response(array('producers' => array()), 200);
	}

	$season_term = $terms[0];

	// Get field value from the season term (supports ACF)
	$field_value = false;
	if (function_exists('get_field')) {
		$field_value = get_field($meta_key, 'term_' . $season_term->term_id);
	}
	if ($field_value === false || $field_value === null || $field_value === '') {
		$field_value = get_term_meta($season_term->term_id, $meta_key, true);
	}

	if (empty($field_value)) {
		return new WP_REST_Response(array('producers' => array()), 200);
	}

	$items = is_array($field_value) ? $field_value : array($field_value);

	$producers = array();
	foreach ($items as $item) {
		$producer_post = null;
		if (is_a($item, 'WP_Post')) {
			$producer_post = $item;
		} elseif (is_array($item) && isset($item['ID'])) {
			$producer_post = get_post(intval($item['ID']));
		} elseif (is_numeric($item)) {
			$producer_post = get_post(intval($item));
		}

		if ($producer_post) {
			$producers[] = array(
				'id'    => $producer_post->ID,
				'title' => theatrum_decode_entities(get_the_title($producer_post)),
			);
		}
	}

	return new WP_REST_Response(array('producers' => $producers), 200);
}

/* -----------------------------------------------------------------------
 * Meta File
 * -------------------------------------------------------------------- */

function register_meta_file_rest_endpoint()
{
	register_rest_route('chance/v1', '/meta-file/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)', [
		'methods'             => 'GET',
		'callback'            => 'theatrum_get_meta_file_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
		'args' => [
			'post_id' => ['validate_callback' => function ($param) {
				return is_numeric($param);
			}],
			'key'     => ['sanitize_callback' => 'sanitize_key'],
		],
	]);
}
add_action('rest_api_init', 'register_meta_file_rest_endpoint');

function theatrum_get_meta_file_rest_callback($request)
{
	$post_id = intval($request->get_param('post_id'));
	$key     = sanitize_key($request->get_param('key'));

	if (!$post_id || !$key) {
		return new WP_REST_Response(['url' => ''], 200);
	}

	$value = get_field($key, $post_id);
	if ($value === null || $value === false || $value === '') {
		$value = get_post_meta($post_id, $key, true);
	}

	if (empty($value)) {
		return new WP_REST_Response(['url' => ''], 200);
	}

	$file_url = '';
	$file_name = '';
	$attach_id = 0;

	if (is_array($value)) {
		// ACF file field array format: { ID, url, title, filename, ... }
		$file_url   = $value['url'] ?? '';
		$file_name  = $value['title'] ?? $value['filename'] ?? '';
		$attach_id  = $value['ID'] ?? 0;
	} elseif (is_numeric($value)) {
		// Attachment ID
		$attach_id = intval($value);
		$file_url  = wp_get_attachment_url($attach_id);
		$file_name = get_the_title($attach_id);
	} elseif (is_string($value)) {
		// Direct URL
		$file_url = $value;
		$file_name = basename($file_url);
	}

	return new WP_REST_Response([
		'url'      => esc_url($file_url),
		'name'     => sanitize_text_field($file_name),
		'id'       => $attach_id,
	], 200);
}

/* -----------------------------------------------------------------------
 * Production Quotes
 * -------------------------------------------------------------------- */

function register_production_quotes_rest_endpoint()
{
	register_rest_route('chance/v1', '/production-quotes/(?P<post_id>\d+)', array(
		'methods'             => 'GET',
		'callback'            => 'theatrum_get_production_quotes_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
		'args'                => array(
			'post_id' => array('validate_callback' => function ($param) {
				return is_numeric($param);
			}),
		),
	));
}
add_action('rest_api_init', 'register_production_quotes_rest_endpoint');

function theatrum_get_production_quotes_rest_callback($request)
{
	$post_id = intval($request->get_param('post_id'));

	if (!$post_id) {
		return new WP_REST_Response(array('quotes' => array()), 200);
	}

	if (!function_exists('get_field')) {
		return new WP_REST_Response(array('quotes' => array()), 200);
	}

	$rows = get_field('quotes', $post_id);

	if (empty($rows) || !is_array($rows)) {
		return new WP_REST_Response(array('quotes' => array()), 200);
	}

	$quotes = array();
	foreach ($rows as $row) {
		$quote_text    = isset($row['quote-text']) ? wp_kses_post($row['quote-text']) : '';
		$source        = isset($row['quote-cite']) ? sanitize_text_field($row['quote-cite']) : '';
		$quote_link_id = isset($row['quote-link']) ? $row['quote-link'] : '';
		$link_url      = '';

		if (!$quote_text) {
			continue;
		}

		// Resolve quote-link to a permalink — ACF may return WP_Post, array, or raw ID
		if ($quote_link_id) {
			$resolved_id = 0;
			if (is_a($quote_link_id, 'WP_Post')) {
				$resolved_id = $quote_link_id->ID;
			} elseif (is_array($quote_link_id) && isset($quote_link_id['ID'])) {
				$resolved_id = intval($quote_link_id['ID']);
			} elseif (is_numeric($quote_link_id)) {
				$resolved_id = intval($quote_link_id);
			}
			if ($resolved_id) {
				$link_url = get_permalink($resolved_id) ?: '';
			}
		}

		$quotes[] = array(
			'quote_text' => $quote_text,
			'source'     => $source,
			'link_url'   => $link_url ? esc_url($link_url) : '',
		);
	}

	return new WP_REST_Response(array('quotes' => $quotes), 200);
}

/* -----------------------------------------------------------------------
 * Production Performances
 * -------------------------------------------------------------------- */

function register_production_performances_rest_endpoint()
{
	register_rest_route('chance/v1', '/production-performances/(?P<post_id>\d+)', array(
		'methods'             => 'GET',
		'callback'            => 'get_production_performances_rest_callback',
		'permission_callback' => 'theatrum_editor_permission_check',
	));
}
add_action('rest_api_init', 'register_production_performances_rest_endpoint');

function get_production_performances_rest_callback($request)
{
	$post_id = intval($request['post_id']);

	if (!$post_id) {
		return new WP_REST_Response(array('performances' => array()), 200);
	}

	if (!function_exists('get_field')) {
		return new WP_REST_Response(array('performances' => array()), 200);
	}

	$rows = get_field('performances', $post_id);

	if (empty($rows) || !is_array($rows)) {
		return new WP_REST_Response(array('performances' => array()), 200);
	}

	// Today at midnight (start of day) in the site timezone.
	$today_ts = (new DateTimeImmutable('today', wp_timezone()))->getTimestamp();

	/**
	 * Parse a raw ACF date value to a Unix timestamp.
	 * Handles Ymd (20260501) and Y-m-d (2026-05-01) formats.
	 */
	$parse_date = function ($raw) {
		if (empty($raw) || !is_string($raw)) {
			return false;
		}
		// Strip any time component.
		$date_only = preg_replace('/[\sT].*$/', '', trim($raw));

		if (function_exists('theatrum_parse_flexible_date')) {
			$ts = theatrum_parse_flexible_date($date_only);
			if ($ts) {
				return $ts;
			}
		}

		// Ymd → Y-m-d
		if (preg_match('/^\d{8}$/', $date_only)) {
			$date_only = substr($date_only, 0, 4) . '-' . substr($date_only, 4, 2) . '-' . substr($date_only, 6, 2);
		}

		return strtotime($date_only);
	};

	/**
	 * Parse a raw ACF time value to a Unix timestamp.
	 * Handles H:i:s and H:i formats.
	 */
	$parse_time = function ($raw) {
		if (empty($raw) || !is_string($raw)) {
			return false;
		}

		if (function_exists('theatrum_parse_flexible_time')) {
			$ts = theatrum_parse_flexible_time($raw);
			if ($ts) {
				return $ts;
			}
		}

		return strtotime(trim($raw));
	};

	// Filter rows to upcoming (today or later) and attach parsed timestamp.
	$upcoming = array();
	foreach ($rows as $row) {
		if (!is_array($row)) {
			continue;
		}
		if (!empty($row['hide'])) {
			continue;
		}
		$ts = $parse_date($row['date'] ?? '');
		if (false === $ts || $ts < $today_ts) {
			continue;
		}
		$upcoming[] = array(
			'ts'   => $ts,
			'date' => $row['date'] ?? '',
			'time' => $row['time'] ?? '',
			'note' => $row['note'] ?? '',
		);
	}

	if (empty($upcoming)) {
		return new WP_REST_Response(array('performances' => array()), 200);
	}

	// Sort ascending by date.
	usort($upcoming, fn($a, $b) => $a['ts'] - $b['ts']);

	// Take the next 5.
	$upcoming = array_slice($upcoming, 0, 5);

	// Format for response
	$formatted = array();
	foreach ($upcoming as $perf) {
		$date_ts      = $perf['ts'];
		$display_date = $date_ts ? wp_date('D M jS', $date_ts) : esc_html($perf['date']);
		$time_ts      = $parse_time($perf['time']);
		$display_time = $time_ts ? wp_date('g:i A', $time_ts) : esc_html($perf['time']);
		$note         = sanitize_text_field($perf['note']);

		$formatted[] = array(
			'date' => $display_date,
			'time' => $display_time,
			'note' => $note,
		);
	}

	return new WP_REST_Response(array('performances' => $formatted), 200);
}
