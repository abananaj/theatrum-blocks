<?php

/**
 * Tabs Block Render Template
 * 
 * @var array $attributes Block attributes
 * @var string $content Pre-rendered InnerBlocks content
 */

$orientation = isset($attributes['orientation']) ? $attributes['orientation'] : 'horizontal';
$wrapper_classes = array(
  'wp-block-theatrum-tabs',
  'wp-block-theatrum-tabs--' . $orientation,
);

$wrapper_attributes = get_block_wrapper_attributes(array(
  'class' => implode(' ', $wrapper_classes),
  'data-tab-component' => 'true',
  'data-tab-orientation' => $orientation,
));
?>

<div <?php echo wp_kses_post($wrapper_attributes); ?>>
  <?php echo wp_kses_post($content); ?>
</div>