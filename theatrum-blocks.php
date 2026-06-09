<?php

/**
 * Plugin Name:       Theatrum Blocks
 * Description:       Custom Gutenberg blocks for Chance Theater.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            Chance Theater
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       theatrum-blocks
 *
 * @package           Theatrum_Blocks
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

require_once __DIR__ . '/inc/helpers.php';
require_once __DIR__ . '/inc/rest-endpoints.php';

/**
 * Registers the blocks using block.json files.
 */
function theatrum_register_blocks()
{
	$custom_blocks = array(
		'breadcrumbs',
		'card-carousel',
		'copyright-date-block',
		'cover-card',
		'cover-carousel',
		'icon-list',
		'media-popover',
		'popup',
		'svg-icon',
		'thumbnail-list',

		'meta-button',
		'meta-date',
		'meta-embed',
		'meta-field',
		'meta-file',
		'meta-gallery',
		'meta-icon',
		'meta-image',
		'meta-related',
		'meta-repeater', // producers, performances, quotes, 
		'meta-time',

		'production-details', // 🎭
		'production-performances', // 🎭 var of repeater
		'production-quotes', // 🎭 var of repeater
		'production-trailer', // 🎭
		'term-meta', // ⭐ 
		'season-producer', // --> var of term-meta
		'site-option', // ⭐
		'staff-member', // temp un-deprecated 
		// 'board-member',

		'query-filter', // 🔍 frontend filter/sort for query loops

	);

	foreach ($custom_blocks as $block) {
		register_block_type(__DIR__ . '/build/blocks/' . $block);
	}
}
add_action('init', 'theatrum_register_blocks');

/**
 * Registers the block variations using block.json files.
 */
function theatrum_register_block_variations()
{
	$variation_blocks = array(
		// 'post-cover', - It does this naturally I guess!
		'subtitle-title',
		'toggle-heading',
	);

	foreach ($variation_blocks as $block) {
		register_block_type(__DIR__ . '/build/blocks/_variations/' . $block);
	}
}
add_action('init', 'theatrum_register_block_variations');

/**
 * Registers the "Custom Blocks" block category for all Theatrum blocks.
 * The category is inserted just before the 'widgets' category so it appears
 * in the correct position in both the block inserter and the Style Book.
 *
 * @param array[] $categories Array of block categories.
 * @return array[] Modified array of block categories.
 */
function theatrum_register_block_category($categories)
{
	$theatrum_category = array(
		'slug'  => 'theatrum',
		'title' => __('Custom Blocks', 'theatrum-blocks'),
		'icon'  => null,
	);

	// Find the position of the 'widgets' category and insert before it.
	$widgets_index = array_search(
		'widgets',
		array_column($categories, 'slug'),
		true
	);

	if (false !== $widgets_index) {
		array_splice($categories, $widgets_index, 0, array($theatrum_category));
	} else {
		// Fallback: append if 'widgets' category is not found.
		$categories[] = $theatrum_category;
	}

	return $categories;
}
add_filter('block_categories_all', 'theatrum_register_block_category');

/**
 * Enqueues the Style Book editor script that ensures the "Custom Blocks"
 * tab is positioned correctly in the Site Editor Style Book.
 */
function theatrum_enqueue_style_book_script()
{
	$asset_file = __DIR__ . '/build/style-book.asset.php';

	if (! file_exists($asset_file)) {
		return;
	}

	$asset = require $asset_file;

	wp_enqueue_script(
		'theatrum-style-book',
		plugins_url('build/style-book.js', __FILE__),
		$asset['dependencies'],
		$asset['version'],
		true
	);
}
add_action('enqueue_block_editor_assets', 'theatrum_enqueue_style_book_script');
