<?php

if ( ! defined('ABSPATH')) {
	exit;
}

/**
 * Applies theatrum/query-filter blocks to the Query Loop they target: reads the namespaced GET param (`{param}-q{id}`, see render.php) and folds it into the matching queryId's args via `query_loop_block_query_vars`. Scoped to filter blocks in the same post as the Query Loop — one targeting a Loop in a different template part/pattern won't be found.
 */

/**
 * Recursively collects every block of a given name from a parsed block tree.
 *
 * @param array  $blocks Parsed blocks (from parse_blocks()).
 * @param string $name   Block name to match, e.g. 'theatrum/query-filter'.
 * @return array Matching blocks, each with its 'attrs'.
 */
function theatrum_find_blocks_by_name(array $blocks, string $name): array {
  $found = [];

  foreach ($blocks as $block) {
    if (($block['blockName'] ?? '') === $name) {
      $found[] = $block;
    }
    if ( ! empty($block['innerBlocks'])) {
      $found = array_merge($found, theatrum_find_blocks_by_name($block['innerBlocks'], $name));
    }
  }

  return $found;
}

/**
 * All theatrum/query-filter blocks in the post currently being rendered.
 * Cached per-request since a page can render several Query Loops.
 *
 * @return array
 */
function theatrum_query_filter_blocks_in_current_post(): array {
  static $cache = null;

  if ($cache !== null) {
    return $cache;
  }

  $post_id = get_queried_object_id() ?: get_the_ID();
  $content = $post_id ? get_post_field('post_content', $post_id) : '';

  $cache = $content ? theatrum_find_blocks_by_name(parse_blocks($content), 'theatrum/query-filter') : [];

  return $cache;
}

/**
 * Builds the namespaced GET field name a query-filter block submits under.
 * Mirrors the same computation in render.php — the two must stay in sync.
 *
 * @param array $attrs    The theatrum/query-filter block's attrs.
 * @param int   $query_id The Query Loop's queryId (already known non-zero by the caller).
 * @return string
 */
function theatrum_query_filter_field_name(array $attrs, int $query_id): string {
  $filter_type = $attrs['filterType'] ?? 'taxonomy';
  $param_name  = $attrs['paramName'] ?? 'season';

  return ('orderby' === $filter_type) ? "orderby-q{$query_id}" : "{$param_name}-q{$query_id}";
}

/**
 * Folds one query-filter block's GET value into a Query Loop's args.
 *
 * @param array $query    WP_Query args being built for the Query Loop.
 * @param array $attrs    The theatrum/query-filter block's attrs.
 * @param int   $query_id The Query Loop's queryId.
 * @return array
 */
function theatrum_apply_query_filter(array $query, array $attrs, int $query_id): array {
  $field_name = theatrum_query_filter_field_name($attrs, $query_id);

  if ( ! isset($_GET[$field_name])) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Front-end faceted filter/sort read from GET; no state change, value sanitized + unslashed.
    return $query;
  }

  $value = sanitize_text_field(wp_unslash($_GET[$field_name])); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Front-end faceted filter/sort read from GET; no state change, value sanitized + unslashed.
  if ('' === $value) {
    return $query;
  }

  $filter_type = $attrs['filterType'] ?? 'taxonomy';

  if ('orderby' === $filter_type) {
    switch ($value) {
      case 'date-asc':
        $query['orderby'] = 'date';
        $query['order']   = 'ASC';
        break;
      case 'title':
        $query['orderby'] = 'title';
        $query['order']   = 'ASC';
        break;
      case 'title-desc':
        $query['orderby'] = 'title';
        $query['order']   = 'DESC';
        break;
      default: // 'date' — newest first.
        $query['orderby'] = 'date';
        $query['order']   = 'DESC';
    }

    return $query;
  }

  $taxonomy = $attrs['taxonomy'] ?? 'season';
  if ( ! taxonomy_exists($taxonomy)) {
    return $query;
  }

  // phpcs:ignore WordPress.DB.SlowDBQuery -- the query-filter block's whole purpose; the term set is one taxonomy.
  $query['tax_query']   = $query['tax_query'] ?? [];
  $query['tax_query'][] = [
    'taxonomy' => $taxonomy,
    'field'    => 'slug',
    'terms'    => $value,
  ];

  return $query;
}

add_filter(
    'query_loop_block_query_vars',
    function ($query, $block) {
    $query_id = absint($block->context['queryId'] ?? 0);
    if ( ! $query_id) {
      return $query;
    }

    foreach (theatrum_query_filter_blocks_in_current_post() as $filter_block) {
      $attrs = $filter_block['attrs'] ?? [];

      if (absint($attrs['queryId'] ?? 0) !== $query_id) {
        continue;
      }

      $query = theatrum_apply_query_filter($query, $attrs, $query_id);
    }

    return $query;
    },
    10,
    2
);
