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

require_once __DIR__ . '/src/scripts/helpers.php';
require_once __DIR__ . '/src/scripts/rest-endpoints.php';

/**
 * Registers the blocks using block.json files.
 */
function theatrum_register_blocks()
{
	$custom_blocks = array(
		'block-dynamic',
		'block-static',
		'board-member',
		'card-carousel',
		'copyright-date-block',
		'cover-card',
		'meta-button',
		'meta-date',
		'meta-embed',
		'meta-field',
		'meta-gallery',
		'meta-icon',
		'meta-image',
		'meta-related',
		'meta-repeater',
		'meta-time',
		'onstage-current',
		'onstage-next',
		'performances-list',
		'popup',
		'production-details',
		'production-quotes',
		'season-producer',
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
 * Registers the block variations using block.json files.
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
