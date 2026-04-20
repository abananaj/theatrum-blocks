<?php

/**
 * REST API endpoints for Theatrum Blocks.
 * Loaded at plugin init so routes are available for block editor requests.
 */

if (! defined('ABSPATH')) {
  exit;
}

/* -----------------------------------------------------------------------
 * Cover Card
 * -------------------------------------------------------------------- */

function register_cover_card_rest_endpoint()
{
  register_rest_route(
    'chance/v1',
    '/cover-card/(?P<meta_key>[a-zA-Z0-9_-]+)',
    array(
      'methods'             => 'GET',
      'callback'            => 'cover_card_rest_callback',
      'permission_callback' => '__return_true',
      'args'                => array(
        'meta_key' => array(
          'validate_callback' => function ($param) {
            return is_string($param);
          },
        ),
      ),
    )
  );
}
add_action('rest_api_init', 'register_cover_card_rest_endpoint');

function cover_card_rest_callback($request)
{
  $meta_key        = $request->get_param('meta_key');
  $current_post_id = intval($request->get_param('current_post_id') ?? 0);

  if (! $meta_key) {
    return new WP_REST_Response(array('message' => 'No meta key provided'), 400);
  }

  if (is_numeric($meta_key)) {
    $post_id = intval($meta_key);
  } else {
    if ($current_post_id > 0) {
      $looked_up_post_id = get_post_meta($current_post_id, $meta_key, true);
      if ($looked_up_post_id) {
        $post_id = intval($looked_up_post_id);
      } else {
        return new WP_REST_Response(
          array('message' => 'Meta key "' . esc_attr($meta_key) . '" not found on post ' . $current_post_id),
          404
        );
      }
    } else {
      $args  = array(
        'post_type'      => 'any',
        'posts_per_page' => 1,
        'meta_query'     => array(
          array('key' => $meta_key, 'compare' => 'EXISTS'),
        ),
      );
      $posts = get_posts($args);
      if (empty($posts)) {
        return new WP_REST_Response(
          array('message' => 'No post found with meta key: ' . esc_attr($meta_key)),
          404
        );
      }
      $post_id = $posts[0]->ID;
    }
  }

  $post = get_post($post_id);
  if (! $post) {
    return new WP_REST_Response(array('message' => 'Post not found'), 404);
  }

  $featured_image_url = has_post_thumbnail($post->ID)
    ? get_the_post_thumbnail_url($post->ID, 'full')
    : '';

  return new WP_REST_Response(array(
    'post_id'        => $post->ID,
    'post_type'      => $post->post_type,
    'title'          => $post->post_title,
    'featured_image' => $featured_image_url,
    'permalink'      => get_permalink($post->ID),
  ));
}

/* -----------------------------------------------------------------------
 * Meta Date
 * -------------------------------------------------------------------- */

function register_meta_date_rest_endpoint()
{
  register_rest_route('chance/v1', '/meta-date/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)/(?P<format>.+)', array(
    'methods'             => 'GET',
    'callback'            => 'get_meta_date_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
  ));
}
add_action('rest_api_init', 'register_meta_date_rest_endpoint');

function get_meta_date_rest_callback($request)
{
  $post_id = intval($request['post_id']);
  $key     = sanitize_text_field($request['key']);
  $format  = sanitize_text_field(urldecode($request['format']));

  $value = get_post_meta($post_id, $key, true);

  if (empty($value)) {
    return new WP_REST_Response(array('value' => "[{$key}]"), 200);
  }

  $date_only_value = preg_replace('/\s.*$/', '', $value);
  if (strlen($date_only_value) > 10) {
    $date_only_value = substr($date_only_value, 0, 10);
  }

  $timestamp = theatrum_parse_flexible_date($date_only_value);
  if (!$timestamp) {
    $timestamp = strtotime($date_only_value);
  }

  $display_value = wp_date($format, $timestamp);
  return new WP_REST_Response(array('value' => esc_html($display_value)), 200);
}

/* -----------------------------------------------------------------------
 * Meta Time
 * -------------------------------------------------------------------- */

function register_meta_time_rest_endpoint()
{
  register_rest_route('chance/v1', '/meta-time/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)/(?P<format>.+)', array(
    'methods'             => 'GET',
    'callback'            => 'get_meta_time_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
  ));
}
add_action('rest_api_init', 'register_meta_time_rest_endpoint');

