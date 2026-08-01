<?php

/**
 * Rewrites stored post_content (and DB-stored Site Editor templates) to use
 * this plugin's new `theatrum/` block namespace instead of the old, mixed
 * `chance/` / `theatrum/` split.
 *
 * Companion to the code rename performed in this repo (see CHANGELOG.md /
 * the "unify chance & theatrum namespaces" commits). That rename only
 * touched source files — block.json "name" fields, PHP function names, the
 * block-bindings source, and a handful of CSS classes. None of that
 * retroactively changes bytes already sitting in wp_posts.post_content, so
 * any post saved before this rename shipped still has the old identifiers
 * baked into its stored blocks. This script finds and rewrites those.
 *
 * What it rewrites, and why each needs its own handling:
 *
 * 1. Block names — `<!-- wp:chance/meta-field {...} -->` -> `theatrum/meta-field`.
 *    The authoritative old->new list below is copied verbatim from the 38
 *    block.json files that were renamed under src/blocks/ during this
 *    refactor (see THEATRUM_BLOCK_NAME_MAP) — not re-derived or guessed.
 *
 * 2. The block-bindings source — `metadata.bindings.<attr>.source` values of
 *    `chance/post-meta` become `theatrum/post-meta` (registered in
 *    inc/block-bindings.php). This is stored per-block inside `attrs`, same
 *    as any other attribute.
 *
 * 3. Core-block-variation "sticky name" — the `chance/bind-image`,
 *    `chance/bind-button`, `chance/bind-field`, `chance/bind-date`, and
 *    `chance/popup-trigger` variations (src/meta-variations.js,
 *    src/popup-trigger-variation.js) don't just register a variation name —
 *    they also set `metadata.name` to that same string as part of the
 *    variation's default attributes, specifically so `isActive()` can still
 *    recognize the block after a reload. That default value IS persisted
 *    into `attrs.metadata.name` on every block instance created from the
 *    variation, unlike the variation registration itself. Without migrating
 *    it, old Meta Bound image/button/paragraph blocks silently stop being
 *    recognized as their variation in the editor (they still render fine on
 *    the frontend — rendering keys off `metadata.bindings.*.source`, not
 *    `metadata.name` — but they lose the dedicated inspector UI and
 *    inserter highlighting until re-saved).
 *
 * 4. The `wp-block-chance-x` wrapper class. WordPress's block-supports
 *    system derives this class from the block's registered name and writes
 *    it into the block's *saved HTML*, not just into `attrs.className`. For
 *    a static block, that saved HTML is `parse_blocks()`'s `innerHTML` /
 *    `innerContent` — and `serialize_blocks()` reuses those strings
 *    VERBATIM; it only regenerates the `<!-- wp:name {attrs} -->` comment
 *    delimiters from `blockName`/`attrs`. So renaming `attrs.className`
 *    alone would leave the actual rendered wrapper `<div class="wp-block-
 *    chance-x ...">` untouched. This script rewrites the literal
 *    `wp-block-chance-` substring in a block's attrs, innerHTML, and
 *    innerContent — but ONLY for a block whose own name is being renamed
 *    (i.e. is a key in THEATRUM_BLOCK_NAME_MAP). A block's wrapper class is
 *    always derived from its own name, never another block's, so this is a
 *    safe way to scope it precisely. An earlier draft of this script did the
 *    substring rewrite unconditionally on every string found anywhere in the
 *    tree; a smoke test against a fixture containing an unmapped
 *    chance/artist-credits block (theme-owned, deliberately not in the map)
 *    caught that this also rewrote *that* block's wrapper class even though
 *    its blockName was correctly left alone — fixed before this ever ran
 *    against a real database.
 *
 * What this script deliberately does NOT touch (and why):
 *
 * - `.ct-*` classes that are part of a static block's own save() output
 *   (ct-carousel-card, ct-popover*, ct-slider*, ct-tab*, ct-production-tabs
 *   — see src/blocks/**\/save.js) were left as `.ct-` in code specifically
 *   because they're stored. Since the code wasn't renamed, there's nothing
 *   for stored content to have drifted from — do not add these to this
 *   script without also changing the corresponding save.js/scss, and then
 *   only alongside a plan for the transient period between deploying the
 *   code and running this script.
 * - The `is-style-ct-carousel` / `is-style-ct-slider` block style slugs
 *   (registered in theatrum-blocks.php) — same reasoning, left unrenamed
 *   in code.
 * - `chance/artist-credits` and `chance/production-credits` — owned by the
 *   chance-ollie THEME, not this plugin. Not in THEATRUM_BLOCK_NAME_MAP, so
 *   this script's block-name pass will not touch them. If you see either in
 *   scan output flagged as "unmapped chance/ blockName", that's expected —
 *   do not add them here.
 *
 * Covers:
 *   - post_content for every public post type + wp_block (reusable blocks)
 *   - wp_template / wp_template_part (DB-stored Site Editor overrides —
 *     these shadow the theme's .html files and won't be touched by editing
 *     theme files alone)
 *
 * Idempotent — run it as many times as you like; posts with nothing left to
 * migrate are skipped (reported as "already migrated" the first time
 * nothing changes, silently skipped on the LIKE-filter level after that).
 *
 * Usage (WP-CLI):
 *   Dry run (default, writes nothing):
 *     wp eval-file wp-content/plugins/theatrum-blocks/migrations/rename-chance-to-theatrum.php
 *   Apply:
 *     wp eval-file wp-content/plugins/theatrum-blocks/migrations/rename-chance-to-theatrum.php apply
 *
 * Do NOT run this against any database without the user's explicit go-ahead
 * for that specific run — writing this file is not permission to execute it.
 */

