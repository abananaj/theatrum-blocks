<?php

if (! defined('ABSPATH')) {
    exit;
}

/**
 * theatrum/table-advanced's save() emits a .tm-table-scroll-wrapper around the <table>, and a v1 deprecation migrates older markup — but a deprecation only rewrites post_content when an editor opens and re-saves the post, so instances authored before the wrapper existed still render unwrapped and overflow the page (a table cannot clip its own overflow: tbody is `display: table-row-group`, which ignores it). Wrapping at render time fixes every stored instance without a content migration, which matters because this content lives in wp_block records that a dev-to-local database pull would overwrite.
 */
add_filter('render_block_theatrum/table-advanced', 'theatrum_table_wrap_scroll_container');

/**
 * @param string $block_content Saved block markup.
 * @return string Markup guaranteed to carry the scroll wrapper.
 */
function theatrum_table_wrap_scroll_container($block_content)
{
    if (! is_string($block_content) || '' === trim($block_content)) {
        return $block_content;
    }

    // Already migrated by the deprecation — leave it alone rather than double-wrapping.
    if (false !== strpos($block_content, 'tm-table-scroll-wrapper')) {
        return $block_content;
    }

    return '<div class="tm-table-scroll-wrapper">' . $block_content . '</div>';
}