function get_meta_time_rest_callback($request)
{
  $post_id = intval($request['post_id']);
  $key     = sanitize_text_field($request['key']);
  $format  = sanitize_text_field(urldecode($request['format']));

  $value = get_post_meta($post_id, $key, true);

  if (empty($value)) {
    return new WP_REST_Response(array('value' => "[{$key}]"), 200);
  }

  $timestamp = theatrum_parse_flexible_time($value);
  if (!$timestamp) {
    return new WP_REST_Response(array('value' => esc_html((string) $value)), 200);
  }

  $display_value = wp_date($format, $timestamp);
  return new WP_REST_Response(array('value' => esc_html($display_value)), 200);
}

/* -----------------------------------------------------------------------
 * Meta Field (post-meta)
 * -------------------------------------------------------------------- */

function register_post_meta_field_rest_endpoint()
{
  register_rest_route('chance/v1', '/post-meta/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)', array(
    'methods'             => 'GET',
    'callback'            => 'get_post_meta_field_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
  ));
}
add_action('rest_api_init', 'register_post_meta_field_rest_endpoint');

function get_post_meta_field_rest_callback($request)
{
  $post_id = intval($request['post_id']);
  $key     = sanitize_text_field($request['key']);

  $value = get_post_meta($post_id, $key, true);

  if ($value === '' || $value === false) {
    return new WP_REST_Response(array('value' => ''), 200);
  }

  if (is_array($value) || is_object($value)) {
    $value = json_encode($value);
  }

  return new WP_REST_Response(array('value' => esc_html((string) $value)), 200);
}

/* -----------------------------------------------------------------------
 * Meta Repeater
 * -------------------------------------------------------------------- */

function register_meta_repeater_rest_endpoint()
{
  register_rest_route(
    'chance/v1',
    '/meta-repeater/(?P<post_id>\d+)/(?P<repeater_key>[a-zA-Z0-9_-]+)',
    array(
      'methods'             => 'GET',
      'callback'            => 'get_meta_repeater_rest_callback',
      'permission_callback' => function () {
        return current_user_can('edit_posts');
      },
    )
  );
}
add_action('rest_api_init', 'register_meta_repeater_rest_endpoint');

function get_meta_repeater_rest_callback($request)
{
  $post_id      = intval($request['post_id']);
  $repeater_key = sanitize_text_field($request['repeater_key']);

  if (! function_exists('get_field')) {
    return new WP_REST_Response(array('rows' => 0), 200);
  }

  $rows = get_field($repeater_key, $post_id);

  if (empty($rows) || ! is_array($rows)) {
    return new WP_REST_Response(array('rows' => 0), 200);
  }

  return new WP_REST_Response(array('rows' => count($rows)), 200);
}

/* -----------------------------------------------------------------------
 * Meta Button
 * -------------------------------------------------------------------- */

function register_meta_button_rest_endpoint()
{
  register_rest_route(
    'chance/v1',
    '/meta-button/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)',
    array(
      'methods'             => 'GET',
      'callback'            => 'get_meta_button_rest_callback',
      'permission_callback' => function () {
        return current_user_can('edit_posts');
      },
    )
  );
}
add_action('rest_api_init', 'register_meta_button_rest_endpoint');

function get_meta_button_rest_callback($request)
{
  $post_id = intval($request['post_id']);
  $key     = sanitize_text_field($request['key']);

  $url = get_post_meta($post_id, $key, true);

  if (empty($url)) {
    return new WP_REST_Response(array('value' => ''), 200);
  }

  $url = esc_url($url);
  if (empty($url)) {
    return new WP_REST_Response(array('value' => ''), 200);
  }

  return new WP_REST_Response(array('value' => $url), 200);
}

/* -----------------------------------------------------------------------
 * Meta Gallery
 * -------------------------------------------------------------------- */

function register_meta_gallery_rest_endpoint()
{
  register_rest_route('chance/v1', '/meta-gallery/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)', [
    'methods'             => 'GET',
    'callback'            => 'meta_gallery_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
    'args' => [
      'post_id' => ['validate_callback' => function ($param) { return is_numeric($param); }],
      'key'     => ['sanitize_callback' => 'sanitize_key'],
    ],
  ]);
}
add_action('rest_api_init', 'register_meta_gallery_rest_endpoint');

