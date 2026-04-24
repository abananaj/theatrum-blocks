<?php

/**
 * Onstage Current block - file template
 * $attributes, $content, $block are injected by WordPress.
 */

$production_id = isset($attributes['productionId']) ? intval($attributes['productionId']) : 0;
$button_text = isset($attributes['buttonText']) ? sanitize_text_field($attributes['buttonText']) : 'Learn More';

// Get the production to display
if ($production_id > 0) {
  // Use explicitly selected production
  $production = get_post($production_id);
  if (!$production || 'ct-production' !== $production->post_type) {
    return;
  }
  $prod_data = chance_build_production_data($production);
} else {
  // Use automatic current/next production
  if (!function_exists('chance_get_current_production')) {
    return;
  }
  $prod_data = chance_get_current_production();
}

if (!$prod_data) {
  echo '<p>' . esc_html__('No production scheduled.', 'onstage-current') . '</p>';
  return;
}

$featured_image_url = $prod_data['featured_image'] ?? '';
$featured_image_style = $featured_image_url ? ' style="background-image: url(' . esc_url($featured_image_url) . ');"' : '';

?>

<<?php echo tag_escape('a'); ?> href="<?php echo esc_url($prod_data['url']); ?>" <?php echo get_block_wrapper_attributes(array('class' => 'wp-block-production-card')); ?>>
  <div class="wp-block-cover wp-block-cover__inner-container" <?php echo $featured_image_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 
                                                              ?>>
    <div class="wp-block-cover__gradient-background"></div>
    <div class="wp-block-cover__content">
      <div class="wp-block-production-card__bottom-bar">
        <h3 class="wp-block-production-card__title">
          <?php echo esc_html($prod_data['title']); ?>
        </h3>
        <div class="wp-block-production-card__meta">
          <p class="wp-block-production-card__dates">
            <?php
            echo esc_html(chance_format_production_date($prod_data['opening']));
            if ($prod_data['closing']) {
              echo ' - ' . esc_html(chance_format_production_date($prod_data['closing']));
            }
            ?>
          </p>
          <button class="wp-block-button__link wp-element-button">
            <?php echo esc_html($button_text); ?>
          </button>
        </div>
      </div>
    </div>
  </div>
</<?php echo tag_escape('a'); ?>>