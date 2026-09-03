<?php

if ( ! defined('ABSPATH')) {
	exit;
}

/**
 * Theatrum Blocks - Helper functions for date/time parsing and production data queries.
 *
 * @package Theatrum_Blocks
 */

/**
 * Allowlist gate: only options_/option_-prefixed names may be read via the site-option block (and its deprecated staff/board variations) and REST endpoints — blocks arbitrary wp_options rows (e.g. mailserver_pass) from edit_posts-gated Contributors/Authors.
 *
 * @param string $option_name Option name requested by the block/endpoint.
 *
 * @return bool True if the option name is allowed.
 */
function theatrum_is_allowed_settings_option($option_name) {
	return (bool) preg_match('/^options?_/', (string) $option_name);
}

/**
 * Sanitizes a PanelColorSettings picker value (hex, rgb()/hsl(), or var(--wp--preset--color--slug)) before it's written into an inline CSS custom property — sanitize_hex_color() alone would wrongly reject the latter two. Shared by theatrum/carousel's render.php and the is-style-ct-carousel render_block filter (inc/format-controls.php).
 *
 * @param mixed $value Raw attribute value to sanitize.
 * @return string Sanitized color value, or '' if not a safe shape.
 */
function theatrum_carousel_sanitize_color($value) {
	if ( ! is_string($value) || '' === trim($value)) {
		return '';
	}
	$value   = trim($value);
	$pattern = '/^(#[0-9a-fA-F]{3,8}|(?:rgba?|hsla?)\([0-9.,%\s]+\)|var\(--[a-zA-Z0-9-]+\))$/';
	return preg_match($pattern, $value) ? $value : '';
}

/**
 * Whether the current render is happening inside the block editor's preview
 * (the REST `block-renderer` endpoint Gutenberg uses for dynamic blocks),
 * as opposed to a real frontend page load.
 *
 * @return bool
 */
function theatrum_is_editor_render_context() {
	return defined('REST_REQUEST') && REST_REQUEST;
}

/**
 * Renders an empty, invisible marker in place of a value-less meta-* block instead of rendering nothing, so CSS can tell "empty" from "never here" — carries a shared `theatrum-meta-empty` class that `wp-blocks.scss` hides (and hides a grouped `.wp-block-heading` sibling via `:has()`). In the editor preview it shows the requested key in brackets; on the frontend it's always empty.
 *
 * @param string $tag                 Sanitized HTML tag name for the marker.
 * @param string $key                 Meta key being requested, shown as an editor-only placeholder.
 * @param array  $extra_wrapper_args  Extra args passed to get_block_wrapper_attributes(), e.g. ['class' => '...'].
 */
function theatrum_render_meta_empty_marker($tag, $key = '', $extra_wrapper_args = array()) {
	$extra_wrapper_args['class'] = trim('theatrum-meta-empty ' . ($extra_wrapper_args['class'] ?? ''));

	$inner = ($key !== '' && theatrum_is_editor_render_context())
		? '[' . esc_html($key) . ']'
		: '';

	printf(
		'<%1$s %2$s>%3$s</%1$s>',
		tag_escape( $tag ),
		wp_kses_data( get_block_wrapper_attributes($extra_wrapper_args) ),
		$inner // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $inner is esc_html() output or an empty string.
	);
}

/**
 * Decodes HTML entities in a meta value for editor/frontend display. esc_html() alone is a no-op here (it re-encodes straight quotes/ampersands right back), so only &, <, > are re-escaped — quotes are safe as literal chars in both React preview text and frontend HTML text nodes.
 *
 * @param mixed $value Raw value (string or castable to string).
 *
 * @return string
 */
function theatrum_decode_entities($value) {
	$decoded = html_entity_decode((string) $value, ENT_QUOTES, 'UTF-8');
	return htmlspecialchars($decoded, ENT_NOQUOTES, 'UTF-8');
}

