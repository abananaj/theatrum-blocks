<?php

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Slider slides start `display: none` until formats/slider.js activates one; browsers defer fetching a `display: none` lazy <img> until shown, so the first slide reveal flashes the bare background while it downloads. Fix: force `loading="eager"` on <img>s in slider markup (theatrum/slider and the is-style-ct-slider format share this display:none/is-active mechanism) so images fetch up front. Runs at a late `the_content` priority, after WP's own wp_filter_content_tags() has added `loading="lazy"`; `the_content` covers both classic and block-theme rendering.
 */
add_filter('the_content', 'theatrum_slider_force_eager_images', 20);

/**
 * @param string $content Post content HTML, already run through do_blocks().
 * @return string Content with `loading="lazy"` swapped to `loading="eager"`
 *                on <img> tags nested inside slider markup.
 */
function theatrum_slider_force_eager_images($content)
{
    if (! is_string($content) || '' === $content) {
        return $content;
    }

    if (false === strpos($content, 'tm-slider') && false === strpos($content, 'is-style-ct-slider')) {
        return $content;
    }

    if (! class_exists('DOMDocument')) {
        return $content;
    }

    $dom = new DOMDocument();
    $previous_state = libxml_use_internal_errors(true);
    $loaded = $dom->loadHTML(
        '<?xml encoding="UTF-8"?><div id="theatrum-slider-eager-root">' . $content . '</div>',
        LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
    );
    libxml_clear_errors();
    libxml_use_internal_errors($previous_state);

    if (! $loaded) {
        return $content;
    }

    $xpath = new DOMXPath($dom);
    $slider_images = $xpath->query(
        "//*[contains(concat(' ', normalize-space(@class), ' '), ' tm-slider ')" .
        " or contains(concat(' ', normalize-space(@class), ' '), ' is-style-ct-slider ')]" .
        '//img[@loading="lazy"]'
    );

    if (false === $slider_images || 0 === $slider_images->length) {
        return $content;
    }

    foreach ($slider_images as $img) {
        if ($img instanceof DOMElement) {
            $img->setAttribute('loading', 'eager');
        }
    }

    $roots = $xpath->query('//div[@id="theatrum-slider-eager-root"]');
    if (! $roots || 0 === $roots->length) {
        return $content;
    }

    $html = '';
    foreach ($roots->item(0)->childNodes as $child) {
        $html .= $dom->saveHTML($child);
    }

    return $html;
}
