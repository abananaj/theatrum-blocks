<?php


/**
 * Card Carousel Block - Server-side render callback
 */

$headline = isset($attributes['headline']) ? sanitize_text_field($attributes['headline']) : 'Headline';
$items = isset($attributes['items']) ? $attributes['items'] : [];

// Build block classes
$block_classes = 'wp-block-chance-card-carousel';
if (isset($attributes['align'])) {
  $block_classes .= ' align' . sanitize_html_class($attributes['align']);
}

// Get spacing classes if set
$margin_classes = '';
if (isset($attributes['spacing']['margin'])) {
  $margins = $attributes['spacing']['margin'];
  if (isset($margins['top'])) {
    $margin_classes .= ' has-margin-top-' . sanitize_html_class($margins['top']);
  }
  if (isset($margins['bottom'])) {
    $margin_classes .= ' has-margin-bottom-' . sanitize_html_class($margins['bottom']);
  }
}

$padding_classes = '';
if (isset($attributes['spacing']['padding'])) {
  $paddings = $attributes['spacing']['padding'];
  if (isset($paddings['top'])) {
    $padding_classes .= ' has-padding-top-' . sanitize_html_class($paddings['top']);
  }
  if (isset($paddings['bottom'])) {
    $padding_classes .= ' has-padding-bottom-' . sanitize_html_class($paddings['bottom']);
  }
}

$block_classes .= $margin_classes . $padding_classes;

ob_start();
?>
<div class="<?php echo esc_attr($block_classes); ?>">
  <div class="ct-carousel-wrapper">
    <div class="ct-carousel-header">
      <h2 class="ct-carousel-headline"><?php echo wp_kses_post($headline); ?></h2>
      <div class="ct-carousel-controls">
        <button class="ct-carousel-arrow disabled ct-arrow-prev" aria-label="Previous"></button>
        <button class="ct-carousel-arrow ct-arrow-next" aria-label="Next"></button>
      </div>
    </div>
    <ul class="ct-carousel-content">
      <?php if (!empty($items) && is_array($items)) : ?>
        <?php foreach ($items as $item) : ?>
          <?php
          $item_image = isset($item['image']) ? esc_url($item['image']) : '';
          $item_title = isset($item['title']) ? wp_kses_post($item['title']) : '';
          $item_subtitle = isset($item['subtitle']) ? wp_kses_post($item['subtitle']) : '';
          $item_link = isset($item['link']) ? esc_url($item['link']) : '#';
          ?>
          <li class="ct-carousel-card">
            <a href="<?php echo $item_link; ?>">
              <?php if ($item_image) : ?>
                <img class="ct-carousel-card-image" src="<?php echo $item_image; ?>" alt="<?php echo esc_attr($item_title); ?>" />
              <?php endif; ?>
              <div class="ct-carousel-card-description">
                <h3 class="ct-carousel-card-title"><?php echo $item_title; ?></h3>
                <span class="ct-carousel-card-subtitle"><?php echo $item_subtitle; ?></span>
              </div>
            </a>
          </li>
        <?php endforeach; ?>
      <?php endif; ?>
    </ul>
  </div>
</div>
<?php
echo ob_get_clean();

// Register the block if it doesn't have render in block.json
// register_block_type(
//   __DIR__,
//   array(
//     'render_callback' => 'render_card_carousel_block',
//   )
// );
