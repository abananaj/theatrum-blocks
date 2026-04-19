<?php


/**
 * Meta Image Block - Server-side render callback
 * Handles ACF image fields that return array, URL, or attachment ID
 */
function render_meta_image_block($attributes, $content, $block)
{
  $post_id = $block->context['postId'] ?? get_the_ID();

  if (!$post_id) {
    return '';
  }

  $key_input  = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';
  $image_size = isset($attributes['imageSize']) ? sanitize_key($attributes['imageSize']) : 'full';
  $link_to    = isset($attributes['linkTo']) ? sanitize_text_field($attributes['linkTo']) : 'none';
  $custom_link = isset($attributes['customLink']) ? esc_url($attributes['customLink']) : '';
  $open_new   = !empty($attributes['openInNewTab']);
  $show_caption = !empty($attributes['showCaption']);

  if (!$key_input) {
    return '';
  }

  // Get the raw meta/ACF value
  $value = get_field($key_input, $post_id);
  if ($value === null || $value === false || $value === '') {
    $value = get_post_meta($post_id, $key_input, true);
  }

  if (empty($value)) {
    return '';
  }

  // Resolve image data from whatever ACF returns
  $img_url    = '';
  $img_alt    = '';
  $img_caption = '';
  $attach_id  = 0;
  $attach_url = '';

  if (is_array($value)) {
    // ACF array format: { url, alt, caption, id, sizes, ... }
    $img_url     = isset($value['url'])     ? esc_url($value['url'])           : '';
    $img_alt     = isset($value['alt'])     ? esc_attr($value['alt'])          : '';
    $img_caption = isset($value['caption']) ? wp_kses_post($value['caption'])  : '';
    $attach_id   = isset($value['ID'])      ? intval($value['ID'])             : 0;
    $attach_url  = isset($value['url'])     ? esc_url($value['url'])           : '';

    // If a specific size was requested and exists in sizes array
    if ($image_size !== 'full' && isset($value['sizes'][$image_size])) {
      $img_url = esc_url($value['sizes'][$image_size]);
    }
  } elseif (is_numeric($value)) {
    // ACF returned an attachment ID
    $attach_id = intval($value);
    $src = wp_get_attachment_image_src($attach_id, $image_size);
    if ($src) {
      $img_url   = esc_url($src[0]);
      $img_alt   = esc_attr(get_post_meta($attach_id, '_wp_attachment_image_alt', true));
      $attach_url = esc_url(wp_get_attachment_url($attach_id));
      $img_caption = wp_kses_post(wp_get_attachment_caption($attach_id));
    }
  } elseif (is_string($value)) {
    // ACF returned a URL string
    $img_url = esc_url($value);
  }

  if (!$img_url) {
    return '';
  }

  // Determine link href
  $link_href = '';
  $link_target = $open_new ? ' target="_blank" rel="noopener noreferrer"' : '';

  if ($link_to === 'media') {
    $link_href = $attach_url ?: $img_url;
  } elseif ($link_to === 'attachment' && $attach_id) {
    $link_href = esc_url(get_attachment_link($attach_id));
  } elseif ($link_to === 'custom' && $custom_link) {
    $link_href = $custom_link;
  }

  // Build img tag
  $img_tag = sprintf(
    '<img src="%s" alt="%s" class="wp-image-%s" style="max-width:100%%;height:auto;" />',
    $img_url,
    $img_alt,
    $attach_id ? esc_attr($attach_id) : ''
  );

  // Wrap in link if needed
  $img_content = $link_href
    ? sprintf('<a href="%s"%s>%s</a>', $link_href, $link_target, $img_tag)
    : $img_tag;

  // Optional caption
  $caption_html = '';
  if ($show_caption && $img_caption) {
    $caption_html = sprintf('<figcaption class="wp-element-caption">%s</figcaption>', $img_caption);
  }

  return sprintf(
    '<figure %s>%s%s</figure>',
    get_block_wrapper_attributes(['class' => 'wp-block-chance-meta-image']),
    $img_content,
    $caption_html
  );
}

/**
 * REST endpoint: returns image data for a given post+key in the editor
 */
function register_meta_image_rest_endpoint()
{
  register_rest_route('chance/v1', '/meta-image/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)', [
    'methods'             => 'GET',
    'callback'            => 'meta_image_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
    'args' => [
      'post_id' => ['validate_callback' => 'is_numeric'],
      'key'     => ['sanitize_callback' => 'sanitize_key'],
    ],
  ]);
}
add_action('rest_api_init', 'register_meta_image_rest_endpoint');

function meta_image_rest_callback($request)
{
  $post_id = intval($request->get_param('post_id'));
  $key     = sanitize_key($request->get_param('key'));

  if (!$post_id || !$key) {
    return new WP_REST_Response(['url' => ''], 200);
  }

  $value = get_field($key, $post_id);
  if ($value === null || $value === false || $value === '') {
    $value = get_post_meta($post_id, $key, true);
  }

  if (empty($value)) {
    return new WP_REST_Response(['url' => ''], 200);
  }

  if (is_array($value)) {
    return new WP_REST_Response([
      'url'     => $value['url'] ?? '',
      'alt'     => $value['alt'] ?? '',
      'caption' => $value['caption'] ?? '',
      'id'      => $value['ID'] ?? 0,
    ], 200);
  }

  if (is_numeric($value)) {
    $src = wp_get_attachment_image_src(intval($value), 'full');
    return new WP_REST_Response([
      'url'     => $src ? $src[0] : '',
      'alt'     => get_post_meta(intval($value), '_wp_attachment_image_alt', true),
      'caption' => wp_get_attachment_caption(intval($value)),
      'id'      => intval($value),
    ], 200);
  }

  // String URL
  return new WP_REST_Response(['url' => esc_url_raw($value), 'alt' => '', 'caption' => '', 'id' => 0], 200);
}
