<?php

if ( ! defined('ABSPATH')) {
    exit;
}

/**
 * Icon List items with an SVG icon get their masked <span> swapped for the inline <svg>, since CSS mask-image is CORS-blocked on the S3-offloaded URL.
 * Markup comes from the theme's ct_svg_inline_markup() (chance-ollie inc/utils/svg-inline.php) — without that theme the masked span renders unchanged.
 *
 * @param string $block_content
 * @param array  $block
 * @return string
 */
function theatrum_list_icons_svg_inline($block_content, $block) {
    $id = (int) ($block['attrs']['iconId'] ?? 0);

    if ( ! $id || ! function_exists('ct_svg_inline_markup') || 'image/svg+xml' !== get_post_mime_type($id)) {
        return $block_content;
    }

    $svg = ct_svg_inline_markup($id);
    if ('' === $svg || ! preg_match('#<span\b[^>]*\blist-icons-icon--svg\b[^>]*>\s*</span>#i', $block_content, $span_match)) {
        return $block_content;
    }

    // Sizing comes from the .list-icons-icon rules, not the file's intrinsic attributes.
    $tag = new WP_HTML_Tag_Processor($svg);
    if ( ! $tag->next_tag('svg')) {
        return $block_content;
    }
    $tag->remove_attribute('width');
    $tag->remove_attribute('height');
    $tag->add_class('list-icons-icon');
    $tag->add_class('list-icons-icon--inline');
    $tag->add_class('ct-svg-icon');
    $tag->set_attribute('focusable', 'false');
    $alt = trim((string) ($block['attrs']['iconAlt'] ?? ''));
    if ('' !== $alt) {
        $tag->set_attribute('role', 'img');
        $tag->set_attribute('aria-label', $alt);
    } else {
        $tag->set_attribute('aria-hidden', 'true');
    }

    $pos = strpos($block_content, $span_match[0]);

    return substr_replace($block_content, $tag->get_updated_html(), $pos, strlen($span_match[0]));
}
add_filter('render_block_theatrum/list-item-icon', 'theatrum_list_icons_svg_inline', 10, 2);
