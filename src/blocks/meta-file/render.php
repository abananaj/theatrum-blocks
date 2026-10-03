<?php

if ( ! defined('ABSPATH')) {
	exit;
}

/**
 * Meta File block — server-side render; handles ACF file fields returning array, URL, attachment ID, or a list of these; renders one link per file.
 */

$post_id = $block->context['postId'] ?? get_the_ID();

if ( ! $post_id) {
  return;
}

$key_input        = isset($attributes['keyInput']) ? sanitize_text_field($attributes['keyInput']) : '';
$link_text        = isset($attributes['linkText']) ? sanitize_text_field($attributes['linkText']) : 'Download File';
$link_text_source = $attributes['linkTextSource'] ?? 'custom';
$show_as_list     = ! isset($attributes['showAsList']) || ! empty($attributes['showAsList']);
$fallback_text    = isset($attributes['fallbackText']) ? sanitize_text_field($attributes['fallbackText']) : '';
$open_in_new_tab  = ! empty($attributes['openInNewTab']);
$show_icon        = ! empty($attributes['showIcon']);

if ( ! $key_input) {
  theatrum_render_meta_empty_marker('div', '', array('class' => 'wp-block-theatrum-meta-file'));
  return;
}

if ( ! $link_text && 'custom' === $link_text_source) {
  return;
}

$files = theatrum_resolve_meta_files(theatrum_get_meta($post_id, $key_input));

if (empty($files)) {
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

$target_attr = $open_in_new_tab ? ' target="_blank" rel="noopener noreferrer"' : '';
$icon_map    = array(
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

$parts = array();
foreach ($files as $file) {
  $icon_html = '';
  if ($show_icon) {
    $icon      = $icon_map[$file['ext']] ?? 'media-document';
    $icon_html = '<span class="dashicon dashicons dashicons-' . esc_attr($icon) . '" style="margin-right: 0.5em; vertical-align: middle;" aria-hidden="true"></span>';
  }

  $text = $link_text;
  if ('title' === $link_text_source) {
    $text = $file['title'];
  } elseif ('filename' === $link_text_source) {
    $text = $file['filename'];
  }

  $html = sprintf(
      '<a href="%s" class="wp-block-theatrum-meta-file-link"%s>%s%s</a>',
      esc_url($file['url']),
      $target_attr,
      $icon_html,
      esc_html($text ?: $link_text)
  );

  // Inline viewer for PDFs; the link above stays, since phones often show only a PDF's first page inside a frame.
  if ( ! empty($attributes['embed']) && 'pdf' === $file['ext']) {
    $html .= sprintf(
        '<iframe class="wp-block-theatrum-meta-file-embed" src="%s" title="%s" loading="lazy"></iframe>',
        // Match the page's scheme: offloaded media URLs are stored as http://, which an https page blocks inside a frame.
        esc_url(set_url_scheme($file['url'])),
        esc_attr($file['title'] ?: $link_text)
    );
  }

  $parts[] = $html;
}

if (count($parts) > 1 && $show_as_list) {
  $inner = '<ul class="wp-block-theatrum-meta-file-list"><li>' . implode('</li><li>', $parts) . '</li></ul>';
} else {
  $inner = implode('', $parts);
}

printf(
    '<div %s>%s</div>',
    wp_kses_data( get_block_wrapper_attributes(array('class' => 'wp-block-theatrum-meta-file')) ),
    $inner // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- assembled above from esc_url()/esc_attr()/esc_html() output.
);
