<?php


/**
 * Meta Gallery Block - Server-side render callback
 * Handles ACF gallery fields that return an array of image arrays
 */
$post_id = $block->context['postId'] ?? get_the_ID();

if (!$post_id) {
  return;
}

$key_input    = isset($attributes['keyInput'])   ? sanitize_text_field($attributes['keyInput'])   : '';
$image_size   = isset($attributes['imageSize'])  ? sanitize_key($attributes['imageSize'])         : 'large';
$columns      = isset($attributes['columns'])    ? intval($attributes['columns'])                 : 3;
$link_to      = isset($attributes['linkTo'])     ? sanitize_text_field($attributes['linkTo'])     : 'none';
$image_crop   = !empty($attributes['imageCrop']);
$show_caption = !empty($attributes['showCaption']);

if (!$key_input) {
  return;
}

// Get the raw ACF/meta value
$value = get_field($key_input, $post_id);
if ($value === null || $value === false || $value === '') {
  $value = get_post_meta($post_id, $key_input, true);
}

if (empty($value) || !is_array($value)) {
  return;
}

// Build image list
$items_html = '';

foreach ($value as $image) {
  // Resolve image data from each item (array, ID, or URL)
  $img_url     = '';
  $img_alt     = '';
  $img_caption = '';
  $attach_id   = 0;
  $full_url    = '';

  if (is_array($image)) {
    $full_url    = isset($image['url'])     ? esc_url($image['url'])          : '';
    $img_alt     = isset($image['alt'])     ? esc_attr($image['alt'])         : '';
    $img_caption = isset($image['caption']) ? wp_kses_post($image['caption']) : '';
    $attach_id   = isset($image['ID'])      ? intval($image['ID'])            : 0;

    if ($image_size !== 'full' && isset($image['sizes'][$image_size])) {
      $img_url = esc_url($image['sizes'][$image_size]);
    } else {
      $img_url = $full_url;
    }
  } elseif (is_numeric($image)) {
    $attach_id = intval($image);
    $src = wp_get_attachment_image_src($attach_id, $image_size);
    $full_src = wp_get_attachment_image_src($attach_id, 'full');
    if ($src) {
      $img_url   = esc_url($src[0]);
      $full_url  = $full_src ? esc_url($full_src[0]) : $img_url;
      $img_alt   = esc_attr(get_post_meta($attach_id, '_wp_attachment_image_alt', true));
      $img_caption = wp_kses_post(wp_get_attachment_caption($attach_id));
    }
  } elseif (is_string($image)) {
    $img_url  = esc_url($image);
    $full_url = $img_url;
  }

  if (!$img_url) {
    continue;
  }

  // Determine link
  $link_open  = '';
  $link_close = '';
  if ($link_to === 'media') {
    $link_open  = sprintf('<a href="%s">', $full_url ?: $img_url);
    $link_close = '</a>';
  } elseif ($link_to === 'attachment' && $attach_id) {
    $link_open  = sprintf('<a href="%s">', esc_url(get_attachment_link($attach_id)));
    $link_close = '</a>';
  }

  $crop_style = $image_crop
    ? ' style="width:100%;height:200px;object-fit:cover;"'
    : ' style="width:100%;height:auto;"';

  $img_tag = sprintf('<img src="%s" alt="%s" class="wp-image-%s"%s />', $img_url, $img_alt, $attach_id, $crop_style);

  $caption_html = ($show_caption && $img_caption)
    ? sprintf('<figcaption class="wp-element-caption">%s</figcaption>', $img_caption)
    : '';

  $items_html .= sprintf(
    '<li class="blocks-gallery-item"><figure>%s%s%s</figure></li>',
    $link_open,
    $img_tag,
    $link_close
  );

  if ($caption_html) {
    // Rewrite to put caption inside figure correctly
    $items_html = substr($items_html, 0, -strlen('</figure></li>'));
    $items_html .= $caption_html . '</figure></li>';
  }
}

if (!$items_html) {
  return;
}

$col_style = sprintf('grid-template-columns: repeat(%d, 1fr);', $columns);

printf(
  '<figure %s><ul class="wp-block-gallery blocks-gallery-grid" style="display:grid;%s;gap:8px;">%s</ul></figure>',
  get_block_wrapper_attributes(['class' => 'wp-block-chance-meta-gallery']),
  $col_style,
  $items_html
);
