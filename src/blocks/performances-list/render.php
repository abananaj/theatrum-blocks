<?php

/**
 * Performances List block — server-side render
 * $attributes, $content, $block are injected by WordPress.
 *
 * Reads the 'performances' ACF repeater from the current post and
 * displays the next 5 upcoming performances (today or later), sorted
 * ascending by date.
 *
 * Each row exposes: date (D M jS), time (g:i A), note (plain text).
 */

$post_id = isset($block->context['postId']) ? (int) $block->context['postId'] : get_the_ID();

if (! $post_id) {
  return;
}

if (! function_exists('get_field')) {
  return;
}

$rows = get_field('performances', $post_id);

if (empty($rows) || ! is_array($rows)) {
  theatrum_render_meta_empty_marker('div', '');
  return;
}

// Today at midnight (start of day) in the site timezone.
$today_ts = mktime(0, 0, 0, (int) wp_date('n'), (int) wp_date('j'), (int) wp_date('Y'));

/**
 * Parse a raw ACF date value to a Unix timestamp.
 * Handles Ymd (20260501) and Y-m-d (2026-05-01) formats.
 */
$parse_date = function ($raw) {
  if (empty($raw) || ! is_string($raw)) {
    return false;
  }
  // Strip any time component.
  $date_only = preg_replace('/[\sT].*$/', '', trim($raw));

  if (function_exists('theatrum_parse_flexible_date')) {
    $ts = theatrum_parse_flexible_date($date_only);
    if ($ts) {
      return $ts;
    }
  }

  // Ymd → Y-m-d
  if (preg_match('/^\d{8}$/', $date_only)) {
    $date_only = substr($date_only, 0, 4) . '-' . substr($date_only, 4, 2) . '-' . substr($date_only, 6, 2);
  }

  return strtotime($date_only);
};

/**
 * Parse a raw ACF time value to a Unix timestamp.
 * Handles H:i:s and H:i formats.
 */
$parse_time = function ($raw) {
  if (empty($raw) || ! is_string($raw)) {
    return false;
  }

  if (function_exists('theatrum_parse_flexible_time')) {
    $ts = theatrum_parse_flexible_time($raw);
    if ($ts) {
      return $ts;
    }
  }

  return strtotime(trim($raw));
};

// Filter rows to upcoming (today or later) and attach parsed timestamp.
$upcoming = array();
foreach ($rows as $row) {
  if (! is_array($row)) {
    continue;
  }
  if (! empty($row['hide'])) {
    continue;
  }
  $ts = $parse_date($row['date'] ?? '');
  if (false === $ts || $ts < $today_ts) {
    continue;
  }
  $upcoming[] = array(
    'ts'   => $ts,
    'date' => $row['date'] ?? '',
    'time' => $row['time'] ?? '',
    'note' => $row['note'] ?? '',
  );
}

if (empty($upcoming)) {
  theatrum_render_meta_empty_marker('div', '');
  return;
}

// Sort ascending by date.
usort($upcoming, fn($a, $b) => $a['ts'] - $b['ts']);

// Take the next 5.
$upcoming = array_slice($upcoming, 0, 5);

// Map the editor "Block spacing" (blockGap) value onto the CSS custom property
// the stylesheet consumes. blockGap isn't auto-rendered for non-layout blocks.
$wrapper_args = array();
$block_gap    = $attributes['style']['spacing']['blockGap'] ?? '';
if ($block_gap) {
  if (0 === strpos($block_gap, 'var:')) {
    $block_gap = 'var(--wp--' . str_replace('|', '--', substr($block_gap, 4)) . ')';
  }
  $wrapper_args['style'] = '--wp--style--block-gap:' . $block_gap . ';';
}

?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes( $wrapper_args ) ); ?>>

  <?php foreach ($upcoming as $perf) : ?>

    <?php
    // Format date: D M jS  →  e.g. "Sat Apr 26th"
    $date_ts      = $perf['ts'];
    $display_date = $date_ts ? wp_date('D M jS', $date_ts) : esc_html($perf['date']);

    // Format time: g:i A  →  e.g. "7:30 PM"
    $time_ts      = $parse_time($perf['time']);
    $display_time = $time_ts ? wp_date('g:i A', $time_ts) : esc_html($perf['time']);

    $note = sanitize_text_field($perf['note']);
    ?>

    <div class="performance-row">

      <p class="show">

        <span class="date"><?php echo esc_html($display_date); ?></span>

        <?php if ($display_time) : ?>
          <span class="time"><?php echo esc_html($display_time); ?></span>
        <?php endif; ?>

      </p>

      <?php if ($note) : ?>
        <p class="note">
          <span class="note"><?php echo esc_html($note); ?></span>
        </p>
      <?php endif; ?>

    </div>

  <?php endforeach; ?>

</div>