function meta_gallery_rest_callback($request)
{
  $post_id = intval($request->get_param('post_id'));
  $key     = sanitize_key($request->get_param('key'));

  if (!$post_id || !$key) {
    return new WP_REST_Response(['images' => []], 200);
  }

  $value = get_field($key, $post_id);
  if ($value === null || $value === false || $value === '') {
    $value = get_post_meta($post_id, $key, true);
  }

  if (empty($value) || !is_array($value)) {
    return new WP_REST_Response(['images' => []], 200);
  }

  $images = [];

  foreach ($value as $image) {
    if (is_array($image)) {
      $images[] = [
        'url'     => $image['url'] ?? '',
        'alt'     => $image['alt'] ?? '',
        'caption' => $image['caption'] ?? '',
        'id'      => $image['ID'] ?? 0,
      ];
    } elseif (is_numeric($image)) {
      $attach_id = intval($image);
      $src = wp_get_attachment_image_src($attach_id, 'full');
      if ($src) {
        $images[] = [
          'url'     => $src[0],
          'alt'     => get_post_meta($attach_id, '_wp_attachment_image_alt', true),
          'caption' => wp_get_attachment_caption($attach_id),
          'id'      => $attach_id,
        ];
      }
    } elseif (is_string($image) && !empty($image)) {
      $images[] = ['url' => esc_url_raw($image), 'alt' => '', 'caption' => '', 'id' => 0];
    }
  }

  return new WP_REST_Response(['images' => $images], 200);
}

/* -----------------------------------------------------------------------
 * Meta Image
 * -------------------------------------------------------------------- */

function register_meta_image_rest_endpoint()
{
  register_rest_route('chance/v1', '/meta-image/(?P<post_id>\d+)/(?P<key>[a-zA-Z0-9_-]+)', [
    'methods'             => 'GET',
    'callback'            => 'meta_image_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
    'args' => [
      'post_id' => ['validate_callback' => function ($param) { return is_numeric($param); }],
      'key'     => ['sanitize_callback' => 'sanitize_key'],
    ],
  ]);
}
add_action('rest_api_init', 'register_meta_image_rest_endpoint');

function meta_image_rest_callback($request)
{
  $post_id = intval($request->get_param('post_id'));
  $key     = sanitize_key($request->get_param('key'));

  if (!$post_id || !$key) {
    return new WP_REST_Response(['url' => ''], 200);
  }

  $value = get_field($key, $post_id);
  if ($value === null || $value === false || $value === '') {
    $value = get_post_meta($post_id, $key, true);
  }

  if (empty($value)) {
    return new WP_REST_Response(['url' => ''], 200);
  }

  if (is_array($value)) {
    return new WP_REST_Response([
      'url'     => $value['url'] ?? '',
      'alt'     => $value['alt'] ?? '',
      'caption' => $value['caption'] ?? '',
      'id'      => $value['ID'] ?? 0,
    ], 200);
  }

  if (is_numeric($value)) {
    $src = wp_get_attachment_image_src(intval($value), 'full');
    return new WP_REST_Response([
      'url'     => $src ? $src[0] : '',
      'alt'     => get_post_meta(intval($value), '_wp_attachment_image_alt', true),
      'caption' => wp_get_attachment_caption(intval($value)),
      'id'      => intval($value),
    ], 200);
  }

  return new WP_REST_Response(['url' => esc_url_raw($value), 'alt' => '', 'caption' => '', 'id' => 0], 200);
}

/* -----------------------------------------------------------------------
 * Board Member
 * -------------------------------------------------------------------- */

function register_board_member_rest_endpoint()
{
  register_rest_route('chance/v1', '/board-member/(?P<option_name>[a-zA-Z0-9_-]+)', array(
    'methods'             => 'GET',
    'callback'            => 'get_board_member_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
  ));
}
add_action('rest_api_init', 'register_board_member_rest_endpoint');

