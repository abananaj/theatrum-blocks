<?php

if (! defined('ABSPATH')) {
	exit;
}

/**
 * Theatrum Blocks - Helper functions for date/time parsing and production data queries.
 *
 * @package Theatrum_Blocks
 */

/**
 * Whether an option name is safe to expose through the board-member,
 * staff-member, and site-option blocks/endpoints.
 *
 * These blocks are designed to surface ACF Options Page fields, which are
 * always stored with an `options_`/`option_` prefix. Requiring that prefix
 * keeps the blocks working for their intended purpose while blocking access
 * to arbitrary wp_options rows (e.g. `mailserver_pass`, other plugins'
 * API keys) that Contributors/Authors could otherwise read via these
 * `edit_posts`-gated endpoints.
 *
 * @param string $option_name Option name requested by the block/endpoint.
 *
 * @return bool True if the option name is allowed.
 */
function theatrum_is_allowed_settings_option($option_name)
{
	return (bool) preg_match('/^options?_/', (string) $option_name);
}

/**
 * Decode HTML entities in a meta value for display in the block editor
 * (REST previews, block bindings) and on the frontend.
 *
 * esc_html() is the wrong tool here: it re-encodes straight quotes/ampersands
 * right back into entities (&#039;, &amp;), so esc_html(html_entity_decode($v))
 * is a no-op round-trip for anything but curly-quote-style entities. These
 * values are consumed either as plain text (React preview strings, which
 * escape on render) or dropped into an HTML text node (frontend), so only
 * &, <, > need re-escaping — quotes are safe as literal characters in both.
 *
 * @param mixed $value Raw value (string or castable to string).
 *
 * @return string
 */
function theatrum_decode_entities($value)
{
	$decoded = html_entity_decode((string) $value, ENT_QUOTES, 'UTF-8');
	return htmlspecialchars($decoded, ENT_NOQUOTES, 'UTF-8');
}

/**
 * Normalize a related-post meta value into a flat list of post IDs.
 *
 * Handles the same value shapes the meta-related block already supported for a
 * single value — raw post ID, WP_Post, ACF Post Object array — and extends them
 * to arrays of any of those (ACF relationship / multiple post object fields).
 *
 * Shared by meta-related's render.php (frontend) and the REST endpoint (editor
 * preview) so both resolve the same posts for a given field value.
 *
 * @param mixed $meta_value Raw meta/ACF field value.
 *
 * @return int[] Ordered list of post IDs (may be empty).
 */
