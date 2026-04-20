<?php


/**
 * Render Production Details Block
 *
 * Displays production venue and room details from post meta.
 * Reads from _venue and _venue_room post metadata.
 *
 * @param array  $attributes Block attributes
 * @param string $content    Block content
 * @param object $block      Block object
 *
 * @return string
 */
// Only show on ct-production post type
if (get_post_type() !== 'ct-production') {
  return;
}

  $post_id = get_the_ID();

  // Retrieve production details from post meta
  $venue = get_post_meta($post_id, '_venue', true);
  $venue_room = get_post_meta($post_id, '_venue_room', true);

if (empty($venue) && empty($venue_room)) {
  return;
}

$html = '<div class="production-details">';

if (!empty($venue)) {
  $html .= '<p class="production-venue">';
  $html .= '<strong>' . esc_html__('Venue:', 'chance-ollie') . '</strong> ';
  $html .= esc_html($venue);
  $html .= '</p>';
}

if (!empty($venue_room)) {
  $html .= '<p class="production-venue-room">';
  $html .= '<strong>' . esc_html__('Venue Room:', 'chance-ollie') . '</strong> ';
  $html .= esc_html($venue_room);
  $html .= '</p>';
}

$html .= '</div>';

echo $html;
