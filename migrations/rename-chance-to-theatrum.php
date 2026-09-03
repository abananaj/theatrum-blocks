<?php

/**
 * Rewrites stored post_content/DB templates from the old `chance/` block namespace to `theatrum/` — the source-side rename (block.json names, PHP functions, CSS classes) doesn't retroactively touch bytes already in wp_posts.post_content, so pre-rename posts still carry old identifiers.
 *
 * Migrates 4 things: (1) block names, from the authoritative list in THEATRUM_BLOCK_NAME_MAP; (2) the `theatrum/post-meta` block-bindings source stored in attrs; (3) the `metadata.name` "sticky name" persisted by the bind-* / popup-trigger core-block variations, needed so `isActive()` still recognizes them post-reload (unmigrated, they still render fine but lose their dedicated inspector UI/inserter highlighting until re-saved); (4) the literal `wp-block-chance-x` wrapper class baked into saved innerHTML/innerContent — WP derives it from the block's own registered name and `serialize_blocks()` reuses saved HTML verbatim, so renaming attrs.className alone wouldn't touch it. (4) is scoped strictly to blocks whose own name is being renamed (a fixture smoke-test caught an earlier draft corrupting unrelated chance/-prefixed blocks' wrapper classes when this was done unconditionally).
 *
 * Deliberately NOT touched: `.ct-*` classes baked into static blocks' own save() output, and the `is-style-ct-carousel`/`is-style-ct-slider` style slugs — neither was renamed in code, so stored content hasn't drifted from them. (`chance/artist-credits`/`chance/production-credits` moved to the theatrum-credits mu-plugin and ARE migrated here, despite once being excluded.)
 *
 * Covers post_content for every public post type + wp_block, plus wp_template/wp_template_part (DB-stored Site Editor overrides, which shadow theme .html files). Idempotent.
 *
 * Usage (WP-CLI): dry run (default) `wp eval-file wp-content/plugins/theatrum-blocks/migrations/rename-chance-to-theatrum.php`; apply with an `apply` arg appended.
 *
 * Do NOT run this against any database without the user's explicit go-ahead for that specific run — writing this file is not permission to execute it.
 */

if ( ! defined('WP_CLI') || ! WP_CLI) {
	echo "This script must be run via WP-CLI: wp eval-file migrations/rename-chance-to-theatrum.php [apply]\n";
	return;
}

$apply = in_array('apply', $args ?? [], true);

// ---------------------------------------------------------------------
// Authoritative rename lists — copied verbatim from the renamed src/blocks/**/block.json "name" fields; don't add/remove entries without checking against a real registered block.
// ---------------------------------------------------------------------

const THEATRUM_BLOCK_NAME_MAP = [
	'chance/blockquote-advanced' => 'theatrum/blockquote-advanced',
	'chance/blockquote-source'   => 'theatrum/blockquote-source',
	'chance/blockquote-text'     => 'theatrum/blockquote-text',
	'chance/carousel'            => 'theatrum/carousel',
	'chance/carousel-item'       => 'theatrum/carousel-item',
	'chance/chance-card'         => 'theatrum/chance-card',
	'chance/cover-card'          => 'theatrum/cover-card',
	'chance/list-icons'          => 'theatrum/list-icons',
	'chance/list-item-icon'      => 'theatrum/list-item-icon',
	'chance/list-thumbnail'      => 'theatrum/list-thumbnail',
	'chance/list-item-thumbnail' => 'theatrum/list-item-thumbnail',
	'chance/meta-button'         => 'theatrum/meta-button',
	'chance/meta-date'           => 'theatrum/meta-date',
	'chance/meta-embed'          => 'theatrum/meta-embed',
	'chance/meta-field'          => 'theatrum/meta-field',
	'chance/meta-file'           => 'theatrum/meta-file',
	'chance/meta-gallery'        => 'theatrum/meta-gallery',
	'chance/meta-icon'           => 'theatrum/meta-icon',
	'chance/meta-image'          => 'theatrum/meta-image',
	'chance/meta-related'        => 'theatrum/meta-related',
	'chance/meta-repeater'       => 'theatrum/meta-repeater',
	'chance/meta-time'           => 'theatrum/meta-time',
	'chance/popover'             => 'theatrum/popover',
	'chance/popover-content'     => 'theatrum/popover-content',
	'chance/popover-trigger'     => 'theatrum/popover-trigger',
	'chance/popup'               => 'theatrum/popup',
	'chance/performances-list'   => 'theatrum/performances-list',
	'chance/production-quotes'   => 'theatrum/production-quotes',
	'chance/production-tabs'     => 'theatrum/production-tabs',
	'chance/tab'                 => 'theatrum/tab',
	'chance/tab-content'         => 'theatrum/tab-content',
	'chance/tab-heading'         => 'theatrum/tab-heading',
	'chance/query-filter'        => 'theatrum/query-filter',
	'chance/site-option'         => 'theatrum/site-option',
	'chance/slider'              => 'theatrum/slider',
	'chance/slider-item'         => 'theatrum/slider-item',
	'chance/term-meta'           => 'theatrum/term-meta',
	'chance/title-advanced'      => 'theatrum/title-advanced',
	// Added 2026-08-04: originally excluded as chance-ollie theme blocks, they've since moved to theatrum-credits and been renamed there; the mu-plugin aliases nothing, so stored chance/ instances are now dead blocks and in scope.
	'chance/artist-credits'      => 'theatrum/artist-credits',
	'chance/production-credits'  => 'theatrum/production-credits',
];

