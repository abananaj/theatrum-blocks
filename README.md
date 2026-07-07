# Theatrum Blocks

Custom Gutenberg block plugin for [Chance Theater](https://chancetheater.org). 35+ blocks for production management, metadata display, carousels, tables, tabs, and frontend filtering.

**Version:** 0.1.1 | **Requires:** WordPress 6.8+ / PHP 7.4+ | **License:** GPL-2.0-or-later

📋 [CLAUDE.md](./CLAUDE.md) · [AGENTS.md](./AGENTS.md) · [CHANGELOG.md](./CHANGELOG.md)

---

## Block Inventory

### 🎭 Production Blocks
| Block | Status | Notes |
|-------|--------|-------|
| `production-performances` | ✅ | Var of meta-repeater; filters to upcoming only, shows next 5 |
| `production-quotes` | ✅ | Var of meta-repeater; responds to font-size |
| `production-tabs` | ✅ | |
| `production-trailer` | ⚠️ | Editor shows preview chip; real filter is frontend-only |
| `season-producer` | ⚠️ | Candidate for removal — may be replaced by `term-meta` |

### 🔗 Meta Blocks (Block Bindings)
Variation blocks backed by the `chance/post-meta` binding source (WP 6.5+). Existing instances migrate via "Transform to" in the block toolbar.

| Block | Status | Notes |
|-------|--------|-------|
| `meta-button` | ✅ | Var of `core/button` |
| `meta-date` | ✅ | Var of `core/paragraph`; date format arg |
| `meta-embed` | ✅ | Var of `core/embed` |
| `meta-field` | ✅ | Var of `core/paragraph` |
| `meta-file` | ✅ | Var of `core/file` |
| `meta-image` | ✅ | Var of `core/image`; binds `id` attribute |
| `meta-gallery` | ✅ | Kept as custom block (too many custom controls) |
| `meta-repeater` | ✅ | Variations: bylines, awards, producers, performances, quotes, notes, events |
| `meta-icon` | ⏭️ | Skip — target (icon block) is experimental |
| `meta-related` | ⏭️ | Skip — no suitable core block target |
| `meta-time` | ⚠️ | Actively used in existing content — kept for now, revisit with a migration later |

### 📋 Table-Advanced
Hierarchical table block system.

| Block | Status |
|-------|--------|
| `table-advanced` | ⚠️ `table-layout: auto` default not yet configurable |
| `table-advanced/table-caption` | ✅ |
| `table-advanced/table-header` | ✅ |
| `table-advanced/table-body` | ✅ |
| `table-advanced/table-footer` | ✅ |
| `table-advanced/table-row` | ✅ |
| `table-advanced/table-heading-cell` | ✅ responds to color settings |
| `table-advanced/table-cell` | ✅ responds to color settings |

### 🗂️ Tabs
| Block | Status |
|-------|--------|
| `tabs` | ✅ |
| `tabs/tab-heading` | ✅ |
| `tabs/tab-item` | ✅ |
| `tabs/tab-panel` | ✅ |

### 🖼️ Display Blocks
| Block | Status | Notes |
|-------|--------|-------|
| `breadcrumbs` | ✅ | |
| `card-carousel` | ⚠️ | Won't save media from editor; nav arrows broken on FE |
| `card-static` | ✅ | |
| `cover-card` | ⚠️ | Error fetching data in editor on blocks page; FE renders correctly |
| `cover-carousel` | ⚠️ | Opacity won't save; nav broken on FE |
| `list-icons` | ⚠️ | Needs list-item as nested block |
| `list-icons/list-item-icon` | ✅ | Child of list-icons |
| `list-thumbnail` | ✅ | Refactored to nested `list-item-thumbnail` blocks (model after list-icons); flip-card hover animation fixed |
| `list-thumbnail/list-item-thumbnail` | ✅ | Child of list-thumbnail |
| `media-popover` | ✅ | |
| `popup` | ✅ | |
| `title-subtitle` | ⚠️ | Needs post title in allowed blocks |

### 🔍 Query & Data Blocks
| Block | Status | Notes |
|-------|--------|-------|
| `query-filter` | ✅ | Frontend filter/sort for query loops via Interactivity API |
| `query-loop` | ✅ | Variations by main post type |
| `site-option` | ✅ | Shows option value + meta value in `.site-option-meta` span |
| `term-meta` | ⭐ | |
| `table-of-contents` | ⚠️ | Renamed from `core/table-of-contents` to `theatrum/table-of-contents` (was squatting on core's namespace); auto-generation from headings not yet wired |

### 👥 People Blocks (temp un-deprecated)
| Block | Status |
|-------|--------|
| `board-member` | ⚠️ |
| `staff-member` | ⚠️ |
| `copyright-date-block` | ✅ |

---

## Architecture

```
theatrum-blocks/
├── src/blocks/[block-name]/
│   ├── block.json        # metadata, attributes, supports, context
│   ├── edit.js           # editor React component
│   ├── render.php        # server-side render (dynamic blocks)
│   └── index.js          # optional: icons, registration
├── inc/
│   ├── helpers.php       # date parsing, production queries, query-loop-by-term filter
│   ├── rest-endpoints.php # /chance/v1/* routes for block editor data
│   └── block-bindings.php # chance/post-meta binding source (WP 6.5+)
├── build/                # compiled output (gitignored)
├── theatrum-blocks.php   # plugin entry: block registration, category, devMode attr, style-book
└── package.json
```

### Key Systems

- **Block Bindings** — `chance/post-meta` source in `inc/block-bindings.php` powers all meta-variation blocks. Reads ACF `get_field()` with raw `get_post_meta()` fallback. Handles date formatting, URL/href, and attachment ID attributes.
- **REST API** — 15+ endpoints under `/wp-json/chance/v1/` serve block editor previews. All require `edit_posts` capability except `/cover-card` (see Issues).
- **Date parsing** — `theatrum_parse_flexible_date()` handles Unix timestamps, YYYYMMDD, YYYY-MM-DD, MM/DD/YYYY, text dates; results cached 1h in `ct_dates` group.
- **Query loop by term** — `theatrum_filter_query_loop_by_term()` constrains nested query loops to their `term-template` context (supports WP 6.9+ `core/term-template`).
- **devMode** — `theatrum_add_dev_mode_attribute` injects a `devMode` boolean attribute to every `chance/*` and `theatrum/*` block via `block_type_metadata` filter. Only `breadcrumbs` currently wires up the inspector toggle/indicator (see `DEV_MODE.md`).

---

## Development

```bash
npm run start           # webpack watch + hot reload
npm run build           # production build (minified), one-time
npm run build:watch     # production build, watch mode
npm run deploy          # same as build
npm run format          # WordPress code standards
npm run lint:js         # JS lint
npm run lint:css        # CSS lint
npm run packages-update # update @wordpress/* dependencies
npm run plugin-zip      # create a distributable plugin zip
```

---

## Next Steps (by severity)

### 🔴 Security
- ~~`/cover-card` endpoint is unauthenticated~~ — fixed. It's still public (the home page widget needs anonymous access), but now checks `is_post_publicly_viewable()` so drafts/private/pending posts of any type can no longer be enumerated.
- ~~board-member/staff-member/site-option allow reading arbitrary `wp_options`~~ — fixed. Option names are now gated to `options_`/`option_`-prefixed ACF-options-page values via `theatrum_is_allowed_settings_option()`.

### 🟠 Bugs / Correctness
- ~~Wrong text domain in `production-details/render.php`~~ — fixed (`theatrum-blocks`).
- ~~`date()` instead of `wp_date()`~~ — fixed in cover-card, copyright-date-block, and `chance_format_production_date()`.
- ~~`cover-card` ignores block context `postId`~~ — fixed, now falls back to `$block->context['postId']`.
- ~~Mixed `opening`/`closing` meta_query formats~~ — fixed; production queries now parse via `theatrum_parse_flexible_date()` rather than SQL DATE/DATETIME casts, since stored values are a genuine mix of `Ymd` and `Y-m-d H:i:s`.

### 🟡 Technical Debt
- **Unprefixed REST callback functions**: `get_board_member_rest_callback`, `get_staff_member_rest_callback`, `get_meta_date_rest_callback`, `get_meta_time_rest_callback`, `get_meta_related_rest_callback`, `get_production_performances_rest_callback`, `get_site_option_rest_callback` — should use `theatrum_` prefix to avoid collisions.
- **`board-member` / `staff-member` REST callbacks are ~90% duplicate code** — extract shared person-list logic into a helper.
- **`chance_get_next_production()` calls `chance_get_current_production()` internally** — two pages showing both blocks run multiple uncached DB queries; consider `wp_cache_get/set`.
- **`package.json` still has scaffolding defaults**: `description` = "Example block scaffolded with Create Block tool." and `author` = "The WordPress Contributors".

### 🗑️ Cleanup / Removal
- `meta-time` is actively used in existing content — keeping it for now; revisit removal alongside a content migration.
- Remove or fold `meta-icon` and `meta-related` into `term-meta` (both marked Skip).
- Evaluate `season-producer` — likely replaced by `term-meta`.
- ~~Evaluate `production-details`~~ — removed 2026-07-06; confirmed unused in any published content (only referenced in a docs/catalog page and a trashed test page).
- Decide fate of `board-member` and `staff-member` ("temp un-deprecated").

### 🔧 Improvements
- `table-advanced`: add `table-layout-fixed` toggle.
- `list-icons`: refactor to use nested `list-item-icon` block (model after `core/list` + `core/list-item`).
- `title-subtitle`: add `core/post-title` to allowed inner blocks.
- `card-carousel` / `cover-carousel`: resolve save-media and nav issues.

---

## Security Posture

Overall: **Good.** Input is consistently sanitized with `sanitize_text_field`, `sanitize_key`, `esc_html`, `esc_url`, `wp_kses_post`. Tag injection is blocked via allowlists in `meta-repeater` and `site-option`. Serialized data uses `unserialize(['allowed_classes' => false])`. The `/cover-card` public endpoint and the board/staff/site-option `wp_options` exposure (see Next Steps) have both been addressed.

---

## Resources

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Block Bindings API](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/)
- [Block Supports API](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [Interactivity API](https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [.build/blocks.md](../../../../.build/blocks.md) — comprehensive block development guidance
- [.deploy/deploy.md](../../../../.deploy/deploy.md) — deployment workflow
