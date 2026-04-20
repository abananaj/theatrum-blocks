<?php


/**
 * Production Credits Block - Server-side render callback
 */
$post_id = get_the_ID();

if (!$post_id) {
  return;
}

// Query for ct-credit posts where meta field 'production' = current post ID
$args = array(
  'post_type' => 'ct-credit',
  'posts_per_page' => -1,
  'meta_query' => array(
    array(
      'key' => 'production',
      'value' => $post_id,
      'compare' => '=',
    ),
  ),
);

$query = new WP_Query($args);

if (!$query->have_posts()) {
  return;
}

$html = '<div class="wp-block-chance-production-credits"><ul class="production-credits-list">';

while ($query->have_posts()) {
  $query->the_post();
  $credit_id = get_the_ID();
  $artist_id = get_post_meta($credit_id, 'artist', true);
  $role = get_post_meta($credit_id, 'role', true);

  if ($artist_id) {
    $artist_title = get_the_title($artist_id);
    $artist_url = get_permalink($artist_id);

    // Display role, or fallback to role-group if role is blank
    $display_role = $role;
    if (empty($display_role)) {
      $display_role = get_post_meta($credit_id, 'role-group', true);
    }

    $html .= '<li>';
    $html .= '<img src="' . esc_url(get_the_post_thumbnail_url($artist_id)) . '" alt="' . esc_attr($artist_title) . '" class="artist-headshot"/>';
    $html .= '<div class="artist-info">';

    if (!empty($display_role)) {
      $html .= '<div class="role">' . esc_html($display_role) . '</div>';
    }

    $html .= '<a href="' . esc_url($artist_url) . '" class="artist">' . esc_html($artist_title) . '</a>';
    $html .= '</div>';
    $html .= '</li>';
  }
}

$html .= '</ul></div>';

wp_reset_postdata();

echo $html;
