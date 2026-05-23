<?php

/**
 * Render callback for chance/production-tabs block.
 *
 * Injects data attributes onto the outer container so that view.js can read
 * block settings (autoclose, initial tab, mobile breakpoint) without needing
 * them hardcoded in the saved markup.
 *
 * Available variables: $attributes, $content, $block.
 *
 * @package Theatrum_Blocks
 */

if (! $content) {
  return;
}

$p = new WP_HTML_Tag_Processor($content);

if ($p->next_tag(array('class_name' => 'wp-block-chance-production-tabs'))) {
  $p->set_attribute(
    'data-tabs-autoclose',
    ! empty($attributes['autoclose']) ? 'true' : 'false'
  );
  $p->set_attribute(
    'data-tabs-initial',
    intval($attributes['initialTab'] ?? 0)
  );
  $p->set_attribute(
    'data-tabs-breakpoint',
    intval($attributes['mobileBreakpoint'] ?? 768)
  );
}

echo $p->get_updated_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
