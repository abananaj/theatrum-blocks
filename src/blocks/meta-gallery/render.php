<?php

/**
 * Meta Gallery Block - Server-side render callback
 * Handles ACF gallery fields that return an array of image arrays
 * Styled to match core/gallery block
 */

$post_id = $block->context['postId'] ?? get_the_ID();

if (!$post_id) {
  return;
}

$meta_key     = isset($attributes['metaKey']) ? sanitize_text_field($attributes['metaKey']) : '';
$size_slug    = isset($attributes['sizeSlug']) ? sanitize_key($attributes['sizeSlug']) : 'large';
$columns      = isset($attributes['columns']) ? intval($attributes['columns']) : null;
$link_to      = isset($attributes['linkTo']) ? sanitize_text_field($attributes['linkTo']) : 'none';
$image_crop   = !empty($attributes['imageCrop']);
$fixed_height = !empty($attributes['fixedHeight']);
$random_order = !empty($attributes['randomOrder']);
$aspect_ratio = isset($attributes['aspectRatio']) ? sanitize_text_field($attributes['aspectRatio']) : 'auto';
$fallback_text = isset($attributes['fallbackText']) ? sanitize_text_field($attributes['fallbackText']) : '';
$caption      = isset($attributes['caption']) ? wp_kses_post($attributes['caption']) : '';

if (!$meta_key) {
  return;
}

// Get the raw ACF/meta value
$value = function_exists('get_field') ? get_field($meta_key, $post_id) : null;
if ($value === null || $value === false || $value === '') {
  $value = get_post_meta($post_id, $meta_key, true);
}

if (empty($value) || !is_array($value)) {
  if ($fallback_text) {
    printf(
      '<figure %s><div style="text-align:center;color:#666;padding:20px;">%s</div></figure>',
      wp_kses_data( get_block_wrapper_attributes(['class' => 'wp-block-chance-meta-gallery']) ),
      esc_html($fallback_text)
    );
  }
  return;
}

// Randomize if requested
if ($random_order) {
  shuffle($value);
}

// Build image list
$items_html = '';
$image_count = 0;

foreach ($value as $image) {
  // Resolve image data from each item (array, ID, or URL)
  $img_url     = '';
  $img_alt     = '';
  $img_caption = '';
  $attach_id   = 0;
  $full_url    = '';

  if (is_array($image)) {
    $full_url    = isset($image['url']) ? esc_url($image['url']) : '';
    $img_alt     = isset($image['alt']) ? esc_attr($image['alt']) : '';
    $img_caption = isset($image['caption']) ? wp_kses_post($image['caption']) : '';
    $attach_id   = isset($image['ID']) ? intval($image['ID']) : 0;

    if ($size_slug !== 'full' && isset($image['sizes'][$size_slug])) {
      $img_url = esc_url($image['sizes'][$size_slug]);
    } else {
      $img_url = $full_url;
    }
  } elseif (is_numeric($image)) {
    $attach_id = intval($image);
    $src = wp_get_attachment_image_src($attach_id, $size_slug);
    $full_src = wp_get_attachment_image_src($attach_id, 'full');
    if ($src) {
      $img_url  = esc_url($src[0]);
      $full_url = $full_src ? esc_url($full_src[0]) : $img_url;
      $img_alt  = esc_attr(get_post_meta($attach_id, '_wp_attachment_image_alt', true));
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

  // Build image tag with attributes for styling
  $img_tag = sprintf(
    '<img src="%s" alt="%s" class="wp-image-%s" data-id="%s" data-full-url="%s" data-link="%s" />',
    $img_url,
    $img_alt,
    $attach_id,
    $attach_id,
    $full_url ?: $img_url,
    $link_to === 'media' ? esc_url($full_url ?: $img_url) : ''
  );

  // Build item HTML
  $figure_style = '';
  if ($aspect_ratio && $aspect_ratio !== 'auto') {
    $figure_style = sprintf('aspect-ratio: %s;', esc_attr($aspect_ratio));
  }

  $img_tag_with_link = $link_open . $img_tag . $link_close;

  if ($img_caption) {
    $items_html .= sprintf(
      '<li class="blocks-gallery-item"><figure style="%s">%s<figcaption class="blocks-gallery-item__caption">%s</figcaption></figure></li>',
      $figure_style,
      $img_tag_with_link,
      $img_caption
    );
  } else {
    $items_html .= sprintf(
      '<li class="blocks-gallery-item"><figure style="%s">%s</figure></li>',
      $figure_style,
      $img_tag_with_link
    );
  }

  $image_count++;
}

if (!$items_html) {
  if ($fallback_text) {
    printf(
      '<figure %s><div style="text-align:center;color:#666;padding:20px;">%s</div></figure>',
      wp_kses_data( get_block_wrapper_attributes(['class' => 'wp-block-chance-meta-gallery']) ),
      esc_html($fallback_text)
    );
  }
  return;
}

// Build gallery classes
$gallery_classes = [
  'wp-block-chance-meta-gallery',
  'wp-block-gallery',
  'has-nested-images',
  'blocks-gallery-grid',
];

if ($columns !== null) {
  $gallery_classes[] = sprintf('columns-%d', $columns);
} else {
  $gallery_classes[] = 'columns-default';
}

if ($image_crop) {
  $gallery_classes[] = 'is-cropped';
}

$wrapper_classes = implode(' ', array_filter($gallery_classes));

// Handle gap from block styles
$gap = $attributes['style']['spacing']['blockGap'] ?? null;
$gap_style = '';

if (is_array($gap)) {
  // Handle array gap (horizontal, vertical)
  $gap_value = $gap['top'] ?? $gap['left'] ?? '16px';
  if (is_string($gap_value) && str_contains($gap_value, 'var:preset|spacing|')) {
    $index_to_splice = strrpos($gap_value, '|') + 1;
    $slug = _wp_to_kebab_case(substr($gap_value, $index_to_splice));
    $gap_style = sprintf('--wp--style--unstable-gallery-gap: var(--wp--preset--spacing--%s);', esc_attr($slug));
  } else {
    $gap_style = sprintf('--wp--style--unstable-gallery-gap: %s;', esc_attr($gap_value));
  }
} elseif ($gap) {
  if (is_string($gap) && str_contains($gap, 'var:preset|spacing|')) {
    $index_to_splice = strrpos($gap, '|') + 1;
    $slug = _wp_to_kebab_case(substr($gap, $index_to_splice));
    $gap_style = sprintf('--wp--style--unstable-gallery-gap: var(--wp--preset--spacing--%s);', esc_attr($slug));
  } else {
    $gap_style = sprintf('--wp--style--unstable-gallery-gap: %s;', esc_attr($gap));
  }
}

// Output gallery
printf(
  '<figure %s%s><ul class="wp-block-gallery blocks-gallery-grid"%s>%s</ul>%s</figure>',
  wp_kses_data( get_block_wrapper_attributes(['class' => $wrapper_classes]) ),
  $gap_style ? sprintf(' style="%s"', $gap_style) : '',
  $gap_style ? sprintf(' style="%s"', $gap_style) : '',
  $items_html,
  $caption ? sprintf('<figcaption class="blocks-gallery-caption">%s</figcaption>', $caption) : ''
);
