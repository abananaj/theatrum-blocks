<?php

/**
 * Plugin Name:       Theatrum Blocks
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       theatrum-blocks
 *
 * @package CreateBlock
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

require_once __DIR__ . '/src/scripts/helpers.php';
require_once __DIR__ . '/src/scripts/rest-endpoints.php';
/**
 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
 * based on the registered block metadata. Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
// function create_block_theatrum_blocks_block_init() {
// 	wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
// }
// add_action( 'init', 'create_block_theatrum_blocks_block_init' );

/**
 * Registers the blocks using block.json files
 */
function theatrum_register_blocks()
{
	$custom_blocks = array(
		'artist-credits',
		'block-dynamic',
		'block-static',
		'board-member',
		'card-carousel',
		'copyright-date-block',
		'cover-card',
		'meta-button',
		'meta-date',
		'meta-field',
		'meta-gallery',
		'meta-image',
		'meta-repeater',
		'meta-time',
		'onstage-current',
		'onstage-next',
		'popup',
		'production-credits',
		'production-details',
		'production-quotes',
		'site-option',
		'staff-member',
		'term-meta'
	);

	foreach ($custom_blocks as $block) {
		register_block_type(__DIR__ . '/build/blocks/' . $block);
	}
}
add_action('init', 'theatrum_register_blocks');

/**
 * Registers the block variations using block.json files
 */
function theatrum_register_block_variations()
{
	$variation_blocks = array(
		'post-cover',
	);

	foreach ($variation_blocks as $block) {
		register_block_type(__DIR__ . '/build/blocks/_variations/' . $block);
	}
}
add_action('init', 'theatrum_register_block_variations');