function get_board_member_rest_callback($request)
{
  $option_name = sanitize_text_field($request['option_name']);
  $value       = get_option($option_name);

  if ($value === false) {
    return new WP_REST_Response(array('value' => '', 'items' => array()), 200);
  }

  if (is_string($value)) {
    $unserialized = unserialize($value, ['allowed_classes' => false]);
    if ($unserialized !== false) {
      $value = $unserialized;
    }
  }

  $pretty_option_name = '';
  $field_key          = get_option('_' . $option_name);

  if ($field_key && function_exists('acf_get_field')) {
    $field = acf_get_field($field_key);
    if ($field && isset($field['label'])) {
      $pretty_option_name = $field['label'];
    }
  }

  if (empty($pretty_option_name)) {
    $pretty_option_name = $option_name;
    if (strpos($pretty_option_name, 'options_board_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 14);
    } elseif (strpos($pretty_option_name, 'option_board_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 13);
    } elseif (strpos($pretty_option_name, 'options_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 8);
    } elseif (strpos($pretty_option_name, 'option_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 7);
    }
    $pretty_option_name = ucwords(str_replace('_', ' ', $pretty_option_name));
  }

  if (is_array($value)) {
    $post_ids = array_filter($value, function ($id) {
      return is_numeric($id) && !empty($id);
    });

    if (!empty($post_ids) && count($post_ids) === count($value)) {
      $items = array();
      foreach ($post_ids as $post_id) {
        $post_id         = (int) $post_id;
        $post_title      = get_the_title($post_id);
        $post_url        = get_permalink($post_id);
        $post_meta_title = get_post_meta($post_id, 'title', true);

        if (!empty($post_title)) {
          $items[] = array(
            'title'      => html_entity_decode($post_title, ENT_QUOTES, 'UTF-8'),
            'url'        => $post_url,
            'meta_title' => html_entity_decode($post_meta_title, ENT_QUOTES, 'UTF-8'),
            'position'   => $pretty_option_name,
          );
        }
      }
      return new WP_REST_Response(array('value' => '', 'items' => $items), 200);
    } else {
      $value = json_encode($value);
    }
  } elseif (is_object($value)) {
    $value = json_encode($value);
  }

  if (is_string($value)) {
    $value = html_entity_decode($value, ENT_QUOTES, 'UTF-8');
  }

  return new WP_REST_Response(array('value' => $value, 'items' => array()), 200);
}

/* -----------------------------------------------------------------------
 * Site Option
 * -------------------------------------------------------------------- */

function register_site_option_rest_endpoint()
{
  register_rest_route('chance/v1', '/site-option/(?P<option_name>[a-zA-Z0-9_-]+)', array(
    'methods'             => 'GET',
    'callback'            => 'get_site_option_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
  ));
}
add_action('rest_api_init', 'register_site_option_rest_endpoint');

function get_site_option_rest_callback($request)
{
  $option_name = sanitize_text_field($request['option_name']);
  $value       = get_option($option_name);

  if ($value === false) {
    return new WP_REST_Response(array('value' => ''), 200);
  }

  if (is_string($value)) {
    $unserialized = @unserialize($value);
    if ($unserialized !== false) {
      $value = $unserialized;
    }
  }

  if (is_array($value) || is_object($value)) {
    $value = json_encode($value);
  } else {
    $value = (string) $value;
  }

  $value = html_entity_decode($value, ENT_QUOTES, 'UTF-8');
  return new WP_REST_Response(array('value' => $value), 200);
}

/* -----------------------------------------------------------------------
 * Staff Member
 * -------------------------------------------------------------------- */

function register_staff_member_rest_endpoint()
{
  register_rest_route('chance/v1', '/staff-member/(?P<option_name>[a-zA-Z0-9_-]+)', array(
    'methods'             => 'GET',
    'callback'            => 'get_staff_member_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
  ));
}
add_action('rest_api_init', 'register_staff_member_rest_endpoint');

function get_staff_member_rest_callback($request)
{
  $option_name = sanitize_text_field($request['option_name']);
  $value       = get_option($option_name);

  if ($value === false) {
    return new WP_REST_Response(array('value' => '', 'items' => array()), 200);
  }

  if (is_string($value)) {
    $unserialized = unserialize($value, ['allowed_classes' => false]);
    if ($unserialized !== false) {
      $value = $unserialized;
    }
  }

  $pretty_option_name = '';
  $field_key          = get_option('_' . $option_name);

  if ($field_key && function_exists('acf_get_field')) {
    $field = acf_get_field($field_key);
    if ($field && isset($field['label'])) {
      $pretty_option_name = $field['label'];
    }
  }

  if (empty($pretty_option_name)) {
    $pretty_option_name = $option_name;
    if (strpos($pretty_option_name, 'options_staff_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 14);
    } elseif (strpos($pretty_option_name, 'option_staff_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 13);
    } elseif (strpos($pretty_option_name, 'options_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 8);
    } elseif (strpos($pretty_option_name, 'option_') === 0) {
      $pretty_option_name = substr($pretty_option_name, 7);
    }
    $pretty_option_name = ucwords(str_replace('_', ' ', $pretty_option_name));
  }

  if (is_array($value)) {
    $post_ids = array_filter($value, function ($id) {
      return is_numeric($id) && !empty($id);
    });

    if (!empty($post_ids) && count($post_ids) === count($value)) {
      $items = array();
      foreach ($post_ids as $post_id) {
        $post_id         = (int) $post_id;
        $post_title      = get_the_title($post_id);
        $post_url        = get_permalink($post_id);
        $post_meta_title = get_post_meta($post_id, 'title', true);

        if (!empty($post_title)) {
          $items[] = array(
            'title'      => html_entity_decode($post_title, ENT_QUOTES, 'UTF-8'),
            'url'        => $post_url,
            'meta_title' => html_entity_decode($post_meta_title, ENT_QUOTES, 'UTF-8'),
            'position'   => $pretty_option_name,
          );
        }
      }
      return new WP_REST_Response(array('value' => '', 'items' => $items), 200);
    } else {
      $value = json_encode($value);
    }
  } elseif (is_object($value)) {
    $value = json_encode($value);
  }

  if (is_string($value)) {
    $value = html_entity_decode($value, ENT_QUOTES, 'UTF-8');
  }

  return new WP_REST_Response(array('value' => $value, 'items' => array()), 200);
}

/* -----------------------------------------------------------------------
 * Term Meta
 * -------------------------------------------------------------------- */

function register_term_meta_field_rest_endpoint()
{
  register_rest_route(
    'chance/v1',
    '/term-meta-field/(?P<term_id>\d+)/(?P<meta_key>[a-zA-Z0-9_-]+)',
    array(
      'methods'             => 'GET',
      'callback'            => 'get_term_meta_field_rest_callback',
      'permission_callback' => function () {
        return current_user_can('edit_posts');
      },
    )
  );
}
add_action('rest_api_init', 'register_term_meta_field_rest_endpoint');

function get_term_meta_field_rest_callback($request)
{
  $term_id  = intval($request['term_id']);
  $meta_key = sanitize_text_field($request['meta_key']);

  $value = get_term_meta($term_id, $meta_key, true);

  if (empty($value)) {
    return new WP_REST_Response(array('value' => ''), 200);
  }

  return new WP_REST_Response(array('value' => esc_html((string) $value)), 200);
}

/* -----------------------------------------------------------------------
 * Artist Credits
 * -------------------------------------------------------------------- */

function register_artist_credits_rest_endpoint()
{
  register_rest_route('chance/v1', '/artist-credits/(?P<post_id>\d+)', array(
    'methods'             => 'GET',
    'callback'            => 'get_artist_credits_rest_callback',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
  ));
}
add_action('rest_api_init', 'register_artist_credits_rest_endpoint');

function get_artist_credits_rest_callback($request)
{
  $post_id = intval($request['post_id']);

  $args = array(
    'post_type'      => 'ct-credit',
    'posts_per_page' => -1,
    'meta_query'     => array(
      array('key' => 'artist', 'value' => $post_id, 'compare' => '='),
    ),
  );

  $query   = new WP_Query($args);
  $credits = array();

  while ($query->have_posts()) {
    $query->the_post();
    $credit_id     = get_the_ID();
    $production_id = get_post_meta($credit_id, 'production', true);
    $role          = get_post_meta($credit_id, 'role', true);

    if ($production_id) {
      $display_role = $role ?: get_post_meta($credit_id, 'role-group', true);

      // get_season_year is defined in artist-credits/render.php; guard for REST-only context
      $year = function_exists('get_season_year') ? get_season_year($credit_id) : '';

      $credits[] = array(
        'id'               => $credit_id,
        'production_title' => get_the_title($production_id),
        'production_url'   => get_permalink($production_id),
        'role'             => $display_role,
        'date'             => $year,
      );
    }
  }

  wp_reset_postdata();
  return new WP_REST_Response(array('credits' => $credits), 200);
}

/* -----------------------------------------------------------------------
 * Production Credits
 * -------------------------------------------------------------------- */

add_action('rest_api_init', function () {
  register_rest_route('chance/v1', '/production-credits/(?P<post_id>\d+)', array(
    'methods'             => 'GET',
    'callback'            => 'get_production_credits_rest',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
  ));
});

function get_production_credits_rest($request)
{
  $post_id = intval($request['post_id']);

  $args = array(
    'post_type'      => 'ct-credit',
    'posts_per_page' => -1,
    'meta_query'     => array(
      array('key' => 'production', 'value' => $post_id, 'compare' => '='),
    ),
  );

  $query   = new WP_Query($args);
  $credits = array();

  while ($query->have_posts()) {
    $query->the_post();
    $credit_id = get_the_ID();
    $artist_id = get_post_meta($credit_id, 'artist', true);
    $role      = get_post_meta($credit_id, 'role', true);

    if ($artist_id) {
      $display_role = $role ?: get_post_meta($credit_id, 'role-group', true);
      $credits[]    = array(
        'id'           => $credit_id,
        'artist_title' => get_the_title($artist_id),
        'artist_url'   => get_permalink($artist_id),
        'role'         => $display_role,
      );
    }
  }

  wp_reset_postdata();
  return new WP_REST_Response(array('credits' => $credits), 200);
}
