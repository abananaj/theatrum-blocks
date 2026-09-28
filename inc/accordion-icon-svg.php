<?php

if ( ! defined('ABSPATH')) {
    exit;
}

/**
 * Icon Accordion cards with an SVG rail icon get it inlined into the toggle-icon span, so it takes the card's text colour (a mask can't: CORS-blocked on the S3 URL).
 * Markup comes from the theme's ct_svg_inline_markup() (chance-ollie inc/utils/svg-inline.php) — without that theme the background-image icon renders unchanged.
 *
 * @param string $block_content
 * @param array  $block
 * @return string
 */
function theatrum_accordion_icon_svg_inline($block_content, $block) {
    $id = (int) ($block['attrs']['ctIconId'] ?? 0);

    if ( ! $id || ! function_exists('ct_svg_inline_markup') || 'image/svg+xml' !== get_post_mime_type($id)) {
        return $block_content;
    }

    $svg = ct_svg_inline_markup($id);
    if ('' === $svg || ! preg_match('#(<span\b[^>]*\bwp-block-accordion-heading__toggle-icon\b[^>]*>).*?(</span>)#is', $block_content, $span_match)) {
        return $block_content;
    }

    // Sizing comes from --tm-accordion-icon-glyph-size (style.scss), not the file's intrinsic attributes; the rail span is already aria-hidden.
    $tag = new WP_HTML_Tag_Processor($svg);
    if ( ! $tag->next_tag('svg')) {
        return $block_content;
    }
    $tag->remove_attribute('width');
    $tag->remove_attribute('height');
    $tag->add_class('tm-accordion-icon-svg');
    $tag->add_class('ct-svg-icon');
    $tag->set_attribute('focusable', 'false');
    $tag->set_attribute('aria-hidden', 'true');

    // Replace the "+" in the first toggle-icon only — a nested accordion in the panel keeps its own.
    $pos           = strpos($block_content, $span_match[0]);
    $block_content = substr_replace($block_content, $span_match[1] . $tag->get_updated_html() . $span_match[2], $pos, strlen($span_match[0]));

    // Marker class on the card so style.scss drops the background-image fallback.
    $card = new WP_HTML_Tag_Processor($block_content);
    if ($card->next_tag()) {
        $card->add_class('has-ct-icon-inline');
        $block_content = $card->get_updated_html();
    }

    return $block_content;
}
add_filter('render_block_core/accordion-item', 'theatrum_accordion_icon_svg_inline', 10, 2);