/**
 * Normalizes a related-post meta value (raw ID, WP_Post, ACF Post Object array, or arrays of those) into a flat list of post IDs. Shared by meta-related's render.php and its REST endpoint so both resolve the same posts.
 *
 * @param mixed $meta_value Raw meta/ACF field value.
 *
 * @return int[] Ordered list of post IDs (may be empty).
 */
function theatrum_meta_related_collect_ids($meta_value) {
	if (empty($meta_value)) {
		return array();
	}

	// A single ACF Post Object array is associative with an 'ID' key — treat as one.
	if (is_array($meta_value) && isset($meta_value['ID'])) {
		$meta_value = array($meta_value);
	} elseif ( ! is_array($meta_value)) {
		// Wrap single scalar / WP_Post so we can iterate uniformly.
		$meta_value = array($meta_value);
	}

	$ids = array();
	foreach ($meta_value as $item) {
		if (is_a($item, 'WP_Post')) {
			$ids[] = $item->ID;
		} elseif (is_array($item) && isset($item['ID'])) {
			$ids[] = intval($item['ID']);
		} elseif (is_numeric($item)) {
			$ids[] = intval($item);
		}
	}

	return array_values(array_filter($ids));
}

/**
 * Gets a meta/ACF field value, preferring ACF's get_field() and falling back to get_post_meta(). Centralizes a pattern duplicated across meta-file/meta-image/meta-related/block-bindings/REST callbacks, two of which were missing the function_exists() guard (fatal without ACF active).
 *
 * @param int    $post_id Post ID.
 * @param string $key     Meta/ACF field key.
 *
 * @return mixed Field value (ACF-shaped array, scalar, etc.), or '' if unset.
 */
function theatrum_get_meta($post_id, $key) {
	$value = function_exists('get_field') ? get_field($key, $post_id) : null;
	if ($value === null || $value === false || $value === '') {
		$value = get_post_meta($post_id, $key, true);
	}
	return $value;
}

/**
 * Mirrors core/embed's aspect-ratio classname logic (getClassNames() in
 * @wordpress/block-library) so theatrum/meta-embed's "Resize for smaller
 * devices" toggle behaves exactly like the core Embed block's.
 *
 * @param int  $width           Embed width in px (from the oEmbed markup).
 * @param int  $height          Embed height in px (from the oEmbed markup).
 * @param bool $allow_responsive Whether responsive wrapping is enabled.
 *
 * @return string Space-separated "wp-embed-aspect-*  wp-has-aspect-ratio"
 *                classnames, or '' if not applicable.
 */
function theatrum_embed_aspect_ratio_classnames($width, $height, $allow_responsive = true) {
	if ( ! $allow_responsive || ! $width || ! $height) {
		return '';
	}

	$ratios = array(
		array('ratio' => 2.33, 'class' => 'wp-embed-aspect-21-9'),
		array('ratio' => 2, 'class' => 'wp-embed-aspect-18-9'),
		array('ratio' => 1.78, 'class' => 'wp-embed-aspect-16-9'),
		array('ratio' => 1.33, 'class' => 'wp-embed-aspect-4-3'),
		array('ratio' => 1, 'class' => 'wp-embed-aspect-1-1'),
		array('ratio' => 0.56, 'class' => 'wp-embed-aspect-9-16'),
		array('ratio' => 0.5, 'class' => 'wp-embed-aspect-1-2'),
	);

	$target       = $width / $height;
	$closest      = null;
	$closest_diff = null;

	foreach ($ratios as $candidate) {
		$diff = abs($candidate['ratio'] - $target);
		if (null === $closest_diff || $diff < $closest_diff) {
			$closest_diff = $diff;
			$closest      = $candidate;
		}
	}

	return $closest ? $closest['class'] . ' wp-has-aspect-ratio' : '';
}

/**
 * Resolve an ACF repeater subfield value to a display string.
 * Handles: string, int (post ID), WP_Post, ACF link array, array of IDs/Posts.
 *
 * Shared by meta-repeater's render.php (frontend) and the REST endpoint
 * (editor preview) so both produce the same output for a given field value.
 *
 * @param mixed $value Raw ACF subfield value.
 *
 * @return string
 */
