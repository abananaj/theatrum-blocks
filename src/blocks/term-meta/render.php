<?php

/**
 * Render the Term Meta block on the frontend
 * Handles both generic term meta and season producer displays
 */

$display_type = isset($attributes['displayType']) ? $attributes['displayType'] : 'generic';

// Handle season producer display
if ($display_type === 'season-producer') {
  $post_id      = get_the_ID();
  $meta_key     = isset($attributes['metaKey']) ? sanitize_key($attributes['metaKey']) : 'season_producers';
  $heading_text  = isset($attributes['headingText']) ? sanitize_text_field($attributes['headingText']) : '';
  $heading_level = isset($attributes['headingLevel']) ? sanitize_text_field($attributes['headingLevel']) : 'h2';

  // Validate heading level
  $allowed_headings = array('h2', 'h3', 'h4', 'h5', 'h6');
  if (!in_array($heading_level, $allowed_headings, true)) {
    $heading_level = 'h2';
  }

  if (!$post_id) {
    return;
  }

  // Get the season term for the current post
  $terms = get_the_terms($post_id, 'season');

  if (empty($terms) || is_wp_error($terms)) {
    return;
  }

  $season_term = $terms[0];

  // Get the field value from the season term (supports ACF)
  $producers = array();

  if (function_exists('get_field')) {
    $field_value = get_field($meta_key, 'term_' . $season_term->term_id);
  } else {
    $field_value = get_term_meta($season_term->term_id, $meta_key, true);
  }

  if (empty($field_value)) {
    return;
  }

  // Normalize to array of post IDs
  $items = is_array($field_value) ? $field_value : array($field_value);

  foreach ($items as $item) {
    if (is_a($item, 'WP_Post')) {
      $producers[] = $item->post_title;
    } elseif (is_array($item) && isset($item['post_title'])) {
      $producers[] = $item['post_title'];
    } elseif (is_numeric($item)) {
      $post = get_post(intval($item));
      if ($post) {
        $producers[] = $post->post_title;
      }
    }
  }

  if (empty($producers)) {
    return;
  }

?>
  <div <?php echo wp_kses_data( get_block_wrapper_attributes(['class' => 'season-producer-list-wrap']) ); ?>>
    <?php if ($heading_text !== '') : ?>
      <<?php echo $heading_level; ?> class="season-producer-heading"><?php echo esc_html($heading_text); ?></<?php echo $heading_level; ?>>
    <?php endif; ?>
    <ul class="season-producer-list">
      <?php foreach ($producers as $title) : ?>
        <li class="season-producer-item"><?php echo esc_html($title); ?></li>
      <?php endforeach; ?>
    </ul>
  </div>
<?php
  return;
}

// Handle generic term meta display
$term_id = isset($attributes['termId']) ? intval($attributes['termId']) : 0;
$meta_key = isset($attributes['metaKey']) ? sanitize_text_field($attributes['metaKey']) : '';
$tag = isset($attributes['tagName']) ? sanitize_text_field($attributes['tagName']) : 'p';
$prepend = isset($attributes['prepend']) ? $attributes['prepend'] : '';
$append = isset($attributes['append']) ? $attributes['append'] : '';

if (!$term_id || !$meta_key) {
  return;
}

// Get the term meta value
$value = get_term_meta($term_id, $meta_key, true);

if (empty($value)) {
  printf(
    '<%1$s %2$s>[%3$s]</%1$s>',
    tag_escape($tag),
    wp_kses_data( get_block_wrapper_attributes() ),
    esc_html($meta_key)
  );
  return;
}

// Resolve post ID or post object to post title
$resolved = null;

if (is_numeric($value)) {
  $post = get_post(intval($value));
  if ($post instanceof WP_Post) {
    $resolved = get_the_title($post);
  }
} elseif ($value instanceof WP_Post) {
  $resolved = get_the_title($value);
} elseif (is_array($value) && isset($value['ID'])) {
  $resolved = get_the_title(intval($value['ID']));
}

$display_value = $prepend . esc_html($resolved ?? $value) . $append;

printf(
  '<%1$s %2$s>%3$s</%1$s>',
  tag_escape($tag),
  get_block_wrapper_attributes(),
  $display_value
);
