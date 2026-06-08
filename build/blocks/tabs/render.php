<?php
/**
 * Tabs Block - Server-side render
 *
 * @param array  $attributes Block attributes.
 * @param string $content    InnerBlocks content.
 * @param object $block      Block instance.
 */

$tab_count = $attributes['tabCount'] ?? 2;

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'wp-block-chance-tabs',
	'style' => '--tab-count: ' . (int) $tab_count,
]);
?>
<div <?php echo $wrapper_attributes; ?>>
	<?php echo $content; ?>
</div>