function theatrum_repeater_resolve_value($value) {
	if (is_null($value) || $value === false || $value === '') {
		return '';
	}

	// WP_Post object — return title
	if ($value instanceof WP_Post) {
		return html_entity_decode(get_the_title($value), ENT_QUOTES, 'UTF-8');
	}

	// ACF link array: { url, title, target }
	if (is_array($value) && isset($value['url'])) {
		return isset($value['title']) && $value['title'] !== ''
			? html_entity_decode((string) $value['title'], ENT_QUOTES, 'UTF-8')
			: esc_url_raw($value['url']);
	}

	// Array of items (IDs, WP_Posts, or strings) — join them
	if (is_array($value)) {
		$parts = array();
		foreach ($value as $item) {
			if ($item instanceof WP_Post) {
				$parts[] = html_entity_decode(get_the_title($item), ENT_QUOTES, 'UTF-8');
			} elseif (is_numeric($item) && intval($item) > 0) {
				$title = get_the_title(intval($item));
				if ($title) {
					$parts[] = html_entity_decode($title, ENT_QUOTES, 'UTF-8');
				}
			} elseif (is_string($item)) {
				$parts[] = $item;
			}
		}
		return implode(', ', $parts);
	}

	// Numeric string that looks like a post ID — fetch title
	if (is_numeric($value) && intval($value) > 0) {
		$title = get_the_title(intval($value));
		if ($title) {
			return html_entity_decode($title, ENT_QUOTES, 'UTF-8');
		}
	}

	return html_entity_decode((string) $value, ENT_QUOTES, 'UTF-8');
}

/**
 * Escapes a resolved repeater subfield value while preserving manual `<br>` line breaks — editors type literal `<br />` in plain ACF text subfields (no per-row WYSIWYG) to split lines; esc_html() alone would print that literally.
 *
 * @param string $value Already-resolved (theatrum_repeater_resolve_value()) subfield text.
 */
function theatrum_repeater_escape_value($value) {
	return wp_kses((string) $value, array('br' => array()));
}

/**
 * Resolves a single value or array (post IDs, WP_Post, ACF post-object arrays, term IDs, WP_Term, or plain strings) into a normalized list of items — post/term references get a title+permalink, scalars pass through as plain text. A bare numeric ID resolves as a post first, falling back to a term lookup; explicit WP_Term/term arrays always resolve as terms.
 *
 * @param mixed $value Raw meta value.
 * @return array<int, array{id:int, title:string, url:string, type:string}>
 */
function theatrum_resolve_post_links($value) {
	if (is_null($value) || $value === false || $value === '') {
		return array();
	}

	// A single reference array (ACF post-object 'ID', or term array 'term_id') is treated as one item, not iterated.
	$is_single_ref_array = is_array($value) && (isset($value['ID']) || isset($value['term_id']));

	$items    = (is_array($value) && ! $is_single_ref_array) ? $value : array($value);
	$resolved = array();

	foreach ($items as $item) {
		$post_id = 0;
		$term    = null;

		if ($item instanceof WP_Post) {
			$post_id = $item->ID;
		} elseif ($item instanceof WP_Term) {
			$term = $item;
		} elseif (is_array($item) && isset($item['ID'])) {
			$post_id = intval($item['ID']);
		} elseif (is_array($item) && isset($item['term_id'])) {
			$term = get_term(intval($item['term_id']));
		} elseif (is_numeric($item) && intval($item) > 0) {
			$post_id = intval($item);
		}

		// Explicit term reference, or a post-object that no longer exists.
		if (is_null($term) && $post_id > 0 && ! get_post_status($post_id)) {
			// Numeric fallback: the ID isn't a valid post — try a term.
			$maybe_term = get_term($post_id);
			if ($maybe_term instanceof WP_Term) {
				$term    = $maybe_term;
				$post_id = 0;
			}
		}

		if ($post_id > 0 && get_post_status($post_id)) {
			$resolved[] = array(
				'id'    => $post_id,
				'title' => html_entity_decode(get_the_title($post_id), ENT_QUOTES, 'UTF-8'),
				'url'   => (string) get_permalink($post_id),
				'type'  => 'post',
			);
		} elseif ($term instanceof WP_Term) {
			$term_link  = get_term_link($term);
			$resolved[] = array(
				'id'    => $term->term_id,
				'title' => html_entity_decode($term->name, ENT_QUOTES, 'UTF-8'),
				'url'   => is_wp_error($term_link) ? '' : (string) $term_link,
				'type'  => 'term',
			);
		} elseif (is_scalar($item) && (string) $item !== '') {
			$resolved[] = array(
				'id'    => 0,
				'title' => html_entity_decode((string) $item, ENT_QUOTES, 'UTF-8'),
				'url'   => '',
				'type'  => 'scalar',
			);
		}
	}

	return $resolved;
}

