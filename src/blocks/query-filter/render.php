<?php

/**
 * Server-side render for the chance/query-filter block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 */

$filter_type  = $attributes['filterType'] ?? 'taxonomy';
$taxonomy     = $attributes['taxonomy'] ?? 'season';
$param_name   = $attributes['paramName'] ?? 'season';
$label        = $attributes['label'] ?? 'Season';
$show_label   = (bool) ($attributes['showLabel'] ?? true);
$all_label    = $attributes['allLabel'] ?? 'All';
$layout       = $attributes['layout'] ?? 'horizontal';

// Read the current active value from URL params (sanitized). The orderby
// mode always submits as `?orderby=`, independent of $param_name — see the
// hardcoded select name below.
$current_value_param = ('orderby' === $filter_type) ? 'orderby' : $param_name;
$current_value = isset($_GET[$current_value_param]) ? sanitize_text_field(wp_unslash($_GET[$current_value_param])) : '';

// Build the form action URL (path only, no query string).
$action_url = strtok(isset($_SERVER['REQUEST_URI']) ? esc_url_raw($_SERVER['REQUEST_URI']) : '/', '?');

// Build terms list for taxonomy filters.
$terms = [];
if ('taxonomy' === $filter_type) {
  $terms = get_terms([
    'taxonomy'   => $taxonomy,
    'hide_empty' => true,
    'orderby'    => 'name',
    'order'      => 'ASC',
  ]);

  if (is_wp_error($terms) || empty($terms)) {
    return;
  }
}

// Collect other active GET params to preserve when this form is submitted without JS.
$preserved_params = [];
$skip_params      = ['paged', 'page', $param_name];
foreach ($_GET as $key => $value) {
  $key = sanitize_key($key);
  if (in_array($key, $skip_params, true) || !is_string($value)) {
    continue;
  }
  $preserved_params[$key] = sanitize_text_field(wp_unslash($value));
}

// Interactivity API per-block context.
$context = wp_interactivity_data_wp_context(['paramName' => $param_name]);

$wrapper_attributes = get_block_wrapper_attributes([
  'class'                => 'query-filter query-filter--' . esc_attr($layout),
  'data-wp-interactive' => 'chance/query-filter',
]);
?>

<div <?php echo $wrapper_attributes; ?> <?php echo $context; ?>>
  <?php if ($show_label) : ?>
    <span class="query-filter__label"><?php echo esc_html($label); ?></span>
  <?php endif; ?>

  <form class="query-filter__form" method="GET" action="<?php echo esc_url($action_url); ?>">
    <?php foreach ($preserved_params as $key => $value) : ?>
      <input type="hidden" name="<?php echo esc_attr($key); ?>" value="<?php echo esc_attr($value); ?>">
    <?php endforeach; ?>

    <?php if ('taxonomy' === $filter_type) : ?>
      <select
        name="<?php echo esc_attr($param_name); ?>"
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
        name="orderby"
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