const THEATRUM_BINDING_SOURCE_MAP = [
	'chance/post-meta' => 'theatrum/post-meta',
];

// Persisted `metadata.name` default values baked in by the core-block variations in src/meta-variations.js and src/popup-trigger-variation.js.
const THEATRUM_VARIATION_NAME_MAP = [
	'chance/bind-image'    => 'theatrum/bind-image',
	'chance/bind-button'   => 'theatrum/bind-button',
	'chance/bind-field'    => 'theatrum/bind-field',
	'chance/bind-date'     => 'theatrum/bind-date',
	'chance/popup-trigger' => 'theatrum/popup-trigger',
];

const THEATRUM_OLD_WRAPPER_CLASS_FRAGMENT = 'wp-block-chance-';
const THEATRUM_NEW_WRAPPER_CLASS_FRAGMENT = 'wp-block-theatrum-';

/**
 * Recursively rewrites className-bearing strings (attrs, innerHTML, innerContent) referencing the auto-generated wp-block-chance-x wrapper class.
 *
 * @param mixed $value
 * @param int   &$count Incremented once per string actually changed.
 * @return mixed
 */
function theatrum_rewrite_wrapper_class($value, &$count) {
	if (is_string($value)) {
		if (strpos($value, THEATRUM_OLD_WRAPPER_CLASS_FRAGMENT) !== false) {
			$count++;
			return str_replace(
				THEATRUM_OLD_WRAPPER_CLASS_FRAGMENT,
				THEATRUM_NEW_WRAPPER_CLASS_FRAGMENT,
				$value
			);
		}
		return $value;
	}

	if (is_array($value)) {
		foreach ($value as $key => $item) {
			$value[$key] = theatrum_rewrite_wrapper_class($item, $count);
		}
		return $value;
	}

	return $value;
}

/**
 * Migrates a block's `attrs`: bindings source and variation metadata name. Both are exact-value lookups, so — unlike the wrapper-class rewrite — safe to apply unconditionally regardless of which block they belong to.
 *
 * @param array $attrs
 * @param array &$stats
 * @return array
 */
function theatrum_migrate_attrs(array $attrs, array &$stats) {
	if (isset($attrs['metadata']['bindings']) && is_array($attrs['metadata']['bindings'])) {
		foreach ($attrs['metadata']['bindings'] as $attr_name => $binding) {
			if (
				is_array($binding)
				&& isset($binding['source'])
				&& isset(THEATRUM_BINDING_SOURCE_MAP[$binding['source']])
			) {
				$attrs['metadata']['bindings'][$attr_name]['source'] =
					THEATRUM_BINDING_SOURCE_MAP[$binding['source']];
				$stats['bindings']++;
			}
		}
	}

	if (
		isset($attrs['metadata']['name'])
		&& is_string($attrs['metadata']['name'])
		&& isset(THEATRUM_VARIATION_NAME_MAP[$attrs['metadata']['name']])
	) {
		$attrs['metadata']['name'] = THEATRUM_VARIATION_NAME_MAP[$attrs['metadata']['name']];
		$stats['variation_names']++;
	}

	return $attrs;
}

/**
 * Recursively migrates a parse_blocks() tree in place (blockName, attrs, innerHTML, innerContent, innerBlocks).
 *
 * IMPORTANT: the wp-block-chance-x wrapper-class rewrite only runs on a block whose ORIGINAL name is in THEATRUM_BLOCK_NAME_MAP — anything not in the map must stay byte-for-byte untouched, since its wrapper class still legitimately reads wp-block-chance-x. An earlier unconditional version corrupted unrelated never-renamed blocks; caught by this script's own smoke test before it ran against a database.
 *
 * @param array $blocks
 * @param array &$stats
 * @return array
 */
