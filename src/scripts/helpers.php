<?php

/**
 * Chance Theater Custom Blocks Registration
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
		$formats = ['Y-m-d', 'm-d-Y', 'd-m-Y'];
	} elseif (strpos($date_str, '/') !== false) {
		$formats = ['Y/m/d', 'm/d/Y', 'd/m/Y'];
	} elseif (strpos($date_str, ',') !== false) {
		$formats = ['F j, Y', 'M j, Y'];
	} else {
		$formats = ['j F Y', 'j M Y'];
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
	$time_formats = [
		'H:i:s',      // 14:30:00
		'H:i',        // 14:30
		'h:i:s A',    // 02:30:00 PM
		'h:i A',      // 02:30 PM
		'g:i:s A',    // 2:30:00 PM
		'g:i A',      // 2:30 PM
		'H:i:s a',    // 14:30:00 pm
		'H:i a',      // 14:30 pm
	];

	foreach ($time_formats as $format) {
		$dt = DateTime::createFromFormat($format, $time_str, $tz);
		if ($dt !== false) {
			$result = $dt->getTimestamp();
			wp_cache_set($cache_key, $result, 'ct_times', HOUR_IN_SECONDS);
			return $result;
		}
	}

	// Try datetime formats to extract time from full datetime strings
	$datetime_formats = [
		'Y-m-d H:i:s',  // 2026-01-01 14:30:00 (WordPress default)
		'Y-m-d H:i',    // 2026-01-01 14:30
		'Y-m-d h:i:s A', // 2026-01-01 02:30:00 PM
		'Y-m-d h:i A',  // 2026-01-01 02:30 PM
	];

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
