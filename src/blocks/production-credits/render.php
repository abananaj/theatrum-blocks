<?php

/**
 * Production Credits Block - Server-side render callback
 *
 * Displays the ct-artists credited for the current ct-production,
 * using the same pattern as the artist-credits block.
 */

$post_id = get_the_ID();

if (! $post_id) {
  return;
}

// Query for ct-credit posts where meta field 'production' = current post ID
$args = array(
  'post_type'      => 'ct-credit',
  'posts_per_page' => -1,
  'meta_query'     => array(
    array(
      'key'     => 'production',
      'value'   => $post_id,
      'compare' => '=',
    ),
  ),
  'orderby' => 'menu_order title',
  'order'   => 'ASC',
);

$query = new WP_Query($args);

if (! $query->have_posts()) {
  return;
}

$html = '<ul class="production-credits-ul">';

while ($query->have_posts()) {
  $query->the_post();
  $credit_id = get_the_ID();
  $artist_id = get_post_meta($credit_id, 'artist', true);
  $role      = get_post_meta($credit_id, 'role', true);

  if ($artist_id) {
    $artist_title = get_the_title($artist_id);
    $artist_url   = get_permalink($artist_id);

    // Display role, or fallback to role-group if role is blank
    $display_role = $role;
    if (empty($display_role)) {
      $display_role = get_post_meta($credit_id, 'role-group', true);
    }

    $html .= '<li class="credit">';
    $html .= '<img src="' . esc_url(get_the_post_thumbnail_url($artist_id)) . '" alt="' . esc_attr($artist_title) . '" class="artist-headshot"/>';
    $html .= '<p class="artist"><a href="' . esc_url($artist_url) . '">' . esc_html($artist_title) . '</a></p>';

    if (! empty($display_role)) {
      $html .= '<p class="role">' . esc_html($display_role) . '</p>';
    }

    $html .= '</li>';
  }
}

$html .= '</ul>';

wp_reset_postdata();

echo $html;
