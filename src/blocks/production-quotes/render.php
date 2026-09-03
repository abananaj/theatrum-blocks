<?php

if ( ! defined('ABSPATH')) {
	exit;
}

/**
 * Production Quotes block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$post_id = get_the_ID() ?: ($block->context['postId'] ?? 0);

if ( ! $post_id) {
  return;
}

$post = get_post($post_id);

if ( ! $post) {
  return;
}

$quotes = function_exists('get_field') ? get_field('quotes', $post->ID) : null;

if (empty($quotes)) {
  return;
}

$wrapper_attributes = get_block_wrapper_attributes(array('class' => 'wp-block-theatrum-production-quotes'));

echo '<div ' . wp_kses_data($wrapper_attributes) . '>';

foreach ($quotes as $quote_row) {
  $quote_text    = isset($quote_row['quote-text']) ? $quote_row['quote-text'] : '';
  $source        = isset($quote_row['quote-cite']) ? $quote_row['quote-cite'] : '';
  $quote_link_id = isset($quote_row['quote-link']) ? $quote_row['quote-link'] : '';

  if ( ! $quote_text) {
    continue;
  }

  echo '<div class="wp-block-theatrum-production-quotes-item">';
  echo '<blockquote class="wp-block-quote">';
  echo '<p class="quote-text">' . wp_kses_post($quote_text) . '</p>';

  if ($source) {
    echo '<p class="quote-cite">– ';
    if ($quote_link_id) {
      $quote_link_url = get_permalink($quote_link_id);
      if ($quote_link_url) {
        echo '<a href="' . esc_url($quote_link_url) . '">' . esc_html($source) . '</a>';
      } else {
        echo esc_html($source);
      }
    } else {
      echo esc_html($source);
    }
    echo '</p>';
  }

  echo '</blockquote>';
  echo '</div>';
}

echo '</div>';
