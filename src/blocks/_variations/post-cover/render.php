<?php
/**
 * Post Cover Block — Render template
 * $attributes, $content, $block are injected by WordPress.
 */

$post_id = isset($attributes['postId']) ? intval($attributes['postId']) : 0;
$dim_ratio = isset($attributes['dimRatio']) ? intval($attributes['dimRatio']) : 50;
$overlay_color = isset($attributes['customOverlayColor']) ? sanitize_text_field($attributes['customOverlayColor']) : (isset($attributes['overlayColor']) ? sanitize_text_field($attributes['overlayColor']) : '#000000');
$focal_point = isset($attributes['focalPoint']) ? $attributes['focalPoint'] : array('x' => 0.5, 'y' => 0.5);
$min_height = isset($attributes['minHeight']) ? intval($attributes['minHeight']) : 300;
$min_height_unit = isset($attributes['minHeightUnit']) ? sanitize_text_field($attributes['minHeightUnit']) : 'px';
$content_position = isset($attributes['contentPosition']) ? sanitize_text_field($attributes['contentPosition']) : 'center center';
$is_dark = isset($attributes['isDark']) ? (bool) $attributes['isDark'] : false;
$is_repeated = isset($attributes['isRepeated']) ? (bool) $attributes['isRepeated'] : false;

// Get the post
$post = get_post($post_id);

if (!$post) {
  return '<div class="wp-block-chance-post-cover wp-block-cover">' . __('Please select a post', 'theatrum-blocks') . '</div>';
}

// Get featured image
$featured_image_url = '';
if (has_post_thumbnail($post->ID)) {
  $featured_image_url = get_the_post_thumbnail_url($post->ID, 'full');
}

// Build background image style
$bg_image_style = '';
if ($featured_image_url) {
  $bg_image_style = 'background-image: url(' . esc_url($featured_image_url) . ');';
  $bg_image_style .= 'background-size: ' . ($is_repeated ? 'auto' : 'cover') . ';';
  $bg_image_style .= 'background-repeat: ' . ($is_repeated ? 'repeat' : 'no-repeat') . ';';
  $bg_image_style .= 'background-position: ' . floatval($focal_point['x']) * 100 . '% ' . floatval($focal_point['y']) * 100 . '%;';
}

// Build overlay style
$overlay_opacity = $dim_ratio / 100;
$overlay_style = 'background-color: ' . esc_attr($overlay_color) . '; opacity: ' . floatval($overlay_opacity) . ';';

// Build content position styles
$content_position_map = array(
  'center center' => 'center',
  'center top' => 'flex-start',
  'center bottom' => 'flex-end',
  'left center' => 'center',
  'right center' => 'center',
);
$align_items = isset($content_position_map[$content_position]) ? $content_position_map[$content_position] : 'center';

// Build wrapper style
$wrapper_style = 'min-height: ' . intval($min_height) . esc_attr($min_height_unit) . ';';
$text_color = $is_dark ? '#ffffff' : '#000000';

// Get block wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes(array(
  'class' => 'wp-block-cover',
  'style' => $wrapper_style,
));
?>
<div <?php echo $wrapper_attributes; ?>>
  <?php if ($featured_image_url) : ?>
    <div class="wp-block-cover__image-background" style="<?php echo esc_attr($bg_image_style); ?>"></div>
  <?php endif; ?>
  <div class="wp-block-cover__overlay" style="<?php echo esc_attr($overlay_style); ?>"></div>
  <div class="wp-block-cover__inner-container" style="display: flex; flex-direction: column; align-items: <?php echo esc_attr($align_items); ?>; justify-content: <?php echo esc_attr($align_items); ?>; z-index: 1; position: relative; width: 100%; height: 100%; color: <?php echo esc_attr($text_color); ?>;">
    <?php echo do_blocks($content); ?>
  </div>
</div>
