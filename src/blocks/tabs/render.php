<?php

/**
 * Tabs block server render.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Saved block content.
 * @param WP_Block $block      Block instance.
 */

$inner_content = '';
$inner_count   = 0;

if (!empty($block->inner_blocks)) {
  $inner_count = count($block->inner_blocks);
  foreach ($block->inner_blocks as $inner_block) {
    $inner_content .= render_block($inner_block->parsed_block);
  }
} else {
  $inner_content = $content;
}

$tab_count = isset($attributes['tabCount']) ? (int) $attributes['tabCount'] : 2;
if ($inner_count > 0) {
  $tab_count = $inner_count;
}

if ($tab_count < 1) {
  $tab_count = 1;
}

$wrapper_attributes = get_block_wrapper_attributes(
  [
    'style' => '--tab-count: ' . $tab_count . ';',
  ]
);
?>
<div <?php echo $wrapper_attributes; ?>>
  <?php echo $inner_content; ?>
</div>