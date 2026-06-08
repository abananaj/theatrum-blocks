<?php

/**
 * Tab block server render.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Saved block content.
 * @param WP_Block $block      Block instance.
 */

$label      = isset($attributes['label']) ? $attributes['label'] : 'Tab';
$is_default = !empty($attributes['isDefault']);

$inner_content = '';
if (!empty($block->inner_blocks)) {
  foreach ($block->inner_blocks as $inner_block) {
    $inner_content .= render_block($inner_block->parsed_block);
  }
} else {
  $inner_content = $content;
}

$details_attrs = get_block_wrapper_attributes();
?>
<details <?php echo $details_attrs; ?> name="tabs" <?php echo $is_default ? 'open' : ''; ?>>
  <summary>
    <span><?php echo wp_kses_post($label); ?></span>
  </summary>
  <div class="tab-content">
    <?php echo $inner_content; ?>
  </div>
</details>