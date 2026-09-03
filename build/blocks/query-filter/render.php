<?php

if ( ! defined('ABSPATH')) {
	exit;
}

/**
 * Server-side render for the theatrum/query-filter block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 */

$query_id    = absint($attributes['queryId'] ?? 0);
$filter_type = $attributes['filterType'] ?? 'taxonomy';
$taxonomy    = $attributes['taxonomy'] ?? 'season';
$param_name  = $attributes['paramName'] ?? 'season';
$label       = $attributes['label'] ?? 'Season';
$show_label  = (bool) ($attributes['showLabel'] ?? true);
$all_label   = $attributes['allLabel'] ?? 'All';
$layout      = $attributes['layout'] ?? 'horizontal';

// GET params are namespaced by queryId (`season-q23`) so multiple Query Loop + filter pairs can
// coexist without URL collisions; theatrum_apply_query_filter() in inc/query-filter.php reads this
// same key and must stay in sync. queryId 0 falls back to the bare param; orderby always uses its own field.
$field_name = $query_id
  ? (('orderby' === $filter_type) ? "orderby-q{$query_id}" : "{$param_name}-q{$query_id}")
  : (('orderby' === $filter_type) ? 'orderby' : $param_name);

// Read the current active value from URL params (sanitized).
$current_value = isset($_GET[$field_name]) ? sanitize_text_field(wp_unslash($_GET[$field_name])) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Front-end faceted filter/sort read from GET; no state change, value sanitized + unslashed.

// Build the form action URL (path only, no query string).
$action_url = strtok(isset($_SERVER['REQUEST_URI']) ? esc_url_raw(wp_unslash($_SERVER['REQUEST_URI'])) : '/', '?'); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Front-end faceted filter/sort read from GET; no state change, value sanitized + unslashed.

// Build terms list for taxonomy filters.
$terms = [];
if ('taxonomy' === $filter_type) {
$terms = get_terms(
    [
    'taxonomy'   => $taxonomy,
    'hide_empty' => true,
    'orderby'    => 'name',
    'order'      => 'ASC',
    ]
);

  if (is_wp_error($terms) || empty($terms)) {
    return;
  }
}

// Collect other active GET params to preserve on submit; skips the namespaced field name and its
// bare form so switching a block's Target Query Loop doesn't leave a stale duplicate param.
$preserved_params = [];
$skip_params      = ['paged', 'page', $field_name, $param_name, 'orderby'];
foreach ($_GET as $key => $value) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Front-end faceted filter/sort read from GET; no state change, value sanitized + unslashed.
  $key = sanitize_key($key);
  if (in_array($key, $skip_params, true) || ! is_string($value)) {
    continue;
  }
  $preserved_params[$key] = sanitize_text_field(wp_unslash($value));
}

// Interactivity API context: view.js is queryId-agnostic (just writes whatever param name it's
// given), so handing it the already-namespaced $field_name scopes client-side updates too.
$context = wp_interactivity_data_wp_context(['paramName' => $field_name]);

$wrapper_attributes = get_block_wrapper_attributes(
    [
    'class'               => 'query-filter query-filter--' . esc_attr($layout),
    'data-wp-interactive' => 'theatrum/query-filter',
    ]
);
?>

<div <?php echo wp_kses_data($wrapper_attributes); ?> <?php echo $context; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- output of wp_interactivity_data_wp_context() (already an escaped attribute string). ?>>
  <?php if ($show_label) : ?>
    <span class="query-filter__label"><?php echo esc_html($label); ?></span>
  <?php endif; ?>

  <form class="query-filter__form" method="GET" action="<?php echo esc_url($action_url); ?>">
    <?php foreach ($preserved_params as $key => $value) : ?>
      <input type="hidden" name="<?php echo esc_attr($key); ?>" value="<?php echo esc_attr($value); ?>">
    <?php endforeach; ?>

    <?php if ('taxonomy' === $filter_type) : ?>
      <select
        name="<?php echo esc_attr($field_name); ?>"
        class="query-filter__select"
        data-wp-on--change="actions.updateFilter"
        aria-label="<?php echo esc_attr($label); ?>">
        <option value="" <?php selected($current_value, ''); ?>>
          <?php echo esc_html($all_label); ?>
        </option>
        <?php foreach ($terms as $term) : ?>
          <option value="<?php echo esc_attr($term->slug); ?>" <?php selected($current_value, $term->slug); ?>>
            <?php echo esc_html($term->name); ?>
          </option>
        <?php endforeach; ?>
      </select>

    <?php elseif ('orderby' === $filter_type) : ?>
      <select
        name="<?php echo esc_attr($field_name); ?>"
        class="query-filter__select"
        data-wp-on--change="actions.updateFilter"
        aria-label="<?php echo esc_attr($label); ?>">
        <option value="date" <?php selected($current_value ?: 'date', 'date'); ?>>
          <?php esc_html_e('Newest first', 'theatrum-blocks'); ?>
        </option>
        <option value="date-asc" <?php selected($current_value, 'date-asc'); ?>>
          <?php esc_html_e('Oldest first', 'theatrum-blocks'); ?>
        </option>
        <option value="title" <?php selected($current_value, 'title'); ?>>
          <?php esc_html_e('Title A–Z', 'theatrum-blocks'); ?>
        </option>
        <option value="title-desc" <?php selected($current_value, 'title-desc'); ?>>
          <?php esc_html_e('Title Z–A', 'theatrum-blocks'); ?>
        </option>
      </select>
    <?php endif; ?>

    <button type="submit" class="query-filter__submit">
      <?php esc_html_e('Apply', 'theatrum-blocks'); ?>
    </button>
  </form>
</div>