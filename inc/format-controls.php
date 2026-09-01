<?php

if (! defined('ABSPATH')) {
    exit;
}

/**
 * SERVER-SIDE APPLICATION of the is-style-ct-carousel format's Grid Gap +
 * Arrow Styles options (editor-side counterpart: src/format-controls.js).
 *
 * core/gallery is a static block — src/format-controls.js's
 * blocks.getSaveContent.extraProps filter already bakes classes/style into
 * its saved markup. core/query is dynamic (no saved markup exists), so its
 * only path to the frontend is here, at render time. This filter runs on
 * every render_block call regardless, so it doubles as an idempotent
 * fallback for core/gallery too (see the has_class() guard below) — same
 * shape as chance-ollie's ct_grid_columns_render_block()/
 * ct_grid_span_render_block(), this codebase's only other precedent for
 * this kind of core-block extension.
 */

/**
 * Marker class confirming this filter's classes/vars have already been
 * applied to a given block's wrapper — checked to avoid double-injecting on
 * a core/gallery instance whose saved markup already carries them.
 */
const THEATRUM_FORMAT_CONTROLS_MARKER_CLASS = 'ct-carousel-controls-applied';

/**
 * @param array $block Parsed block array (has 'blockName', 'attrs').
 * @return bool
 */
function theatrum_format_controls_has_carousel_style($block)
{
    $class_name = (string) ($block['attrs']['className'] ?? '');
    $classes = preg_split('/\s+/', trim($class_name));
    return in_array('is-style-ct-carousel', $classes, true);
}

/**
 * @param string $block_content Rendered inner HTML for this block.
 * @param array  $block         Parsed block array.
 * @return string
 */
function theatrum_format_controls_render_block($block_content, $block)
{
    if (empty($block['blockName']) || ! in_array($block['blockName'], theatrum_format_blocks(), true)) {
        return $block_content;
    }

    if (! theatrum_format_controls_has_carousel_style($block)) {
        return $block_content;
    }

    if ('' === trim((string) $block_content) || ! class_exists('WP_HTML_Tag_Processor')) {
        return $block_content;
    }

    $attrs = $block['attrs'] ?? array();
    $allowed_units = array('px', '%', 'em', 'rem');
    $classes = array();
    $style_parts = array();

    if ('core/query' === $block['blockName']) {
        $gap = isset($attrs['ctCarouselGap']) ? preg_replace('/[^0-9.]/', '', (string) $attrs['ctCarouselGap']) : '';
        $gap_unit = in_array($attrs['ctCarouselGapUnit'] ?? '', $allowed_units, true) ? $attrs['ctCarouselGapUnit'] : 'px';
        if ('' !== $gap) {
            $style_parts[] = '--ct-carousel-gap:' . esc_attr($gap . $gap_unit);
        }
    }

    $arrow_position = in_array($attrs['ctArrowPosition'] ?? '', array('outside', 'inside', 'hidden'), true)
        ? $attrs['ctArrowPosition']
        : 'outside';
    if ('inside' === $arrow_position) {
        $classes[] = 'theatrum-arrows-inside';
    } elseif ('hidden' === $arrow_position) {
        $classes[] = 'theatrum-arrows-hidden';
    }

    $arrow_background = ! isset($attrs['ctArrowBackground']) || ! empty($attrs['ctArrowBackground']);
    $arrow_color = theatrum_carousel_sanitize_color($attrs['ctArrowColor'] ?? '');
    $arrow_background_color = theatrum_carousel_sanitize_color($attrs['ctArrowBackgroundColor'] ?? '');
    $arrow_size = isset($attrs['ctArrowSize']) ? preg_replace('/[^0-9.]/', '', (string) $attrs['ctArrowSize']) : '';
    $arrow_size_unit = in_array($attrs['ctArrowSizeUnit'] ?? '', $allowed_units, true) ? $attrs['ctArrowSizeUnit'] : 'px';

    if ('' !== $arrow_color) {
        $style_parts[] = '--ct-arrow-color:' . esc_attr($arrow_color);
    }
    if (! $arrow_background) {
        $style_parts[] = '--ct-arrow-bg:transparent';
    } elseif ('' !== $arrow_background_color) {
        $style_parts[] = '--ct-arrow-bg:' . esc_attr($arrow_background_color);
    }
    if ('' !== $arrow_size) {
        $style_parts[] = '--ct-arrow-size:' . esc_attr($arrow_size . $arrow_size_unit);
    }

    if (empty($classes) && empty($style_parts)) {
        return $block_content;
    }

    $processor = new WP_HTML_Tag_Processor($block_content);
    if (! $processor->next_tag()) {
        return $block_content;
    }

    // Idempotency guard: static core/gallery's saved markup may already
    // carry these classes/vars (written by format-controls.js's
    // getSaveContent.extraProps at save time), and render_block runs on
    // every block, static or dynamic, on every request.
    if ($processor->has_class(THEATRUM_FORMAT_CONTROLS_MARKER_CLASS)) {
        return $block_content;
    }

    $processor->add_class(THEATRUM_FORMAT_CONTROLS_MARKER_CLASS);
    foreach ($classes as $class) {
        $processor->add_class($class);
    }

    if (! empty($style_parts)) {
        $existing_style = rtrim((string) $processor->get_attribute('style'), '; ');
        $new_style = ('' === $existing_style ? '' : $existing_style . ';') . implode(';', $style_parts) . ';';
        $processor->set_attribute('style', $new_style);
    }

    return $processor->get_updated_html();
}
add_filter('render_block', 'theatrum_format_controls_render_block', 10, 2);

// The editor-script enqueue for this feature lives in theatrum-blocks.php
// (theatrum_enqueue_format_controls_script()), alongside every other
// enqueue in this plugin — plugins_url()'s second argument resolves
// relative to that file's own directory, so it needs to be called from a
// file at the plugin root, not from here in inc/.
