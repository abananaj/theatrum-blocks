<?php

/**
 * Cover Card block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$meta_key = isset($attributes['metaKey']) ? sanitize_text_field($attributes['metaKey']) : '';
$post_id = isset($attributes['postId']) ? intval($attributes['postId']) : 0;
$button_text = isset($attributes['buttonText']) ? sanitize_text_field($attributes['buttonText']) : '';
$button_url = isset($attributes['buttonUrl']) ? esc_url($attributes['buttonUrl']) : '';
$open_in_new_window = isset($attributes['openInNewWindow']) ? (bool) $attributes['openInNewWindow'] : false;

// Get the post
$post = get_post($post_id);

if (! $post) {
  return;
}

// Get featured image
$featured_image_url = '';
if (has_post_thumbnail($post->ID)) {
  $featured_image_url = get_the_post_thumbnail_url($post->ID, 'full');
}

// Get post title and permalink
$post_title = $post->post_title;
$post_permalink = get_permalink($post->ID);

// Build inline style for background image
$bg_style = '';
if ($featured_image_url) {
  $bg_style = 'background-image: url(' . esc_url($featured_image_url) . ');';
}
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
  <div class="cover-card" style="<?php echo esc_attr($bg_style); ?>">
    <div class="user-content"><?php echo do_blocks($content); ?></div>
    <div class="bottom-bar">
      <!-- <a href="<?php echo esc_url($post_permalink); ?>" class="post-link"> -->
      <!-- <h3 class="title"><?php echo esc_html($post_title); ?></h3> -->
      <h4 class="dates"><?php
                        $opening = get_post_meta($post->ID, 'opening', true);
                        $closing = get_post_meta($post->ID, 'closing', true);
                        if ($opening) echo esc_html(date('M j', strtotime($opening)));
                        if ($opening && $closing) echo ' – ';
                        if ($closing) echo esc_html(date('M j', strtotime($closing)));
                        ?></h4>
      <!-- </a> -->
      <?php if ($button_text && $button_url) :
        $target = $open_in_new_window ? 'target="_blank" rel="noopener noreferrer"' : '';
      ?>
        <a href="<?php echo esc_url($button_url); ?>" class="button" <?php echo $target; ?>><?php echo esc_html($button_text); ?></a>
      <?php endif; ?>
    </div>
  </div>
</div>
<?php
