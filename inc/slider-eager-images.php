<?php

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Slider slides start out `display: none` until formats/slider.js (or the
 * editor) activates one. Browsers treat a `display: none` <img
 * loading="lazy"> as "nowhere near the viewport" and defer fetching it
 * until the element is actually laid out/shown — so the very first time a
 * slide becomes active (via autoplay or an arrow/dot click), there's a
 * visible flash of the page background behind it while the browser
 * downloads the image. Once an image has loaded once it's cached, so this
 * only ever happens on the first pass through a given slider's slides.
 *
 * Fix: force eager loading for <img> tags inside slider markup — native
 * theatrum/slider and the is-style-ct-slider core/query & core/gallery
 * format share this same display:none/is-active mechanism (see
 * src/blocks/slider/style.scss and src/formats/style.scss) and so share
 * this same fix — so the browser fetches every slide's image up front
 * instead of waiting for each slide's reveal.
 *
 * Runs at a late `the_content` priority so it applies after WordPress's own
 * automatic `loading="lazy"` attribute has already been added (that
 * happens via wp_filter_content_tags(), also hooked to `the_content`),
 * regardless of exact core hook-priority internals. `the_content` fires for
 * both classic templates (the_content() template tag) and block themes
 * (core/post-content's render callback also runs content through this
 * filter), so this covers both.
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