function theatrum_meta_related_collect_ids($meta_value)
{
	if (empty($meta_value)) {
		return array();
	}

	// A single ACF Post Object array is associative with an 'ID' key — treat as one.
	if (is_array($meta_value) && isset($meta_value['ID'])) {
		$meta_value = array($meta_value);
	} elseif (!is_array($meta_value)) {
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
 * Get a meta/ACF field value for a post, preferring ACF's get_field() when
 * active and falling back to get_post_meta().
 *
 * Centralizes a pattern that was duplicated (with two call sites missing the
 * function_exists() guard, which would fatal on a site without ACF active)
 * across meta-file, meta-image, meta-related, block-bindings, and several
 * REST endpoint callbacks.
 *
 * @param int    $post_id Post ID.
 * @param string $key     Meta/ACF field key.
 *
 * @return mixed Field value (ACF-shaped array, scalar, etc.), or '' if unset.
 */
function theatrum_get_meta($post_id, $key)
{
	$value = function_exists('get_field') ? get_field($key, $post_id) : null;
	if ($value === null || $value === false || $value === '') {
		$value = get_post_meta($post_id, $key, true);
	}
	return $value;
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
function theatrum_repeater_resolve_value($value)
{
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
 * Resolve a meta value into a list of displayable items.
 *
 * Accepts a single value or an array of values (post IDs, WP_Post objects,
 * ACF post-object arrays, term IDs, WP_Term objects, or plain strings) and
 * returns a normalized list of items. Post/term references resolve to a title
 * + permalink so callers can render them as links; non-reference scalars pass
 * through as plain text (empty url).
 *
 * A bare numeric ID is resolved as a post first; if it is not a valid post it
 * falls back to a term lookup. Explicit WP_Term objects / term arrays always
 * resolve as terms.
 *
 * @param mixed $value Raw meta value.
 * @return array<int, array{id:int, title:string, url:string, type:string}>
 */
function theatrum_resolve_post_links($value)
{
	if (is_null($value) || $value === false || $value === '') {
		return array();
	}

	// A single reference array (ACF post-object with 'ID', or a term array with
	// 'term_id') should be treated as one item, not iterated as a list.
	$is_single_ref_array = is_array($value) && (isset($value['ID']) || isset($value['term_id']));

	$items = (is_array($value) && ! $is_single_ref_array) ? $value : array($value);
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
			$term_link = get_term_link($term);
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
 * Validate a user-supplied tag/level name against an allowlist, falling back
 * to a default when it isn't allowed.
 *
 * Centralizes a validation block duplicated (with an inconsistent mix of
 * strict/loose in_array() comparisons, and three call sites that used bare
 * tag_escape() instead of an allowlist at all — which only guarantees a
 * syntactically valid tag name, not one from a specific safe set) across
 * meta-field, site-option, meta-repeater, meta-related, meta-date, meta-time,
 * and term-meta.
 *
 * @param string   $tag     Requested tag/value.
 * @param string[] $allowed Allowed values.
 * @param string   $default Fallback when $tag isn't in $allowed.
 *
 * @return string
 */
function theatrum_sanitize_tag($tag, array $allowed, $default)
{
	return in_array($tag, $allowed, true) ? $tag : $default;
}

/**
 * Parse dates in multiple formats and return timestamp
 * Caches results to avoid redundant parsing
 * Handles: Unix timestamps, YYYYMMDD, YYYY-MM-DD, MM/DD/YYYY, text dates, etc.
 */
function theatrum_parse_flexible_date($date_str)
{
	if (empty($date_str)) {
		return null;
	}

	$date_str = trim($date_str);
	$cache_key = 'ct_date_' . md5($date_str);
	$cached = wp_cache_get($cache_key, 'ct_dates');

	// A sentinel ('none') marks a cached negative result. Storing PHP `null`
	// directly doesn't survive round-tripping through every persistent
	// object-cache backend distinguishably from a cache miss (both can read
	// back as `false`), which made the negative cache a no-op.
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
		$year = (int) wp_date('Y', $timestamp);

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
		$year = (int) substr($date_str, 0, 4);
		$month = (int) substr($date_str, 4, 2);
		$day = (int) substr($date_str, 6, 2);

		if ($year >= 1900 && $year <= 2100 && $month >= 1 && $month <= 12 && $day >= 1 && $day <= 31) {
			// Get WordPress timezone
			$tz_string = wp_timezone_string();
			$tz = new DateTimeZone($tz_string);

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
		$tz = new DateTimeZone($tz_string);
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
 * Parse time-only strings and return timestamp for today at that time
 * Handles formats like: 17:30, 5:30 PM, 5:30:45 PM, 14:30:00, etc.
 */
function theatrum_parse_flexible_time($time_str)
{
	if (empty($time_str)) {
		return null;
	}

	$time_str = trim($time_str);
	$cache_key = 'ct_time_' . md5($time_str);
	$cached = wp_cache_get($cache_key, 'ct_times');

	if ($cached !== false) {
		return $cached;
	}

	$tz_string = wp_timezone_string();
	$tz = new DateTimeZone($tz_string);

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
		'Y-m-d H:i:s',   // 2026-01-01 14:30:00 (WordPress default)
		'Y-m-d H:i',     // 2026-01-01 14:30
		'Y-m-d h:i:s A', // 2026-01-01 02:30:00 PM
		'Y-m-d h:i A',   // 2026-01-01 02:30 PM
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
 * Get current production for the season
 *
 * Retrieves a single production that is either currently running, or if none are running,
 * the next upcoming production closest to today.
 *
 * @return array|null Production object with: ID, title, featured_image, opening, closing
 *                    or null if none found
 */
function chance_get_current_production()
{
	// Get current_season from wp_options
	$current_season = get_option('options_current_season');

	if (empty($current_season)) {
		return null;
	}

	$productions = chance_query_season_productions($current_season);

	if (empty($productions)) {
		return null;
	}

	$now = time();

	// First, try to find a production that is currently running.
	foreach ($productions as $production) {
		if ($production['opening_ts'] && $production['closing_ts']
			&& $production['opening_ts'] <= $now && $production['closing_ts'] >= $now
		) {
			return chance_build_production_data($production['post']);
		}
	}

	// Otherwise, the closest upcoming production (already sorted by opening ASC).
	foreach ($productions as $production) {
		if ($production['opening_ts'] && $production['opening_ts'] > $now) {
			return chance_build_production_data($production['post']);
		}
	}

	return null;
}

/**
 * Query productions in a season/series, parsing opening/closing meta with
 * theatrum_parse_flexible_date() rather than relying on SQL meta_query type
 * casting — the stored opening/closing values are a genuine mix of `Ymd`
 * and `Y-m-d H:i:s` formats, so no single SQL DATE/DATETIME cast is correct
 * for every row.
 *
 * @param int|string $season Season term ID or slug.
 *
 * @return array List of ['post' => WP_Post, 'opening_ts' => int|false, 'closing_ts' => int|false],
 *               sorted by opening_ts ascending.
 */
function chance_query_season_productions($season)
{
	$args = array(
		'post_type'      => 'production',
		'posts_per_page' => -1,
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

	usort($productions, function ($a, $b) {
		return ($a['opening_ts'] ?: 0) <=> ($b['opening_ts'] ?: 0);
	});

	return $productions;
}

/**
 * Get next production for the season
 *
 * Retrieves the next production after the current one.
 *
 * @return array|null Production object with: ID, title, featured_image, opening, closing
 *                    or null if none found
 */
function chance_get_next_production()
{
	// Get current_season from wp_options
	$current_season = get_option('options_current_season');

	if (empty($current_season)) {
		return null;
	}

	$current_prod = chance_get_current_production();

	if (!$current_prod) {
		return null;
	}

	// Get the opening date of current production to find the next one after it.
	$current_opening = theatrum_parse_flexible_date($current_prod['opening']);
	$productions      = chance_query_season_productions($current_season);

	foreach ($productions as $production) {
		if ((int) $production['post']->ID === (int) $current_prod['ID']) {
			continue;
		}
		if ($production['opening_ts'] && $production['opening_ts'] > $current_opening) {
			return chance_build_production_data($production['post']);
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
function chance_build_production_data($post)
{
	$opening_str = get_post_meta($post->ID, 'opening', true);
	$closing_str = get_post_meta($post->ID, 'closing', true);

	$featured_image_id = get_post_thumbnail_id($post->ID);
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
function chance_format_production_date($date, $format = 'M j')
{
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
 * Constrain a nested query loop to the current taxonomy term.
 *
 * core/term-template (WP 6.9+) injects `termId` and `taxonomy` into the block
 * context of each term it iterates. core/query only reads `templateSlug`, so a
 * Supporter Loop nested inside a Terms Query → Term Template has no idea which
 * term it is rendering under and shows every supporter under every level.
 *
 * This bridges that gap: when a query loop is rendered inside a term-template,
 * add a tax_query limiting its posts to the current term. The termId/taxonomy
 * guard means this is inert for every other query loop on the site — it only
 * fires when genuinely nested in a term-template.
 *
 * @link https://developer.wordpress.org/reference/hooks/query_loop_block_query_vars/
 *
 * @param array    $query The query vars for the query loop.
 * @param WP_Block $block The query loop block instance.
 *
 * @return array Modified query vars.
 */
function theatrum_filter_query_loop_by_term($query, $block)
{
	if (empty($block->context['termId']) || empty($block->context['taxonomy'])) {
		return $query;
	}

	$taxonomy  = $block->context['taxonomy'];
	$post_type = $query['post_type'] ?? 'post';

	// Only constrain when the taxonomy actually applies to this post type, so a
	// loop nested in an unrelated term-template is left untouched.
	if (! is_object_in_taxonomy($post_type, $taxonomy)) {
		return $query;
	}

	if (empty($query['tax_query']) || ! is_array($query['tax_query'])) {
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
 * Apply the chance/query-filter block's "Sort Order" mode to query loops.
 *
 * The query-filter block's orderby mode writes an `?orderby=` GET param with
 * values like `date-asc` / `title-desc`, but those aren't real WP query vars
 * and nothing previously read them — the control changed the URL but had no
 * effect on results. This maps the sanitized GET value to real orderby/order
 * query vars for any query loop that inherits the main query, matching the
 * same "inheriting query loop" limitation the taxonomy filter mode already has.
 *
 * @link https://developer.wordpress.org/reference/hooks/query_loop_block_query_vars/
 *
 * @param array $query The query vars for the query loop.
 *
 * @return array Modified query vars.
 */
function theatrum_filter_query_loop_by_orderby($query)
{
	if (empty($_GET['orderby'])) {
		return $query;
	}

	$value = sanitize_text_field(wp_unslash($_GET['orderby']));

	$map = array(
		'date'       => array('orderby' => 'date', 'order' => 'DESC'),
		'date-asc'   => array('orderby' => 'date', 'order' => 'ASC'),
		'title'      => array('orderby' => 'title', 'order' => 'ASC'),
		'title-desc' => array('orderby' => 'title', 'order' => 'DESC'),
	);

	if (! isset($map[$value])) {
		return $query;
	}

	$query['orderby'] = $map[$value]['orderby'];
	$query['order']   = $map[$value]['order'];

	return $query;
}
add_filter('query_loop_block_query_vars', 'theatrum_filter_query_loop_by_orderby');
