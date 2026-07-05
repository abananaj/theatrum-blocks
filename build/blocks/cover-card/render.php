<?php

/**
 * Cover Card block — file template
 * $attributes, $content, $block are injected by WordPress.
 */

$meta_key = isset($attributes['metaKey']) ? sanitize_text_field($attributes['metaKey']) : '';
$post_id = isset($attributes['postId']) && $attributes['postId']
  ? intval($attributes['postId'])
  : intval($block->context['postId'] ?? 0);
$button_text = isset($attributes['buttonText']) ? sanitize_text_field($attributes['buttonText']) : '';
$button_url = isset($attributes['buttonUrl']) ? esc_url($attributes['buttonUrl']) : '';
$button2_text = isset($attributes['button2Text']) ? sanitize_text_field($attributes['button2Text']) : '';
$button2_url = isset($attributes['button2Url']) ? esc_url($attributes['button2Url']) : '';
$button3_text = isset($attributes['button3Text']) ? sanitize_text_field($attributes['button3Text']) : '';
$button3_url = isset($attributes['button3Url']) ? esc_url($attributes['button3Url']) : '';
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
$target = $open_in_new_window ? ' target="_blank" rel="noopener noreferrer"' : '';

// Nomenclature color: inherit the color of the post this card represents.
// The theme owns the term→class logic (guarded so the plugin stays usable
// without it); the filter lets other code adjust the card's wrapper classes.
$wrapper_classes = array();
if (function_exists('ct_nomenclature_post_class')) {
  $nom_class = ct_nomenclature_post_class($post->ID);
  if ('' !== $nom_class) {
    $wrapper_classes[] = $nom_class;
  }
}
$wrapper_classes = apply_filters('theatrum_cover_card_classes', $wrapper_classes, $post->ID, $attributes);
$wrapper_attributes = get_block_wrapper_attributes(array('class' => implode(' ', array_map('sanitize_html_class', $wrapper_classes))));
?>
<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>
  <div class="cover-card" style="<?php echo esc_attr($bg_style); ?>">
    <a class="cover-card__link" href="<?php echo esc_url($post_permalink); ?>" <?php echo $target; ?> aria-label="<?php echo esc_attr($post_title); ?>"></a>
    <div class="user-content"><?php echo do_blocks($content); ?></div>
    <div class="bottom-bar">
      <h4 class="dates"><?php
                        if ('event' === $post->post_type) {
                          $event_date  = get_post_meta($post->ID, 'date', true);
                          $event_start = get_post_meta($post->ID, 'start', true);
                          $event_end   = get_post_meta($post->ID, 'end', true);
                          // date is stored as m/d/Y
                          if ($event_date) echo esc_html(wp_date('M j', strtotime($event_date)));
                          if ($event_date && ($event_start || $event_end)) echo ' @ ';
                          // times are stored as H:i:s
                          if ($event_start) echo esc_html(wp_date('g:i A', strtotime($event_start)));
                        } else {
                          $opening = get_post_meta($post->ID, 'opening', true);
                          $closing = get_post_meta($post->ID, 'closing', true);
                          if ($opening) echo esc_html(wp_date('M j', strtotime($opening)));
                          if ($opening && $closing) echo ' – ';
                          if ($closing) echo esc_html(wp_date('M j', strtotime($closing)));
                        }
                        ?></h4>
      <div class="buttons">
        <?php
        if ($button_text) :
          $href = $button_url ?: $post_permalink;
        ?>
          <a href="<?php echo esc_url($href); ?>" class="button" <?php echo $target; ?>><?php echo esc_html($button_text); ?></a>
        <?php endif; ?>
        <?php if ($button2_text) :
          $href2 = $button2_url ?: $post_permalink;
        ?>
          <a href="<?php echo esc_url($href2); ?>" class="button" <?php echo $target; ?>><?php echo esc_html($button2_text); ?></a>
        <?php endif; ?>
        <?php if ($button3_text) :
          $href3 = $button3_url ?: $post_permalink;
        ?>
          <a href="<?php echo esc_url($href3); ?>" class="button" <?php echo $target; ?>><?php echo esc_html($button3_text); ?></a>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>
<?php