if (! defined('WP_CLI') || ! WP_CLI) {
	echo "This script must be run via WP-CLI: wp eval-file migrations/rename-chance-to-theatrum.php [apply]\n";
	return;
}

$apply = in_array('apply', $args ?? [], true);

// ---------------------------------------------------------------------
// Authoritative rename lists — copied from the src/blocks/**/block.json
// "name" fields actually renamed in this refactor. Do not add/remove
// entries here without also checking they match a real registered block.
// ---------------------------------------------------------------------

const THEATRUM_BLOCK_NAME_MAP = [
	'chance/blockquote-advanced'    => 'theatrum/blockquote-advanced',
	'chance/blockquote-source'      => 'theatrum/blockquote-source',
	'chance/blockquote-text'        => 'theatrum/blockquote-text',
	'chance/carousel'               => 'theatrum/carousel',
	'chance/carousel-item'          => 'theatrum/carousel-item',
	'chance/chance-card'            => 'theatrum/chance-card',
	'chance/cover-card'             => 'theatrum/cover-card',
	'chance/list-icons'             => 'theatrum/list-icons',
	'chance/list-item-icon'         => 'theatrum/list-item-icon',
	'chance/list-thumbnail'         => 'theatrum/list-thumbnail',
	'chance/list-item-thumbnail'    => 'theatrum/list-item-thumbnail',
	'chance/meta-button'            => 'theatrum/meta-button',
	'chance/meta-date'              => 'theatrum/meta-date',
	'chance/meta-embed'             => 'theatrum/meta-embed',
	'chance/meta-field'             => 'theatrum/meta-field',
	'chance/meta-file'              => 'theatrum/meta-file',
	'chance/meta-gallery'           => 'theatrum/meta-gallery',
	'chance/meta-icon'              => 'theatrum/meta-icon',
	'chance/meta-image'             => 'theatrum/meta-image',
	'chance/meta-related'           => 'theatrum/meta-related',
	'chance/meta-repeater'          => 'theatrum/meta-repeater',
	'chance/meta-time'              => 'theatrum/meta-time',
	'chance/popover'                => 'theatrum/popover',
	'chance/popover-content'        => 'theatrum/popover-content',
	'chance/popover-trigger'        => 'theatrum/popover-trigger',
	'chance/popup'                  => 'theatrum/popup',
	'chance/performances-list'      => 'theatrum/performances-list',
	'chance/production-quotes'      => 'theatrum/production-quotes',
	'chance/production-tabs'        => 'theatrum/production-tabs',
	'chance/tab'                    => 'theatrum/tab',
	'chance/tab-content'            => 'theatrum/tab-content',
	'chance/tab-heading'            => 'theatrum/tab-heading',
	'chance/query-filter'           => 'theatrum/query-filter',
	'chance/site-option'            => 'theatrum/site-option',
	'chance/slider'                 => 'theatrum/slider',
	'chance/slider-item'            => 'theatrum/slider-item',
	'chance/term-meta'              => 'theatrum/term-meta',
	'chance/title-advanced'         => 'theatrum/title-advanced',
	// NOT included on purpose: chance/artist-credits, chance/production-credits
	// — those are registered by the chance-ollie theme, not this plugin.
];

const THEATRUM_BINDING_SOURCE_MAP = [
	'chance/post-meta' => 'theatrum/post-meta',
];

// Persisted `metadata.name` default values baked in by the core-block
// variations in src/meta-variations.js and src/popup-trigger-variation.js.
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
 * Recursively rewrites className-bearing strings (attrs values, innerHTML,
 * innerContent chunks) that reference the auto-generated wp-block-chance-x
 * wrapper class.
 *
 * @param mixed $value
 * @param int   &$count Incremented once per string actually changed.
 * @return mixed
 */
