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

	if ($cached !== false) {
		return $cached;
	}

	$len = strlen($date_str);

	// Bail early on obviously invalid input
	if ($len < 4 || $len > 50) {
		wp_cache_set($cache_key, null, 'ct_dates', HOUR_IN_SECONDS);
		return null;
	}

	// Unix timestamp (10-13 digits)
	if ($len >= 10 && $len <= 13 && ctype_digit($date_str)) {
		$timestamp = (int) $date_str;
		$year = (int) date('Y', $timestamp);

		// Validate year is reasonable
		if ($year >= 1900 && $year <= 2100) {
			wp_cache_set($cache_key, $timestamp, 'ct_dates', HOUR_IN_SECONDS);
			return $timestamp;
		}
		wp_cache_set($cache_key, null, 'ct_dates', HOUR_IN_SECONDS);
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
		wp_cache_set($cache_key, null, 'ct_dates', HOUR_IN_SECONDS);
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

	wp_cache_set($cache_key, null, 'ct_dates', HOUR_IN_SECONDS);
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

	$today_time = time();

	// First, try to find a production that is currently running
	$args = array(
		'post_type'      => 'production',
		'posts_per_page' => 1,
		'tax_query'      => array(
			array(
				'taxonomy' => 'series',
				'terms'    => array('main', 'holiday'),
				'operator' => 'IN',
				'field'    => 'slug',
			),
			array(
				'taxonomy' => 'season',
				'terms'    => array($current_season),
				'operator' => 'IN',
				'field'    => 'term_id',
			),
		),
		'meta_query'     => array(
			array(
				'key'     => 'opening',
				'value'   => $today_time,
				'compare' => '<=',
				'type'    => 'DATETIME',
			),
			array(
				'key'     => 'closing',
				'value'   => $today_time,
				'compare' => '>=',
				'type'    => 'DATETIME',
			),
		),
	);

	$query = new WP_Query($args);

	if ($query->have_posts()) {
		$post = $query->posts[0];
		wp_reset_postdata();

		return chance_build_production_data($post);
	}

	// If nothing is currently running, get the closest upcoming production
	$args = array(
		'post_type'      => 'production',
		'posts_per_page' => 1,
		'orderby'        => 'meta_value',
		'meta_key'       => 'opening',
		'order'          => 'ASC',
		'tax_query'      => array(
			array(
				'taxonomy' => 'series',
				'terms'    => array('main', 'holiday'),
				'operator' => 'IN',
				'field'    => 'slug',
			),
			array(
				'taxonomy' => 'season',
				'terms'    => array($current_season),
				'operator' => 'IN',
				'field'    => 'term_id',
			),
		),
		'meta_query'     => array(
			array(
				'key'     => 'opening',
				'value'   => date('Y-m-d', $today_time),
				'compare' => '>',
				'type'    => 'DATE',
			),
		),
	);

	$query = new WP_Query($args);

	if ($query->have_posts()) {
		$post = $query->posts[0];
		wp_reset_postdata();

		return chance_build_production_data($post);
	}

	wp_reset_postdata();
	return null;
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

	$today_time = time();
	$current_prod = chance_get_current_production();

	if (!$current_prod) {
		return null;
	}

	// Get the opening date of current production to find the next one after it
	$current_opening = strtotime($current_prod['opening']);

	$args = array(
		'post_type'      => 'production',
		'posts_per_page' => 1,
		'orderby'        => 'meta_value',
		'meta_key'       => 'opening',
		'order'          => 'ASC',
		'tax_query'      => array(
			array(
				'taxonomy' => 'series',
				'terms'    => array('main', 'holiday'),
				'operator' => 'IN',
				'field'    => 'slug',
			),
			array(
				'taxonomy' => 'season',
				'terms'    => array($current_season),
				'operator' => 'IN',
				'field'    => 'term_id',
			),
		),
		'meta_query'     => array(
			array(
				'key'     => 'opening',
				'value'   => date('Y-m-d H:i:s', $current_opening),
				'compare' => '>',
				'type'    => 'DATETIME',
			),
		),
	);

	$query = new WP_Query($args);

	if ($query->have_posts()) {
		$post = $query->posts[0];
		wp_reset_postdata();

		return chance_build_production_data($post);
	}

	wp_reset_postdata();
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
 * @param string $format PHP date format string (default: 'F j, Y')
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
		return date($format, $timestamp);
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
