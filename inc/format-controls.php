<?php

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Server-side counterpart to src/format-controls.js: applies is-style-ct-carousel/is-style-ct-slider Grid Gap/Autoplay/Arrow options at render time for core/query (dynamic, no saved markup); also an idempotent fallback for core/gallery (see has_class() guard below). Mirrors chance-ollie's ct_grid_columns_render_block()/ct_grid_span_render_block() pattern.
 */

/**
 * Marker class confirming this filter already applied its classes/vars/attributes to a block's wrapper, to avoid double-injecting on core/gallery's saved markup.
 */
const THEATRUM_FORMAT_CONTROLS_MARKER_CLASS = 'ct-carousel-controls-applied';

/**
 * @param array  $block Parsed block array (has 'blockName', 'attrs').
 * @param string $slug  Style slug to check for, e.g. 'is-style-ct-carousel'.
 * @return bool
 */
function theatrum_format_controls_has_style($block, $slug)
{
    $class_name = (string) ($block['attrs']['className'] ?? '');
    $classes = preg_split('/\s+/', trim($class_name));
    return in_array($slug, $classes, true);
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

    $is_carousel = theatrum_format_controls_has_style($block, 'is-style-ct-carousel');
    $is_slider = ! $is_carousel && theatrum_format_controls_has_style($block, 'is-style-ct-slider');
    if (! $is_carousel && ! $is_slider) {
        return $block_content;
    }

    if ('' === trim((string) $block_content) || ! class_exists('WP_HTML_Tag_Processor')) {
        return $block_content;
    }

    $attrs = $block['attrs'] ?? array();
    $allowed_units = array('px', '%', 'em', 'rem');
    $classes = array();
    $style_parts = array();
    $extra_attributes = array();

    if ($is_carousel) {
        if ('core/query' === $block['blockName']) {
            $gap = isset($attrs['ctCarouselGap']) ? preg_replace('/[^0-9.]/', '', (string) $attrs['ctCarouselGap']) : '';
            $gap_unit = in_array($attrs['ctCarouselGapUnit'] ?? '', $allowed_units, true) ? $attrs['ctCarouselGapUnit'] : 'px';
            if ('' !== $gap) {
                $style_parts[] = '--ct-carousel-gap:' . esc_attr($gap . $gap_unit);
            }
        }
        $arrow_css_prefix = '--ct-arrow-';
        $arrow_inside_class = 'theatrum-arrows-inside';
        $arrow_hidden_class = 'theatrum-arrows-hidden';
    } else {
        $autoplay = ! empty($attrs['ctAutoplay']);
        $autoplay_speed = isset($attrs['ctAutoplaySpeed']) ? (int) $attrs['ctAutoplaySpeed'] : 5000;
        $extra_attributes['data-autoplay'] = $autoplay ? 'true' : 'false';
        $extra_attributes['data-autoplay-speed'] = (string) $autoplay_speed;
        $arrow_css_prefix = '--tm-arrow-';
        $arrow_inside_class = 'tm-slider-arrows-inside';
        $arrow_hidden_class = 'tm-slider-arrows-hidden';
    }

    $arrow_position = in_array($attrs['ctArrowPosition'] ?? '', array('outside', 'inside', 'hidden'), true)
        ? $attrs['ctArrowPosition']
        : 'outside';
    if ('inside' === $arrow_position) {
        $classes[] = $arrow_inside_class;
    } elseif ('hidden' === $arrow_position) {
        $classes[] = $arrow_hidden_class;
    }

    $arrow_background = ! isset($attrs['ctArrowBackground']) || ! empty($attrs['ctArrowBackground']);
    $arrow_color = theatrum_carousel_sanitize_color($attrs['ctArrowColor'] ?? '');
    $arrow_background_color = theatrum_carousel_sanitize_color($attrs['ctArrowBackgroundColor'] ?? '');
    $arrow_size = isset($attrs['ctArrowSize']) ? preg_replace('/[^0-9.]/', '', (string) $attrs['ctArrowSize']) : '';
    $arrow_size_unit = in_array($attrs['ctArrowSizeUnit'] ?? '', $allowed_units, true) ? $attrs['ctArrowSizeUnit'] : 'px';

    if ('' !== $arrow_color) {
        $style_parts[] = $arrow_css_prefix . 'color:' . esc_attr($arrow_color);
    }
    if (! $arrow_background) {
        $style_parts[] = $arrow_css_prefix . 'bg:transparent';
    } elseif ('' !== $arrow_background_color) {
        $style_parts[] = $arrow_css_prefix . 'bg:' . esc_attr($arrow_background_color);
    }
    if ('' !== $arrow_size) {
        $style_parts[] = $arrow_css_prefix . 'size:' . esc_attr($arrow_size . $arrow_size_unit);
    }

    if (empty($classes) && empty($style_parts) && empty($extra_attributes)) {
        return $block_content;
    }

    $processor = new WP_HTML_Tag_Processor($block_content);
    if (! $processor->next_tag()) {
        return $block_content;
    }

    // Idempotency guard: static core/gallery's saved markup may already carry these (written by format-controls.js's getSaveContent.extraProps), and render_block runs on every block every request.
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

    foreach ($extra_attributes as $name => $value) {
        $processor->set_attribute($name, $value);
    }

    return $processor->get_updated_html();
}
add_filter('render_block', 'theatrum_format_controls_render_block', 10, 2);

// The editor-script enqueue lives in theatrum-blocks.php (theatrum_enqueue_format_controls_script()) — plugins_url()'s 2nd arg resolves relative to the calling file's dir, so it must be called from the plugin root, not from inc/.
