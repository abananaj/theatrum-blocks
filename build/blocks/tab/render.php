<?php
/**
 * Tab Block - Server-side render
 *
 * @param array  $attributes Block attributes.
 * @param string $content    InnerBlocks content.
 * @param object $block      Block instance.
 */

$label = $attributes['label'] ?? 'Tab';
$is_default = $attributes['isDefault'] ?? false;

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'wp-block-chance-tab',
]);
?>
<details <?php echo $wrapper_attributes; ?> name="tabs" <?php echo $is_default ? 'open' : ''; ?>>
	<summary>
		<span><?php echo wp_kses_post($label); ?></span>
	</summary>
	<div class="tab-content">
		<?php echo $content; ?>
	</div>
</details>
