<?php

/**
 * Plugin Name:       Theatrum Blocks
 * Description:       Custom Gutenberg blocks for Chance Theater.
 * Version:           0.1.1
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
require_once __DIR__ . '/inc/block-bindings.php';

/**
 * Registers the blocks using block.json files.
 */
function theatrum_register_blocks()
{

	$custom_blocks = array(
		'board-member', // temp un-deprecated
		'breadcrumbs',
		'card-carousel',
		// - [ ] editor shows the simplified card builder on BE, FE show replicate because it looks better and works better on the FE
		// - [ ] won’t save media selected in BE
		// - [ ] squished on FE
		// - [ ] nav arrows don’t work on FE, but the horizontal scroll works on the BE
		'card-static',
		'copyright-date-block',

		'cover-card',
		// - [ ] working on home page
		// - [ ] on blocks page "Error: Error fetching data" on BE
		// - [ ] renders correctly on FE

		'cover-carousel',
		// - [ ] too many options in inspector panel, can’t see more than 1 slide at a time.
		// - [ ] won’t save opacity set in BE
		// - [ ] nav doesn't work on FE, can't see other slides
		// - [ ] should show slide as nested cover blocks


		'list-icons',
		'list-icons/list-item-icon', 
		// - [ ] add ability to change icon color, by default the icon should use the inherited text color and allow user to override it with a color picker in the inspector panel.

		'media-popover',
		// - [ ] make child of element pargraph headings

		// CUSTOM META BLOCKS — primary, supported way to bind post meta/ACF.
		// Each also has an optional core-block variation (chance/bind-*, see
		// src/meta-variations.js) for cases where the core block's own
		// styling/features are worth using instead — not a migration path,
		// both are kept.
		'meta-button',
		'meta-date',
		'meta-embed',
		'meta-field',
		'meta-file',
		'meta-gallery',
		// - [ ] too many custom controls (aspect ratio, random order, nav buttons)
		'meta-icon', // ❌ just use core icon block
		'meta-image',
		'meta-related',
		// - [ ] Display arrays of post IDs
		'meta-repeater',
		// - [x] Error on block-editor fixed (ToolsPanel panelId)
		'meta-time', // ❌ just use core date block with dynamic data pulled from post meta
		'popup',
		// - [ ] sync button, border, border-radius, and shadow??

		'production-details', 
		// - [ ] 🎭❓ is this used anywhere
		// - [ ] green "Production Details - Server rendered"

		'production-performances', // 🎭 var of repeater
		// - [x] responds to block-spacing (blockGap) setting

		'production-quotes', // 🎭 var of repeater
		// - [x] responds to font-size setting
		'production-tabs', // 🎭
		'production-trailer', // 🎭
		// - [ ] editor shows the dashed preview chip; real filter is frontend-only

		'query-filter', 
		// - [ ] 🔍 frontend filter/sort for query loops - CONVERT? to variation of query filter
		'query-loop', 
		// - [ ] variations by main post type ✅
		'season-producer', 
		// - [ ] --> var of term-meta ❓ do i need this?- use term meta field 
		'site-option',
		// - [x] meta value now shows alongside the option value (in a .site-option-meta span) instead of replacing it
		'staff-member', // temp un-deprecated 
		// - [ ] 'svg-icon', ❌ just use icon block OR custom html to animate



		'table-advanced', 
		// - [ ] Style all items on one level?
		// - [ ] toggle table-layout-fixed, default to table-layout:auto;
		'table-advanced/table-caption',
		'table-advanced/table-header',
		'table-advanced/table-body', 
		// - [ ] only 1 per table, but can have multiple rows
		'table-advanced/table-footer',
		'table-advanced/table-row',
		'table-advanced/table-heading-cell',
		// - [x] responds to background & text color settings
		'table-advanced/table-cell',
		// - [x] responds to background & text color settings
		// - [ ] add toggle for empty
		// - [ ] allow buttons & button.

		// - [ ] make flex & allow vertical & horizontal alignment, default center middle

		'table-of-contents', 
		// - [ ] auto-generate based on headings in conten

		'tabs',
		'tabs/tab-heading',
		'tabs/tab-item',
		'tabs/tab-panel',

		'term-meta', // ⭐ 
		'thumbnail-list',
		// - [ ] editor shows static builder UI; 3D flip is frontend-only
		// - [ ] doesn't save or display image on FE or BE
		// - [ ] text overlaps on FE ![screenshot](image.png)
		'title-subtitle', 
		// - [ ] Add post title to allowed blocks
		// - [ ] child of heading 
	);

	foreach ($custom_blocks as $block) {
		register_block_type(__DIR__ . '/build/blocks/' . $block);
	}
}
add_action('init', 'theatrum_register_blocks');


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
 * Adds devMode attribute to all Theatrum blocks for development display.
 *
 * @param array $metadata Block metadata.
 * @return array Modified metadata with devMode attribute.
 */
function theatrum_add_dev_mode_attribute($metadata)
{
	// Only add to this plugin's own blocks (chance/* and theatrum/* namespaces)
	$name = $metadata['name'] ?? '';
	if (strpos($name, 'theatrum/') === 0 || strpos($name, 'chance/') === 0) {
		if (!isset($metadata['attributes'])) {
			$metadata['attributes'] = array();
		}

		$metadata['attributes']['devMode'] = array(
			'type'    => 'boolean',
			'default' => false,
		);
	}

	return $metadata;
}
add_filter('block_type_metadata', 'theatrum_add_dev_mode_attribute');

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

/**
 * Enqueues the meta-variations script that registers core block variations
 * backed by the chance/post-meta Block Bindings source.
 */
function theatrum_enqueue_meta_variations_script()
{
	$asset_file = __DIR__ . '/build/meta-variations.asset.php';

	if (! file_exists($asset_file)) {
		return;
	}

	$asset = require $asset_file;

	wp_enqueue_script(
		'theatrum-meta-variations',
		plugins_url('build/meta-variations.js', __FILE__),
		$asset['dependencies'],
		$asset['version'],
		true
	);
}
add_action('enqueue_block_editor_assets', 'theatrum_enqueue_meta_variations_script');