/**
 * Validates a user-supplied tag/level name against an allowlist, falling back to a default. Centralizes validation duplicated across meta-field, site-option, meta-repeater, meta-related, meta-date, meta-time, and term-meta (some of which used bare tag_escape() alone — syntactically valid but not allowlisted).
 *
 * @param string   $tag     Requested tag/value.
 * @param string[] $allowed Allowed values.
 * @param string   $default Fallback when $tag isn't in $allowed.
 *
 * @return string
 */
function theatrum_sanitize_tag($tag, array $allowed, $default) {
	return in_array($tag, $allowed, true) ? $tag : $default;
}

/**
 * Parses a date string in many formats (Unix timestamp, YYYYMMDD, Y-m-d, m/d/Y, text dates, etc.) into a timestamp, caching results.
 */
function theatrum_parse_flexible_date($date_str) {
	if (empty($date_str)) {
		return null;
	}

	$date_str  = trim($date_str);
	$cache_key = 'ct_date_' . md5($date_str);
	$cached    = wp_cache_get($cache_key, 'ct_dates');

	// Sentinel 'none' marks a cached negative result — storing PHP `null` directly is indistinguishable from a cache miss on some persistent object-cache backends (both read back `false`), which made the negative cache a no-op.
	if ($cached === 'none') {
		return null;
	}
	if ($cached !== false) {
		return $cached;
	}

	$len = strlen($date_str);

	// Bail early on obviously invalid input
	if ($len < 4 || $len > 50) {
		wp_cache_set($cache_key, 'none', 'ct_dates', HOUR_IN_SECONDS);
		return null;
	}

	// Unix timestamp (10-13 digits)
	if ($len >= 10 && $len <= 13 && ctype_digit($date_str)) {
		$timestamp = (int) $date_str;
		$year      = (int) wp_date('Y', $timestamp);

		// Validate year is reasonable
		if ($year >= 1900 && $year <= 2100) {
			wp_cache_set($cache_key, $timestamp, 'ct_dates', HOUR_IN_SECONDS);
			return $timestamp;
		}
		wp_cache_set($cache_key, 'none', 'ct_dates', HOUR_IN_SECONDS);
		return null;
	}

	// YYYYMMDD format (8 digits, no separators)
	if ($len === 8 && ctype_digit($date_str)) {
		$year  = (int) substr($date_str, 0, 4);
		$month = (int) substr($date_str, 4, 2);
		$day   = (int) substr($date_str, 6, 2);

		if ($year >= 1900 && $year <= 2100 && $month >= 1 && $month <= 12 && $day >= 1 && $day <= 31) {
			// Get WordPress timezone
			$tz_string = wp_timezone_string();
			$tz        = new DateTimeZone($tz_string);

			$dt = DateTime::createFromFormat('Y-m-d', "{$year}-{$month}-{$day}", $tz);
			if ($dt !== false) {
				$result = $dt->getTimestamp();
				wp_cache_set($cache_key, $result, 'ct_dates', HOUR_IN_SECONDS);
				return $result;
			}
		}
		wp_cache_set($cache_key, 'none', 'ct_dates', HOUR_IN_SECONDS);
		return null;
	}

	// Check for separators to determine format family
	if (strpos($date_str, '-') !== false) {
		$formats = array('Y-m-d', 'm-d-Y', 'd-m-Y');
	} elseif (strpos($date_str, '/') !== false) {
		$formats = array('Y/m/d', 'm/d/Y', 'd/m/Y');
	} elseif (strpos($date_str, ',') !== false) {
		$formats = array('F j, Y', 'M j, Y');
	} else {
		$formats = array('j F Y', 'j M Y');
	}

	// Get WordPress timezone, with fallback to UTC
	try {
		$tz_string = wp_timezone_string();
		$tz        = new DateTimeZone($tz_string);
	} catch (Exception $e) {
		$tz = new DateTimeZone('UTC');
	}

	// Try only the likely formats
	foreach ($formats as $format) {
		try {
			$dt = DateTime::createFromFormat($format, $date_str, $tz);
			if ($dt !== false) {
				$year = (int) $dt->format('Y');
				if ($year >= 1900 && $year <= 2100) {
					$result = $dt->getTimestamp();
					wp_cache_set($cache_key, $result, 'ct_dates', HOUR_IN_SECONDS);
					return $result;
				}
			}
		} catch (Exception $e) {
			// Try next format
			continue;
		}
	}

	wp_cache_set($cache_key, 'none', 'ct_dates', HOUR_IN_SECONDS);
	return null;
}

