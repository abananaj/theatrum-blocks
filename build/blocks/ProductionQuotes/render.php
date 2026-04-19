<?php

/**
 * Production Quotes Block - Server-side render callback
 */

function render_production_quotes_block($attributes, $content, $block)
{
  $post_id = $block->context['postId'] ?? 0;

  if (!$post_id) {
    return '';
  }

  $post = get_post($post_id);

  if (!$post) {
    return '';
  }

  // Get quotes ACF repeater field
  $quotes = get_field('quotes', $post->ID);

  if (empty($quotes)) {
    return '';
  }

  $output = '<div class="wp-block-chance-production-quotes">';

  foreach ($quotes as $quote_row) {
    $quote_text = isset($quote_row['quote-text']) ? $quote_row['quote-text'] : '';
    $source = isset($quote_row['quote-cite']) ? $quote_row['quote-cite'] : '';
    $quote_link_id = isset($quote_row['quote-link']) ? $quote_row['quote-link'] : '';

    if (!$quote_text) {
      continue;
    }

    $output .= '<div class="wp-block-chance-production-quotes-item">';
    $output .= '<blockquote class="wp-block-quote">';
    $output .= '<p>' . wp_kses_post($quote_text) . '</p>';

    if ($source) {
      $output .= '<p><em>';

      if ($quote_link_id) {
        $quote_link_url = get_permalink($quote_link_id);
        if ($quote_link_url) {
          $output .= '<a href="' . esc_url($quote_link_url) . '">' . esc_html($source) . '</a>';
        } else {
          $output .= esc_html($source);
        }
      } else {
        $output .= esc_html($source);
      }

      $output .= '</em></p>';
    }

    $output .= '</blockquote>';
    $output .= '</div>';
  }

  $output .= '</div>';

  return $output;
}
