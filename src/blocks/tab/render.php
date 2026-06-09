<?php

/**
 * Tab Block Render Template
 * 
 * @var array $attributes Block attributes
 * @var string $content Pre-rendered InnerBlocks content
 */

$title = isset($attributes['title']) ? $attributes['title'] : '';

?>

<li class="tab-item">
  <a class="tab-link" href="#"><?php echo wp_kses_post($title); ?></a>
</li>

<section class="tab-panel">
  <?php echo wp_kses_post($content); ?>
</section>