/**
 * Parses a time-only string (17:30, 5:30 PM, 14:30:00, etc.) into today's timestamp at that time.
 */
function theatrum_parse_flexible_time($time_str) {
	if (empty($time_str)) {
		return null;
	}

	$time_str  = trim($time_str);
	$cache_key = 'ct_time_' . md5($time_str);
	$cached    = wp_cache_get($cache_key, 'ct_times');

	if ($cached !== false) {
		return $cached;
	}

	$tz_string = wp_timezone_string();
	$tz        = new DateTimeZone($tz_string);

	// Try common time formats
	$time_formats = array(
		'H:i:s',      // 14:30:00
		'H:i',        // 14:30
		'h:i:s A',    // 02:30:00 PM
		'h:i A',      // 02:30 PM
		'g:i:s A',    // 2:30:00 PM
		'g:i A',      // 2:30 PM
		'H:i:s a',    // 14:30:00 pm
		'H:i a',      // 14:30 pm
	);

	foreach ($time_formats as $format) {
		$dt = DateTime::createFromFormat($format, $time_str, $tz);
		if ($dt !== false) {
			$result = $dt->getTimestamp();
			wp_cache_set($cache_key, $result, 'ct_times', HOUR_IN_SECONDS);
			return $result;
		}
	}

	// Try datetime formats to extract time from full datetime strings
	$datetime_formats = array(
		'Y-m-d H:i:s',   // WordPress default, 24-hour with seconds
		'Y-m-d H:i',     // 24-hour, no seconds
		'Y-m-d h:i:s A', // 12-hour with seconds
		'Y-m-d h:i A',   // 12-hour, no seconds
	);

	foreach ($datetime_formats as $format) {
		$dt = DateTime::createFromFormat($format, $time_str, $tz);
		if ($dt !== false) {
			$result = $dt->getTimestamp();
			wp_cache_set($cache_key, $result, 'ct_times', HOUR_IN_SECONDS);
			return $result;
		}
	}

	wp_cache_set($cache_key, null, 'ct_times', HOUR_IN_SECONDS);
	return null;
}

/**
 * Gets the currently-running production for the season, or the next upcoming one if none are running.
 *
 * @return array|null Production object with: ID, title, featured_image, opening, closing
 *                    or null if none found
 */
