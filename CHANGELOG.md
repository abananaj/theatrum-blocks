# Changelog

All notable changes to Theatrum Blocks will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Post-meta block bindings source (`inc/block-bindings.php`) for `chance/post-meta`
- `theatrum_is_allowed_settings_option()` allowlist guard for board-member/staff-member/site-option option lookups

### Changed

- Renamed the core-block meta-binding variations from `chance/meta-*` to `chance/bind-*` (e.g. `chance/bind-image`, `chance/bind-button`) so they no longer collide with the real `chance/meta-*` custom block names/titles in the inserter; variation icons now use the matching core block icon tinted purple to signal "bound" at a glance
- The `chance/meta-*` custom blocks are the primary, supported way to bind post meta/ACF — the `chance/bind-*` core-block variations are kept as optional alternates (e.g. for core/button's styling), not a migration path
- cover-card adopts the post's nomenclature color on hover, with auto-contrasted text/buttons and a guarded fallback when no term color is assigned
- Overhauled README with a complete plugin overview and workflows
- Misc block improvements across meta-date, meta-gallery, meta-repeater, production-performances, site-option, and table-advanced
- `chance_get_current_production()` / `chance_get_next_production()` now parse `opening`/`closing` meta with the existing flexible date parser instead of relying on SQL `DATE`/`DATETIME` meta_query casts, which were inconsistent against the mixed `Ymd` / `Y-m-d H:i:s` storage formats actually present in production data
- Renamed the `core/table-of-contents` block to `theatrum/table-of-contents` — it was squatting on WordPress core's reserved namespace
- Standardized all block.json `textdomain` fields on `theatrum-blocks`
- query-filter's `orderby` mode (`date-asc`, `title-desc`, etc.) now maps to real `orderby`/`order` query vars via a `query_loop_block_query_vars` filter — previously the URL params it emitted had no consumer
- cover-card now falls back to the block context `postId` when the attribute isn't set, so it adapts correctly inside a query loop
- `build/` is now committed (previously gitignored), matching the git-pull deploy workflow which expects it present after `git pull`

### Fixed

- REST endpoints (meta-date, meta-time, post-meta, term-meta, board-member, staff-member, meta-related, season-producer) now re-escape with `esc_html()` after `html_entity_decode()` before returning values — decoding without re-escaping left raw HTML in the JSON response, which is currently harmless (all current consumers render the value as a React text child) but was one `dangerouslySetInnerHTML` away from stored XSS
- `/chance/v1/cover-card/{meta_key}` no longer discloses draft/private/pending post data to anonymous users; results are restricted to publicly viewable posts
- board-member, staff-member, and site-option REST endpoints/render.php no longer allow reading arbitrary `wp_options` values (e.g. secrets from other plugins) via `edit_posts`-gated requests — only `options_`/`option_`-prefixed option names are resolved
- Meta-embed iframe fallback now escapes the URL with `esc_url()` instead of `esc_attr()`, and drops the obsolete `frameborder` attribute
- production-cast REST endpoint no longer runs an unbounded (`posts_per_page => -1`) query
- Replaced remaining server-timezone `date()` calls with `wp_date()` in cover-card, copyright-date-block, and `chance_format_production_date()`
- Fixed a timezone-mixing bug in the production-performances "today" cutoff (`mktime()` combined with site-timezone `wp_date()` components)
- `get_meta_date_rest_callback` no longer silently renders today's date when a meta value can't be parsed
- Negative-cache results in `theatrum_parse_flexible_date()` now use a sentinel value instead of `null`, so the cache actually holds on persistent object-cache backends
- Fixed `chance-ollie` textdomain typo in production-details (should be `theatrum-blocks`)
- devMode attribute now applies to `chance/*` blocks too, not only `theatrum/*` — previously ~30 of the ~45 blocks never got the attribute
- `chance_post_meta_binding_callback` no longer lowercases the meta key via `sanitize_key()`, which silently broke binding to any ACF/meta key containing uppercase letters
- query-filter's preserved-GET-params loop no longer chokes on array-valued params (e.g. `?foo[]=1`), which produced a PHP warning and a literal `"Array"` in a hidden input
- board-member's list-of-people markup now places `$append` inside the wrapper `<div>`, matching the single-value branch

### Deprecated

### Removed

- Deleted ~10 vendored Gutenberg tutorial/demo directories from `inc/` and the vendored `menu-thumbnail-flip-animation` demo from `thumbnail-list/` — none were wired into the plugin
- Removed unused `image.png` from the plugin root and dead commented-out code in cover-card and card-carousel `render.php`

### Security

- See Fixed — REST endpoint disclosure and privilege-escalation issues above

### Known Issues

- cover-card height still isn't fully resolved on the frontend (see `src/blocks/cover-card/style.scss`)

## [0.1.1] - 2026-06-10

### Changed

- Added comprehensive developer documentation (CLAUDE.md, AGENTS.md)
- Set up Claude Code configuration (.claude/settings.json) with changelog automation
- Updated README with complete plugin overview and workflows

## [0.1.0] - 2026-06-10

### Added

- Initial release of Theatrum Blocks plugin
- 30+ custom Gutenberg blocks for Chance Theater website
- Meta field blocks (meta-field, meta-date, meta-image, meta-gallery, etc.)
- Production-specific blocks (production-details, production-performances, production-quotes)
- Display blocks (breadcrumbs, carousels, popups, list-icons, etc.)
- Query filter block for frontend filtering and sorting
- Block variations system (title-subtitle, heading-toggle)
- REST API endpoints for block editors
- Helper functions for date parsing and caching
- Style Book editor integration
- WordPress theme.json style support

[Unreleased]: https://github.com/theatrum-design/theatrum-blocks/compare/0.1.1...HEAD
[0.1.1]: https://github.com/theatrum-design/theatrum-blocks/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/theatrum-design/theatrum-blocks/releases/tag/0.1.0
