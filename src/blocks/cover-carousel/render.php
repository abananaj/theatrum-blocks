<?php

/**
 * Cover Carousel Block - Server-side render callback
 */

$items = isset($attributes['items']) ? $attributes['items'] : [];
$min_height = isset($attributes['minHeight']) ? absint($attributes['minHeight']) : 300;
$min_height_unit = isset($attributes['minHeightUnit']) ? sanitize_text_field($attributes['minHeightUnit']) : 'px';
$content_position = isset($attributes['contentPosition']) ? sanitize_text_field($attributes['contentPosition']) : 'center';
$show_indicators = isset($attributes['showIndicators']) ? (bool) $attributes['showIndicators'] : true;
$indicator_style = isset($attributes['indicatorStyle']) ? sanitize_text_field($attributes['indicatorStyle']) : 'dots';
$show_arrows = isset($attributes['showArrows']) ? (bool) $attributes['showArrows'] : true;
$arrow_style = isset($attributes['arrowStyle']) ? sanitize_text_field($attributes['arrowStyle']) : 'light';
$autoplay = isset($attributes['autoplay']) ? (bool) $attributes['autoplay'] : false;
$autoplay_speed = isset($attributes['autoplaySpeed']) ? absint($attributes['autoplaySpeed']) : 5000;
$transition_type = isset($attributes['transitionType']) ? sanitize_text_field($attributes['transitionType']) : 'fade';
$transition_speed = isset($attributes['transitionSpeed']) ? absint($attributes['transitionSpeed']) : 500;

// Let WordPress generate the wrapper class plus all supports-driven
// classes/inline styles (align, className, spacing, color) so the frontend
// wrapper matches the editor. The carousel's own layout styles (min-height,
// positioning) are merged into the wrapper's style attribute.
$wrapper_attributes = get_block_wrapper_attributes(array(
  'class' => 'wp-block-chance-cover-carousel',
  'style' => 'min-height: ' . $min_height . $min_height_unit . '; position: relative; overflow: hidden;',
));

ob_start();
?>

<div <?php echo wp_kses_data( $wrapper_attributes ); ?>
  data-carousel-autoplay="<?php echo $autoplay ? 'true' : 'false'; ?>"
  data-carousel-speed="<?php echo esc_attr($autoplay_speed); ?>"
  data-carousel-transition="<?php echo esc_attr($transition_type); ?>"
  data-carousel-transition-speed="<?php echo esc_attr($transition_speed); ?>">

  <!-- Slides -->
  <div class="wp-block-chance-cover-carousel__slides">
    <?php
    if (! empty($items) && is_array($items)) :
      foreach ($items as $index => $item) :
        $item_url = isset($item['url']) ? esc_url($item['url']) : '';
        $dim_ratio = isset($item['dimRatio']) ? absint($item['dimRatio']) : 50;
        $overlay_color = isset($item['customOverlayColor']) ? sanitize_hex_color($item['customOverlayColor']) : '#000000';
        $focal_point = isset($item['focalPoint']) ? $item['focalPoint'] : ['x' => 0.5, 'y' => 0.5];
        $focal_x = isset($focal_point['x']) ? floatval($focal_point['x']) : 0.5;
        $focal_y = isset($focal_point['y']) ? floatval($focal_point['y']) : 0.5;
    ?>
        <div class="wp-block-chance-cover-carousel__slide <?php echo $index === 0 ? 'is-active' : ''; ?>"
          data-slide-index="<?php echo esc_attr($index); ?>"
          style="position: absolute; inset: 0; opacity: <?php echo $index === 0 ? '1' : '0'; ?>; transition: opacity <?php echo esc_attr($transition_speed); ?>ms <?php echo esc_attr($transition_type === 'fade' ? 'ease-in-out' : 'ease'); ?>;">

          <!-- Background Media -->
          <div class="wp-block-chance-cover-carousel__background"
            style="position: absolute; inset: 0; background-image: url(<?php echo $item_url ? esc_url($item_url) : 'none'; ?>); background-position: <?php echo esc_attr($focal_x * 100); ?>% <?php echo esc_attr($focal_y * 100); ?>%; background-size: cover; background-attachment: scroll;"></div>

          <!-- Overlay -->
          <div class="wp-block-chance-cover-carousel__overlay"
            style="position: absolute; inset: 0; background-color: <?php echo esc_attr($overlay_color); ?>; opacity: <?php echo esc_attr($dim_ratio / 100); ?>;"></div>

          <!-- Content Area -->
          <div class="wp-block-chance-cover-carousel__content wp-block-chance-cover-carousel__content--<?php echo esc_attr($content_position); ?>"
            style="position: absolute; inset: 0; display: flex; align-items: <?php
                                                                              if (strpos($content_position, 'top') !== false) {
                                                                                echo 'flex-start';
                                                                              } elseif (strpos($content_position, 'bottom') !== false) {
                                                                                echo 'flex-end';
                                                                              } else {
                                                                                echo 'center';
                                                                              }
                                                                              ?>; justify-content: <?php
                                  if (strpos($content_position, 'left') !== false) {
                                    echo 'flex-start';
                                  } elseif (strpos($content_position, 'right') !== false) {
                                    echo 'flex-end';
                                  } else {
                                    echo 'center';
                                  }
                                  ?>; padding: 2rem; z-index: 10;"></div>

        </div>
    <?php
      endforeach;
    endif;
    ?>
  </div>

  <!-- Indicators -->
  <?php if ($show_indicators) : ?>
    <div class="wp-block-chance-cover-carousel__indicators wp-block-chance-cover-carousel__indicators--<?php echo esc_attr($indicator_style); ?>">
      <?php
      if (! empty($items) && is_array($items)) :
        foreach ($items as $index => $item) :
      ?>
          <button class="wp-block-chance-cover-carousel__indicator <?php echo $index === 0 ? 'is-active' : ''; ?>"
            data-indicator-index="<?php echo esc_attr($index); ?>"
            aria-current="<?php echo $index === 0 ? 'true' : 'false'; ?>"
            aria-label="<?php echo esc_attr(sprintf(__('Go to slide %d'), $index + 1)); ?>">
            <?php if ('numbers' === $indicator_style) : ?>
              <?php echo esc_html($index + 1); ?>
            <?php endif; ?>
          </button>
      <?php
        endforeach;
      endif;
      ?>
    </div>
  <?php endif; ?>

  <!-- Navigation Arrows -->
  <?php if ($show_arrows) : ?>
    <button class="wp-block-chance-cover-carousel__arrow wp-block-chance-cover-carousel__arrow--prev wp-block-chance-cover-carousel__arrow--<?php echo esc_attr($arrow_style); ?>"
      aria-label="<?php esc_attr_e('Previous slide'); ?>">
      <span>❮</span>
    </button>
    <button class="wp-block-chance-cover-carousel__arrow wp-block-chance-cover-carousel__arrow--next wp-block-chance-cover-carousel__arrow--<?php echo esc_attr($arrow_style); ?>"
      aria-label="<?php esc_attr_e('Next slide'); ?>">
      <span>❯</span>
    </button>
  <?php endif; ?>

</div>

<?php
echo ob_get_clean();
