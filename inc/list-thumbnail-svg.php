<?php

if ( ! defined('ABSPATH')) {
    exit;
}

/**
 * Thumbnail List items with an SVG thumbnail carry the sanitized markup in an inert <template>; list-thumbnail/view.js inlines it into the flip-card face so nomenclature colors reach its fill.
 * Markup comes from the theme's ct_svg_inline_markup() (chance-ollie inc/utils/svg-inline.php) — without that theme the item renders unchanged.
 *
 * @param string $block_content
 * @param array  $block
 * @return string
 */
function theatrum_list_thumbnail_svg_template($block_content, $block) {
    $id = (int) ($block['attrs']['thumbnailId'] ?? 0);

    if ( ! $id || ! function_exists('ct_svg_inline_markup') || 'image/svg+xml' !== get_post_mime_type($id)) {
        return $block_content;
    }

    $svg = ct_svg_inline_markup($id);
    $pos = strrpos($block_content, '</div>');
    if ('' === $svg || false === $pos) {
        return $block_content;
    }

    // Face sizing comes from the thumbnail CSS, not the file's intrinsic attributes.
    $tag = new WP_HTML_Tag_Processor($svg);
    if ( ! $tag->next_tag('svg')) {
        return $block_content;
    }
    $tag->remove_attribute('width');
    $tag->remove_attribute('height');
    $tag->add_class('ct-svg-icon');
    $tag->set_attribute('focusable', 'false');
    $alt = trim((string) ($block['attrs']['thumbnailAlt'] ?? ''));
    if ('' !== $alt) {
        $tag->set_attribute('role', 'img');
        $tag->set_attribute('aria-label', $alt);
    } else {
        $tag->set_attribute('aria-hidden', 'true');
    }

    $template = '<template class="list-item-svg">' . $tag->get_updated_html() . '</template>';

    return substr_replace($block_content, $template, $pos, 0);
}
add_filter('render_block_theatrum/list-item-thumbnail', 'theatrum_list_thumbnail_svg_template', 10, 2);
