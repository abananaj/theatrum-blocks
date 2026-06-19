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

/**
 * Registers the blocks using block.json files.
 */
function theatrum_register_blocks()
{

	$example_blocks = array(
		// 'basic-block-translations',
		// 'basic-esnext',
		// 'block-dynamic-rendering',
		// 'block-static-rendering',
		'block-supports',
		'block-toolbar',
		'dynamic-block',
		'inner-blocks',
		'interactivity-api-countdown',
		'interactivity-api-quiz',
		'meta-block',
		'minimal-block',
		'my-first-interactive-block',
		'post-meta-testimonial',
		'quiz',
		'quiz-progress',
		// 'server-side-render-block',
		'recipe-card',
	);

	$custom_blocks = array(
		'board-member', // temp un-deprecated
		'breadcrumbs',
		'card-carousel',
		// 		- editor shows the simplified card builder on BE, FE show replicate because it looks better and works better on the FE
		// - [ ] won’t save media selected in BE
		// - [ ] squished on FE
		// - [ ] nav arrows don’t work on FE, but the horizontal scroll works on the BE

		'copyright-date-block',
		// - rename to theatrum/copyright-date

		'cover-card',
		// - working on home page
		// - on blocks page "Error: Error fetching data" on BE
		// - renders correctly on FE

		'cover-carousel',
		// - [ ] too many options in inspector panel, can’t see more than 1 slide at a time.
		// - [ ] won’t save opacity set in BE
		// - [ ] nav doesn't work on FE, can't see other slides
		// - [ ] should show slide as nested cover blocks

		'frankenstein-block',

		'list-icons',
		// - looks nice, but need list item as a nested block, model after core/list and core/list-item blocks
		'list-icons/list-item-icon', // child of list-icons

		'media-popover',
		// - make child of element pargraph headings

		// VARIATION SETS:
		'meta-button', // Convert to variation of core/button block that pulls URL and text from post meta
		'meta-date', // Convert to variation of post date block? Also Opening Date block? 
		// add Date-Time variation that pulls from post meta and displays in local timezone?
		'meta-embed', // Convert to variation of core/embed block that pulls video URL from post meta
		'meta-field', // Convert to generic block to pull any post meta value into a block — could be used for simple text, numbers, or even JSON for more complex blocks
		'meta-file', // Convert to variation of core/file block that pulls file URL from post meta
		'meta-gallery', // Convert to variation of core/gallery block that pulls image IDs from post meta
		'meta-icon', // Convert to variation of core/icon block that pulls icon name from post meta
		'meta-image', // Convert to variation of core/image block that pulls image ID from post meta
		'meta-related', // Convert to variation of core/related block that pulls related posts from post meta
		'meta-repeater', // Convert to variations: bylines, awards, producers, performances, quotes, notes, events, notes.
		// Error on block-editor
		'meta-time', // ❌ just use core date block with dynamic data pulled from post meta
		'popup',
		// - sync button, border, border-radius, and shadow??

		'production-details', // 🎭❓ is this used anywhere
		// - green "Production Details - Server rendered"

		'production-performances', // 🎭 var of repeater
		// - doesn't respond to block-spacing setting

		'production-quotes', // 🎭 var of repeater
		// - doesn't respond to font-size setting
		'production-tabs', // 🎭
		'production-trailer', // 🎭
		// - editor shows the dashed preview chip; real filter is frontend-only

		'query-filter', // 🔍 frontend filter/sort for query loops - CONVERT? to variation of query filter
		'query-loop', // variations by main post type ✅
		'season-producer', // --> var of term-meta ❓ do i need this?- use term meta field 
		'site-option', // ⭐
		// reqrites option value when entering Post Meta Key. The correct meta value is showing, but it need to appear alongside the option value
		'staff-member', // temp un-deprecated 
		// 'svg-icon', ❌ just use icon block OR custom html to animate

		'title-subtitle', // child of heading 
		'thumbnail-list',
		// - editor shows static builder UI; 3D flip is frontend-only
		// - doesn't save or display image on FE or BE
		// - text overlaps on FE ![screenshot](image.png)


		'table-advanced', // Style all items on one level?
		// toggle table-layout-fixed, default to table-layout:auto;
		'table-advanced/table-caption',
		'table-advanced/table-header',
		'table-advanced/table-body', // only 1 per table, but can have multiple rows
		'table-advanced/table-footer',
		'table-advanced/table-row',
		'table-advanced/table-heading-cell', // not responding to background & text color settings
		'table-advanced/table-cell', // not responding to background & text color settings
		// add toggle for empty
		// allow buttons & button.

		// make flex & allow vertical & horizontal alignment, default center middle

		'table-of-contents', // 🔍 auto-generate based on headings in conten

		'tabs',
		'tabs/tab-heading',
		'tabs/tab-item',
		'tabs/tab-panel',

		'term-meta', // ⭐ 
		'thumbnail-list',
		'title-subtitle',
	);

	// foreach ($example_blocks as $block) {
	// 	register_block_type(__DIR__ . '/build/blocks/_examples/' . $block);
	// }
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
	// Only add to Theatrum blocks
	if (isset($metadata['name']) && strpos($metadata['name'], 'theatrum/') === 0) {
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