function theatrum_rewrite_wrapper_class($value, &$count)
{
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
 * Migrates a single block's `attrs`: bindings source and variation
 * metadata name. Both are exact-value lookups (the incoming string must
 * match a known old value exactly), so — unlike the wrapper-class rewrite —
 * these are safe to apply unconditionally, regardless of which block they
 * belong to.
 *
 * @param array $attrs
 * @param array &$stats
 * @return array
 */
function theatrum_migrate_attrs(array $attrs, array &$stats)
{
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
 * Recursively migrates a parse_blocks() tree in place (blockName, attrs,
 * innerHTML, innerContent, innerBlocks).
 *
 * IMPORTANT: the wp-block-chance-x wrapper-class rewrite is deliberately
 * scoped to only run on a block whose *own* name is in
 * THEATRUM_BLOCK_NAME_MAP (checked via the block's ORIGINAL name, before
 * renaming). A block's own wrapper class is always derived from its own
 * registered name — never from some other block's — so this is a safe and
 * precise way to target it. Running the classname rewrite unconditionally
 * on every string in every block (an earlier version of this script did
 * that) would also corrupt classes on completely unrelated, never-renamed
 * blocks whose name merely happens to start with "chance/" — e.g. the
 * theme-owned chance/artist-credits and chance/production-credits, which
 * are intentionally NOT in THEATRUM_BLOCK_NAME_MAP and must be left
 * byte-for-byte untouched. Caught by this script's own smoke test before
 * this ever ran against a database — see migrations/README.md if present,
 * or the project's final rename report, for the test that caught it.
 *
 * @param array $blocks
 * @param array &$stats
 * @return array
 */
function theatrum_migrate_blocks(array $blocks, array &$stats)
{
	foreach ($blocks as &$block) {
		if (! is_array($block)) {
			continue;
		}

		$original_name = $block['blockName'] ?? null;
		$is_renamed_block = $original_name !== null && isset(THEATRUM_BLOCK_NAME_MAP[$original_name]);

		if ($is_renamed_block) {
			$block['blockName'] = THEATRUM_BLOCK_NAME_MAP[$original_name];
			$stats['block_names']++;
		}

		if (! empty($block['attrs']) && is_array($block['attrs'])) {
			$block['attrs'] = theatrum_migrate_attrs($block['attrs'], $stats);
		}

		// Raw saved markup — see the file header for why this can't be
		// skipped in favor of just renaming attrs.className. Only touched
		// when this specific block is one we're actually renaming.
		if ($is_renamed_block) {
			if (! empty($block['attrs']) && is_array($block['attrs'])) {
				$block['attrs'] = theatrum_rewrite_wrapper_class($block['attrs'], $stats['classnames']);
			}

			if (! empty($block['innerHTML']) && is_string($block['innerHTML'])) {
				$block['innerHTML'] = theatrum_rewrite_wrapper_class($block['innerHTML'], $stats['classnames']);
			}

			if (! empty($block['innerContent']) && is_array($block['innerContent'])) {
				foreach ($block['innerContent'] as $i => $chunk) {
					if (is_string($chunk)) {
						$block['innerContent'][$i] = theatrum_rewrite_wrapper_class($chunk, $stats['classnames']);
					}
				}
			}
		}

		if (! empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
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
function theatrum_migrate_content($content, array &$stats)
{
	if (
		strpos($content, 'chance/') === false
		&& strpos($content, THEATRUM_OLD_WRAPPER_CLASS_FRAGMENT) === false
	) {
		return null; // Fast path — nothing this script cares about.
	}

	$blocks  = parse_blocks($content);
	$before  = ['block_names' => 0, 'bindings' => 0, 'variation_names' => 0, 'classnames' => 0];
	$blocks  = theatrum_migrate_blocks($blocks, $before);

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

$post_types = array_unique(array_merge(
	get_post_types(['public' => true], 'names'),
	['wp_block', 'wp_template', 'wp_template_part']
));

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

$totals = ['block_names' => 0, 'bindings' => 0, 'variation_names' => 0, 'classnames' => 0];
$touched_posts = 0;

foreach ($rows as $row) {
	$post = get_post($row->ID);
	if (! $post) {
		continue;
	}

	$stats   = ['block_names' => 0, 'bindings' => 0, 'variation_names' => 0, 'classnames' => 0];
	$updated = theatrum_migrate_content($post->post_content, $stats);

	if ($updated === null) {
		continue; // LIKE-matched but nothing this script maps applied (e.g. artist-credits).
	}

	$touched_posts++;
	foreach ($stats as $k => $v) {
		$totals[$k] += $v;
	}

	WP_CLI::log(sprintf(
		'#%-7s %-16s %-40s block names:%-3d bindings:%-3d variation names:%-3d classnames:%-3d',
		$row->ID,
		$row->post_type,
		mb_substr($row->post_title !== '' ? $row->post_title : '(no title)', 0, 38),
		$stats['block_names'],
		$stats['bindings'],
		$stats['variation_names'],
		$stats['classnames']
	));

	if ($apply) {
		$result = wp_update_post([
			'ID'           => $row->ID,
			'post_content' => $updated,
		], true);

		if (is_wp_error($result)) {
			WP_CLI::warning(sprintf('  #%s failed to save: %s', $row->ID, $result->get_error_message()));
		}
	}
}

WP_CLI::log('');
WP_CLI::log(sprintf(
	'%d post(s) touched — %d block name(s), %d binding source(s), %d variation name(s), %d classname string(s).',
	$touched_posts,
	$totals['block_names'],
	$totals['bindings'],
	$totals['variation_names'],
	$totals['classnames']
));

if (! $apply) {
	WP_CLI::success('Dry run complete. Re-run with \'apply\' to write changes.');
	return;
}

WP_CLI::success('Migration applied.');
