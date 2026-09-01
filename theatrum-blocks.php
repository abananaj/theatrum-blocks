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
require_once __DIR__ . '/inc/query-filter.php';
require_once __DIR__ . '/inc/slider-eager-images.php';

/**
 * Load the plugin text domain so the PHP-side __() strings are translatable.
 */
function theatrum_blocks_load_textdomain()
{
	load_plugin_textdomain('theatrum-blocks', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('init', 'theatrum_blocks_load_textdomain');

/**
 * Registers the blocks using block.json files.
 */
function theatrum_register_blocks()
{

	$custom_blocks = array(
		'breadcrumbs',
		'page-nav',
		'carousel',
		'carousel/carousel-item',

		'blockquote-advanced',
		'blockquote-advanced/blockquote-text',
		'blockquote-advanced/blockquote-source',

		'list-icons',
		'list-icons/list-item-icon',
		// add ability to change icon color if it is an svg
		'popover',
		'popover/popover-trigger',
		'popover/popover-content',

		'meta-button',
		// sync button styles with core/buttons block
		// make this button nestable inside core/buttons?
		// enter text inside the button in the block editor rather than in the inspector panel

		'meta-date',
		// unecessary padding/margin/line-height that make these look diff than the regular text. should render without extra spacing, refer to meta field and mta related which does this nicely
		'meta-time',
		// unecessary padding/margin/line-height that make these look diff than the regular text. should render without extra spacing, refer to meta field and mta related which does this nicely
		'meta-embed',
		// not responding when i put in a meta key that I am sure is valid, says: Watch video on YouTube, 		Error 153,		Video player configuration error
		'meta-field',
		// need options for wrapper tag
		// compare to term-meta and site-option, make them all work similarly as possible to this meta field 
		// add ability to update post meta values as binding allows with core blocks?
		// Add options for displaying boolean values, user should be able to input text to show if the value is 0 and if the value is 1, for example, if the user inputs "True" for 1 and "False" for 0, the meta field block will render "True" if the value is 1 and "False" if the value is 0.
		'meta-file',
		// icon not showing on backend, but is showing on frontend. I want the icon to show on both.
		// option to style as a button?
		'meta-gallery',
		// should have identical control in inspectorPanel that the core gallery block has, including list view, settings, and style. 
		'meta-image',
		// needs controls for aspect ratio, etc. 
		'meta-related',
		// option to display as cover cards?
		'meta-repeater',
		// styling for accolades meta repeater on post 58462 not rendering in block editor but is rendering on frontend correctly
		// if user select ul or ol as the wrapper tag, the subfields should automatically be <li> 
		// remove div option
		// needs a Wrapper Tag option for <p>, which should automatically make the subfields spans. This should be the default option. 
		// wrapper tag ul and ol should have an option to apply list-style:none;

		'popup',
		// sync button styles with core/buttons block
		// text color on hover same as background thus invisible
		// edit button text and dialog title in UI rather than inspectorpanel boxes. 
		// popup content is not rendering on the frontend AND not saving in the backend
		// make this button nestable inside core/buttons?
		// ability to link to production page with this popup open from other pages by appending a query of some sort to the url? #anchor tag?

		'performances-list', // ➡️ move to theme
		// should render on block editor as well as frontend, so user can see what it will look like on the frontend.

		'production-quotes', // ➡️ move to theme

		'tabs',
		// these look different on the frontend than in the block editor. On the frontend the tab labels are horizontal then go vertical on mobile, but in the block editor they are vertical always. I want the block editor to match the frontend.
		// styling is clunky in general, addd some basic styles to make them look like modern tabs
		// Example Codepen: https://codepen.io/annabananajennings/pen/NPbeYbW
		'tabs/tab',
		'tabs/tab-heading',
		'tabs/tab-content',

		'query-filter',
		'query-loop',  // ➡️ move loop variations to theme
		// change production icon to masks
		// change venue icon to building
		// change artist icon to color palette

		'site-option',

		'slider',
		'slider/slider-item',

		'table-advanced',
		// Style all items on one level?
		// toggle table-layout-fixed, default to table-layout:auto;
		// add ability to tab to next cell with tab key, and shift-tab to previous cell in block editor?
		'table-advanced/table-caption',
		'table-advanced/table-header',
		'table-advanced/table-body',
		// only 1 per table, but can have multiple rows
		'table-advanced/table-footer',
		'table-advanced/table-row',
		'table-advanced/table-heading-cell',
		'table-advanced/table-cell',
		'table-of-contents',
		'term-meta',
		'list-thumbnail',
		'list-thumbnail/list-item-thumbnail',
		'title-advanced',
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
	$theatrum_categories = array(
		array(
			'slug'  => 'theatrum',
			'title' => __('Custom Blocks', 'theatrum-blocks'),
			'icon'  => null,
		),
		array(
			'slug'  => 'metablock',
			'title' => __('Meta Blocks', 'theatrum-blocks'),
			'icon'  => null,
		),
		array(
			'slug'  => 'production',
			'title' => __('Production', 'theatrum-blocks'),
			'icon'  => null,
		),
		array(
			'slug'  => 'deprecated',
			'title' => __('Deprecated', 'theatrum-blocks'),
			'icon'  => null,
		),
	);

	// Find the position of the 'widgets' category and insert before it.
	$widgets_index = array_search(
		'widgets',
		array_column($categories, 'slug'),
		true
	);

	if (false !== $widgets_index) {
		array_splice($categories, $widgets_index, 0, $theatrum_categories);
	} else {
		// Fallback: append if 'widgets' category is not found.
		$categories = array_merge($categories, $theatrum_categories);
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
	// Only add to this plugin's own blocks (theatrum/* namespace)
	$name = $metadata['name'] ?? '';
	if (strpos($name, 'theatrum/') === 0) {
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
 * backed by the theatrum/post-meta Block Bindings source.
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

/**
 * Enqueues the popup-trigger-variation script that registers the
 * theatrum/popup-trigger core/button variation.
 */
function theatrum_enqueue_popup_trigger_variation_script()
{
	$asset_file = __DIR__ . '/build/popup-trigger-variation.asset.php';

	if (! file_exists($asset_file)) {
		return;
	}

	$asset = require $asset_file;

	wp_enqueue_script(
		'theatrum-popup-trigger-variation',
		plugins_url('build/popup-trigger-variation.js', __FILE__),
		$asset['dependencies'],
		$asset['version'],
		true
	);
}
add_action('enqueue_block_editor_assets', 'theatrum_enqueue_popup_trigger_variation_script');

/**
 * Enqueues the block-color script that colors all Theatrum/Chance custom
 * block icons blue, so they're visually distinguishable in the inserter,
 * list view, and block toolbar (mirroring how meta-bound block variations
 * show purple).
 */
function theatrum_enqueue_block_color_script()
{
	$asset_file = __DIR__ . '/build/block-color.asset.php';

	if (! file_exists($asset_file)) {
		return;
	}

	$asset = require $asset_file;

	wp_enqueue_script(
		'theatrum-block-color',
		plugins_url('build/block-color.js', __FILE__),
		$asset['dependencies'],
		$asset['version'],
		true
	);
}
add_action('enqueue_block_editor_assets', 'theatrum_enqueue_block_color_script');

/**
 * Enqueues the rich-text-formats script that registers custom RichText
 * toolbar formats (e.g. Small) alongside core bold/italic/etc.
 */
function theatrum_enqueue_rich_text_formats_script()
{
	$asset_file = __DIR__ . '/build/rich-text-formats.asset.php';

	if (! file_exists($asset_file)) {
		return;
	}

	$asset = require $asset_file;

	wp_enqueue_script(
		'theatrum-rich-text-formats',
		plugins_url('build/rich-text-formats.js', __FILE__),
		$asset['dependencies'],
		$asset['version'],
		true
	);
}
add_action('enqueue_block_editor_assets', 'theatrum_enqueue_rich_text_formats_script');

/**
 * Registers the Carousel/Slider block styles on core/query and core/gallery
 * (the "formats" — see src/formats/). Names are prefixed (ct-carousel,
 * ct-slider) since a bare "carousel"/"slider" slug is a plausible collision
 * with other plugins.
 */
function theatrum_register_format_styles()
{
	$blocks = array('core/query', 'core/gallery');
	$styles = array(
		array('name' => 'ct-carousel', 'label' => __('Carousel', 'theatrum-blocks')),
		array('name' => 'ct-slider', 'label' => __('Slider', 'theatrum-blocks')),
	);

	foreach ($blocks as $block) {
		foreach ($styles as $style) {
			register_block_style($block, $style);
		}
	}
}
add_action('init', 'theatrum_register_format_styles');

/**
 * Blocks eligible for the Carousel/Slider formats, and the style slugs
 * (without the is-style- prefix) that trigger them. Shared by the editor
 * and frontend enqueue functions below.
 */
function theatrum_format_blocks()
{
	return array('core/query', 'core/gallery');
}

function theatrum_format_style_slugs()
{
	return array('ct-carousel', 'ct-slider');
}

/**
 * Registers (without enqueuing) the shared formats.js/formats.css handles
 * so both the editor and frontend enqueue functions below can reference
 * them by handle.
 */
function theatrum_register_format_assets()
{
	$script_asset_file = __DIR__ . '/build/formats.asset.php';
	if (! file_exists($script_asset_file)) {
		return;
	}
	$script_asset = require $script_asset_file;

	wp_register_script(
		'theatrum-formats',
		plugins_url('build/formats.js', __FILE__),
		$script_asset['dependencies'],
		$script_asset['version'],
		true
	);

	$style_path = __DIR__ . '/build/style-formats.css';
	if (file_exists($style_path)) {
		wp_register_style(
			'theatrum-formats',
			plugins_url('build/style-formats.css', __FILE__),
			array(),
			(string) filemtime($style_path)
		);

		if (file_exists(__DIR__ . '/build/style-formats-rtl.css')) {
			wp_style_add_data('theatrum-formats', 'rtl', 'replace');
		}
	}
}
add_action('init', 'theatrum_register_format_assets');

/**
 * Editor: enqueue the formats stylesheet so the Carousel/Slider style
 * previews render correctly in the Styles panel and canvas. No script here
 * — the runtime is frontend-only, matching how theatrum/carousel and
 * theatrum/slider's own viewScript only ever runs on the frontend.
 */
function theatrum_enqueue_format_editor_assets()
{
	if (! is_admin()) {
		return;
	}
	wp_enqueue_style('theatrum-formats');
}
add_action('enqueue_block_assets', 'theatrum_enqueue_format_editor_assets');

/**
 * Frontend: enqueue the formats script/style only on pages that actually
 * render a Carousel/Slider-styled core/query or core/gallery block. This is
 * an enqueue sniff, not a markup filter — $block_content is returned
 * untouched, so it can't affect alignment or wrapper attributes.
 */
function theatrum_enqueue_format_frontend_assets($block_content, $block)
{
	if (is_admin() || empty($block['blockName'])) {
		return $block_content;
	}

	if (! in_array($block['blockName'], theatrum_format_blocks(), true)) {
		return $block_content;
	}

	$class_name = (string) ($block['attrs']['className'] ?? '');

	foreach (theatrum_format_style_slugs() as $slug) {
		if (false !== strpos($class_name, 'is-style-' . $slug)) {
			wp_enqueue_style('theatrum-formats');
			wp_enqueue_script('theatrum-formats');
			break;
		}
	}

	return $block_content;
}
add_filter('render_block', 'theatrum_enqueue_format_frontend_assets', 10, 2);
