<?php

if ( ! defined('ABSPATH')) {
	exit;
}

/**
 * Meta File block — server-side render; handles ACF file fields returning array, URL, or attachment ID; renders as a link.
 */

$post_id = $block->context['postId'] ?? get_the_ID();

if ( ! $post_id) {
  return;
}

$key_input       = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';
$link_text       = isset($attributes['linkText']) ? sanitize_text_field($attributes['linkText']) : 'Download File';
$fallback_text   = isset($attributes['fallbackText']) ? sanitize_text_field($attributes['fallbackText']) : '';
$open_in_new_tab = ! empty($attributes['openInNewTab']);
$show_icon       = ! empty($attributes['showIcon']);

if ( ! $key_input) {
  theatrum_render_meta_empty_marker('div', '', array('class' => 'wp-block-theatrum-meta-file'));
  return;
}

if ( ! $link_text) {
  return;
}

// Get the raw meta/ACF value
$value = function_exists('get_field') ? get_field($key_input, $post_id) : null;
if ($value === null || $value === false || $value === '') {
  $value = get_post_meta($post_id, $key_input, true);
}

if (empty($value)) {
  if ($fallback_text) {
    printf(
        '<div %s>%s</div>',
        wp_kses_data( get_block_wrapper_attributes(array('class' => 'wp-block-theatrum-meta-file')) ),
        esc_html($fallback_text)
    );
  } else {
    theatrum_render_meta_empty_marker('div', $key_input, array('class' => 'wp-block-theatrum-meta-file'));
  }
  return;
}

// Resolve file data from whatever ACF returns
$file_url  = '';
$file_name = '';
$attach_id = 0;

if (is_array($value)) {
  // ACF file field array format: { ID, url, title, filename, ... }
  $file_url  = isset($value['url']) ? esc_url($value['url']) : '';
  $file_name = isset($value['title']) ? sanitize_text_field($value['title']) : '';
  $attach_id = isset($value['ID']) ? intval($value['ID']) : 0;

  // Fallback to filename if title not set
  if ( ! $file_name && isset($value['filename'])) {
    $file_name = sanitize_text_field($value['filename']);
  }
} elseif (is_numeric($value)) {
  // ACF returned an attachment ID
  $attach_id = intval($value);
  $file_url  = esc_url(wp_get_attachment_url($attach_id));
  $file_name = get_the_title($attach_id);
} elseif (is_string($value)) {
  // ACF returned a URL string
  $file_url  = esc_url($value);
  $file_name = basename($file_url);
}

if ( ! $file_url) {
  if ($fallback_text) {
    printf(
        '<div %s>%s</div>',
        wp_kses_data( get_block_wrapper_attributes(array('class' => 'wp-block-theatrum-meta-file')) ),
        esc_html($fallback_text)
    );
  } else {
    theatrum_render_meta_empty_marker('div', $key_input, array('class' => 'wp-block-theatrum-meta-file'));
  }
  return;
}

// Determine file type/extension for icon class
$file_ext = '';
if ($attach_id) {
  $mime_type = get_post_mime_type($attach_id);
  if ($mime_type) {
    $ext_map = array(
      'application/pdf'          => 'pdf',
      'application/msword'       => 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
      'application/vnd.ms-excel' => 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
      'text/plain'               => 'txt',
      'image/'                   => 'image',
      'video/'                   => 'video',
      'audio/'                   => 'audio',
      'application/zip'          => 'archive',
    );

    foreach ($ext_map as $mime => $ext) {
      if (strpos($mime_type, $mime) !== false) {
        $file_ext = $ext;
        break;
      }
    }
  }
} else {
  // Try to detect from filename
  $ext      = strtolower(pathinfo($file_url, PATHINFO_EXTENSION));
  $file_ext = $ext ?: 'file';
}

// Build link HTML
$target_attr = $open_in_new_tab ? ' target="_blank" rel="noopener noreferrer"' : '';
$icon_html   = '';

if ($show_icon) {
  // Use dashicon for different file types
  $icon_map = array(
    'pdf'     => 'pdf',
    'doc'     => 'media-document',
    'docx'    => 'media-document',
    'xls'     => 'media-spreadsheet',
    'xlsx'    => 'media-spreadsheet',
    'txt'     => 'media-text',
    'image'   => 'format-image',
    'video'   => 'format-video',
    'audio'   => 'format-audio',
    'archive' => 'media-archive',
  );

  $icon      = isset($icon_map[$file_ext]) ? $icon_map[$file_ext] : 'media-document';
  $icon_html = '<span class="dashicon dashicons dashicons-' . esc_attr($icon) . '" style="margin-right: 0.5em; vertical-align: middle;" aria-hidden="true"></span>';
}

$link_html = sprintf(
    '<a href="%s" class="wp-block-theatrum-meta-file-link"%s>%s%s</a>',
    $file_url,
    $target_attr,
    $icon_html,
    esc_html($link_text)
);

printf(
    '<div %s>%s</div>',
    wp_kses_data( get_block_wrapper_attributes(array('class' => 'wp-block-theatrum-meta-file')) ),
    $link_html // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- assembled above from esc_url()/esc_attr()/esc_html() output.
);