function theatrum_get_current_production() {
	// Get current_season from wp_options
	$current_season = get_option('options_current_season');

	if (empty($current_season)) {
		return null;
	}

	$productions = theatrum_query_season_productions($current_season);

	if (empty($productions)) {
		return null;
	}

	$now = time();

	// First, try to find a production that is currently running.
	foreach ($productions as $production) {
		if ($production['opening_ts'] && $production['closing_ts']
			&& $production['opening_ts'] <= $now && $production['closing_ts'] >= $now
		) {
			return theatrum_build_production_data($production['post']);
		}
	}

	// Otherwise, the closest upcoming production (already sorted by opening ASC).
	foreach ($productions as $production) {
		if ($production['opening_ts'] && $production['opening_ts'] > $now) {
			return theatrum_build_production_data($production['post']);
		}
	}

	return null;
}

/**
 * Queries productions in a season/series, parsing opening/closing meta via theatrum_parse_flexible_date() instead of SQL meta_query type casting — stored values are a genuine mix of `Ymd` and `Y-m-d H:i:s`, so no single SQL DATE/DATETIME cast fits every row.
 *
 * @param int|string $season Season term ID or slug.
 *
 * @return array List of ['post' => WP_Post, 'opening_ts' => int|false, 'closing_ts' => int|false],
 *               sorted by opening_ts ascending.
 */
function theatrum_query_season_productions($season) {
	$args = array(
		'post_type'      => 'production',
		'posts_per_page' => -1,
		// phpcs:ignore WordPress.DB.SlowDBQuery -- bounded to a single season or production, and cached by the caller.
		'tax_query'      => array(
			array(
				'taxonomy' => 'series',
				'terms'    => array('main', 'holiday'),
				'operator' => 'IN',
				'field'    => 'slug',
			),
			array(
				'taxonomy' => 'season',
				'terms'    => array($season),
				'operator' => 'IN',
				'field'    => 'term_id',
			),
		),
	);

	$query = new WP_Query($args);
	$posts = $query->posts;
	wp_reset_postdata();

	$productions = array();
	foreach ($posts as $post) {
		$productions[] = array(
			'post'       => $post,
			'opening_ts' => theatrum_parse_flexible_date(get_post_meta($post->ID, 'opening', true)),
			'closing_ts' => theatrum_parse_flexible_date(get_post_meta($post->ID, 'closing', true)),
		);
	}

	usort(
        $productions,
        function ($a, $b) {
		return ($a['opening_ts'] ?: 0) <=> ($b['opening_ts'] ?: 0);
        }
    );

	return $productions;
}

/**
 * Gets the next production after the current one for the season.
 *
 * @return array|null Production object with: ID, title, featured_image, opening, closing
 *                    or null if none found
 */
function theatrum_get_next_production() {
	// Get current_season from wp_options
	$current_season = get_option('options_current_season');

	if (empty($current_season)) {
		return null;
	}

	$current_prod = theatrum_get_current_production();

	if ( ! $current_prod) {
		return null;
	}

	// Get the opening date of current production to find the next one after it.
	$current_opening = theatrum_parse_flexible_date($current_prod['opening']);
	$productions     = theatrum_query_season_productions($current_season);

	foreach ($productions as $production) {
		if ((int) $production['post']->ID === (int) $current_prod['ID']) {
			continue;
		}
		if ($production['opening_ts'] && $production['opening_ts'] > $current_opening) {
			return theatrum_build_production_data($production['post']);
		}
	}

	return null;
}

/**
 * Build production data array from post object
 *
 * @param WP_Post $post Post object
 *
 * @return array Production data with: ID, title, featured_image, featured_image_id, opening, closing, slug
 */
function theatrum_build_production_data($post) {
	$opening_str = get_post_meta($post->ID, 'opening', true);
	$closing_str = get_post_meta($post->ID, 'closing', true);

	$featured_image_id  = get_post_thumbnail_id($post->ID);
	$featured_image_url = $featured_image_id ? wp_get_attachment_url($featured_image_id) : null;

	return array(
		'ID'                 => $post->ID,
		'title'              => $post->post_title,
		'featured_image'     => $featured_image_url,
		'featured_image_id'  => $featured_image_id,
		'opening'            => $opening_str,
		'closing'            => $closing_str,
		'slug'               => $post->post_name,
		'url'                => get_permalink($post->ID),
	);
}