function theatrum_migrate_blocks(array $blocks, array &$stats) {
	foreach ($blocks as &$block) {
		if ( ! is_array($block)) {
			continue;
		}

		$original_name    = $block['blockName'] ?? null;
		$is_renamed_block = $original_name !== null && isset(THEATRUM_BLOCK_NAME_MAP[$original_name]);

		if ($is_renamed_block) {
			$block['blockName'] = THEATRUM_BLOCK_NAME_MAP[$original_name];
			$stats['block_names']++;
		}

		if ( ! empty($block['attrs']) && is_array($block['attrs'])) {
			$block['attrs'] = theatrum_migrate_attrs($block['attrs'], $stats);
		}

		// Raw saved markup — see the file header for why this can't be skipped in favor of renaming attrs.className alone. Only touched for blocks we're actually renaming.
		if ($is_renamed_block) {
			if ( ! empty($block['attrs']) && is_array($block['attrs'])) {
				$block['attrs'] = theatrum_rewrite_wrapper_class($block['attrs'], $stats['classnames']);
			}

			if ( ! empty($block['innerHTML']) && is_string($block['innerHTML'])) {
				$block['innerHTML'] = theatrum_rewrite_wrapper_class($block['innerHTML'], $stats['classnames']);
			}

			if ( ! empty($block['innerContent']) && is_array($block['innerContent'])) {
				foreach ($block['innerContent'] as $i => $chunk) {
					if (is_string($chunk)) {
						$block['innerContent'][$i] = theatrum_rewrite_wrapper_class($chunk, $stats['classnames']);
					}
				}
			}
		}

		if ( ! empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
			$block['innerBlocks'] = theatrum_migrate_blocks($block['innerBlocks'], $stats);
		}
	}
	unset($block);

	return $blocks;
}

/**
 * Runs the full migration against one piece of block content.
 *
 * @param string $content Original post_content (or template content).
 * @param array  &$stats
 * @return string|null New content, or null if nothing changed.
 */
function theatrum_migrate_content($content, array &$stats) {
	if (
		strpos($content, 'chance/') === false
		&& strpos($content, THEATRUM_OLD_WRAPPER_CLASS_FRAGMENT) === false
	) {
		return null; // Fast path — nothing this script cares about.
	}

	$blocks = parse_blocks($content);
	$before = ['block_names' => 0, 'bindings' => 0, 'variation_names' => 0, 'classnames' => 0];
	$blocks = theatrum_migrate_blocks($blocks, $before);

	$changed = array_sum($before);
	if ($changed === 0) {
		return null;
	}

	foreach ($before as $k => $v) {
		$stats[$k] += $v;
	}

	return serialize_blocks($blocks);
}

// ---------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------

global $wpdb;

$post_types = array_unique(
    array_merge(
        get_post_types(['public' => true], 'names'),
        ['wp_block', 'wp_template', 'wp_template_part']
    )
);

$placeholders = implode(',', array_fill(0, count($post_types), '%s'));

$like_slash = '%' . $wpdb->esc_like('chance/') . '%';
$like_class = '%' . $wpdb->esc_like(THEATRUM_OLD_WRAPPER_CLASS_FRAGMENT) . '%';

$sql = $wpdb->prepare(
	"SELECT ID, post_type, post_status, post_title
	   FROM {$wpdb->posts}
	  WHERE post_type IN ($placeholders)
	    AND post_status NOT IN ('trash','auto-draft')
	    AND (post_content LIKE %s OR post_content LIKE %s)",
	array_merge($post_types, [$like_slash, $like_class])
);

$rows = $wpdb->get_results($sql);

WP_CLI::log('');
WP_CLI::log($apply ? '=== APPLYING ===' : '=== DRY RUN — nothing will be written ===');
WP_CLI::log(sprintf('Scanning %d post type(s): %s', count($post_types), implode(', ', $post_types)));
WP_CLI::log(sprintf('%d candidate post(s) matched the LIKE pre-filter.', count($rows)));
WP_CLI::log('');

$totals        = ['block_names' => 0, 'bindings' => 0, 'variation_names' => 0, 'classnames' => 0];
$touched_posts = 0;

foreach ($rows as $row) {
	$post = get_post($row->ID);
	if ( ! $post) {
		continue;
	}

	$stats   = ['block_names' => 0, 'bindings' => 0, 'variation_names' => 0, 'classnames' => 0];
	$updated = theatrum_migrate_content($post->post_content, $stats);

	if ($updated === null) {
		continue; // LIKE-matched but nothing this script maps applied (an unmapped chance/ name).
	}

	$touched_posts++;
	foreach ($stats as $k => $v) {
		$totals[$k] += $v;
	}

	WP_CLI::log(
        sprintf(
            '#%-7s %-16s %-40s block names:%-3d bindings:%-3d variation names:%-3d classnames:%-3d',
            $row->ID,
            $row->post_type,
            mb_substr($row->post_title !== '' ? $row->post_title : '(no title)', 0, 38),
            $stats['block_names'],
            $stats['bindings'],
            $stats['variation_names'],
            $stats['classnames']
        )
    );

	if ($apply) {
		$result = wp_update_post(
            wp_slash(
                [
                'ID'           => $row->ID,
                'post_content' => $updated,
                ]
            ),
            true
        );

		if (is_wp_error($result)) {
			WP_CLI::warning(sprintf('  #%s failed to save: %s', $row->ID, $result->get_error_message()));
		}
	}
}

WP_CLI::log('');
WP_CLI::log(
    sprintf(
        '%d post(s) touched — %d block name(s), %d binding source(s), %d variation name(s), %d classname string(s).',
        $touched_posts,
        $totals['block_names'],
        $totals['bindings'],
        $totals['variation_names'],
        $totals['classnames']
    )
);

if ( ! $apply) {
	WP_CLI::success('Dry run complete. Re-run with \'apply\' to write changes.');
	return;
}

WP_CLI::success('Migration applied.');