/**
 * Format production date from datetime string to readable string
 *
 * @param string $date Date string in Y-m-d H:i:s format
 * @param string $format PHP date format string (default: 'M j')
 *
 * @return string Formatted date or empty string if invalid
 */
function theatrum_format_production_date($date, $format = 'M j') {
	if (empty($date)) {
		return '';
	}

	$timestamp = strtotime($date);
	if ($timestamp !== false) {
		return wp_date($format, $timestamp);
	}

	return '';
}

/**
 * Constrains a nested query loop to the current taxonomy term. core/term-template (WP 6.9+) injects `termId`/`taxonomy` into context, but core/query only reads `templateSlug` — so a loop nested in a Terms Query → Term Template would otherwise show every item under every term; this adds a tax_query to fix that, inert unless genuinely nested in a term-template.
 *
 * @link https://developer.wordpress.org/reference/hooks/query_loop_block_query_vars/
 *
 * @param array    $query The query vars for the query loop.
 * @param WP_Block $block The query loop block instance.
 *
 * @return array Modified query vars.
 */
function theatrum_filter_query_loop_by_term($query, $block) {
	if (empty($block->context['termId']) || empty($block->context['taxonomy'])) {
		return $query;
	}

	$taxonomy  = $block->context['taxonomy'];
	$post_type = $query['post_type'] ?? 'post';

	// Only constrain when the taxonomy actually applies to this post type, leaving unrelated term-templates untouched.
	if ( ! is_object_in_taxonomy($post_type, $taxonomy)) {
		return $query;
	}

	if (empty($query['tax_query']) || ! is_array($query['tax_query'])) {
		// phpcs:ignore WordPress.DB.SlowDBQuery -- bounded to a single season or production, and cached by the caller.
		$query['tax_query'] = array();
	}

	$query['tax_query'][] = array(
		'taxonomy' => $taxonomy,
		'field'    => 'term_id',
		'terms'    => (int) $block->context['termId'],
	);

	return $query;
}
add_filter('query_loop_block_query_vars', 'theatrum_filter_query_loop_by_term', 10, 2);

/**
 * Applies the theatrum/query-filter block's "Sort Order" mode (a `?orderby=date-asc`-style GET param that isn't a real WP query var) to real orderby/order query vars, for any query loop that inherits the main query.
 *
 * @link https://developer.wordpress.org/reference/hooks/query_loop_block_query_vars/
 *
 * @param array $query The query vars for the query loop.
 *
 * @return array Modified query vars.
 */
function theatrum_filter_query_loop_by_orderby($query) {
	if (empty($_GET['orderby'])) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Front-end faceted filter/sort read from GET; no state change, value sanitized + unslashed.
		return $query;
	}

	$value = sanitize_text_field(wp_unslash($_GET['orderby'])); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Front-end faceted filter/sort read from GET; no state change, value sanitized + unslashed.

	$map = array(
		'date'       => array('orderby' => 'date', 'order' => 'DESC'),
		'date-asc'   => array('orderby' => 'date', 'order' => 'ASC'),
		'title'      => array('orderby' => 'title', 'order' => 'ASC'),
		'title-desc' => array('orderby' => 'title', 'order' => 'DESC'),
	);

	if ( ! isset($map[$value])) {
		return $query;
	}

	$query['orderby'] = $map[$value]['orderby'];
	$query['order']   = $map[$value]['order'];

	return $query;
}
add_filter('query_loop_block_query_vars', 'theatrum_filter_query_loop_by_orderby');

// wp_kses_post() has no <iframe>, so it silently stripped every oEmbed; this is post-kses plus the iframe attributes providers actually emit.
function theatrum_embed_allowed_html() {
	$allowed           = wp_kses_allowed_html('post');
	$allowed['iframe'] = array(
		'src' => true, 'width' => true, 'height' => true, 'title' => true, 'class' => true, 'style' => true,
		'frameborder' => true, 'allow' => true, 'allowfullscreen' => true, 'loading' => true,
		'referrerpolicy' => true, 'sandbox' => true,
	);
	return $allowed;
}
