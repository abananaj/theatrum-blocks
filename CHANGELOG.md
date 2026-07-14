# Changelog

All notable changes to Theatrum Blocks will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- `chance/title-advanced`'s Pretitle line had no way to be customized per-page on any of the live "Header" reusable blocks (Page, Production, Venue, Event, Post, Supporter, Default) — unlike the Subtitle heading, which already used WordPress's native Pattern Overrides binding (`core/pattern-overrides`) on the Page Header block. Added the same `metadata.bindings.__default.source: "core/pattern-overrides"` to the Pretitle paragraph across all 7 live header blocks, and to Subtitle on the 6 that were missing it, so both lines are independently overridable per post. Renamed the ACF field and meta key from `pre_title` to `pretitle` (matching `subtitle`'s no-separator naming) across the ACF field group, `block-bindings.php`, `title-advanced`'s default template/`chance/post-meta` args, and existing postmeta rows
- Scoped `chance/meta-embed`'s `iframe { max-width: 100%; height: auto }` style rule to `.wp-block-chance-meta-embed iframe` — it was unscoped, and since it's registered as a block.json `"style"` (loaded in both the frontend and the block editor for every block, not just when meta-embed is present), it silently applied to any `<iframe>` on the page, including third-party block previews that render inside their own iframe
- `chance/popup` no longer uses the `hidden` attribute (which forces `display: none`) to hide its dialog/backdrop while closed — swapped for `inert`. `display: none` removes the whole subtree from the render tree, so any embedded third-party widget that measures its own size on page load (e.g. WPForms' reCAPTCHA, date pickers, or styled dropdowns) saw `0×0` dimensions and rendered broken before the popup was ever opened, even though the popup was visually hidden via `opacity: 0` regardless. `inert` blocks interaction/focus/AT-visibility the same way `hidden` did, without collapsing the box
- `chance/popup` no longer runs `wp_kses_post()` on its InnerBlocks `$content` before printing it — `$content` is already fully rendered/escaped by core's own block-rendering pipeline (no other block in this plugin re-sanitizes it), and re-filtering it against the `post` KSES allowlist stripped anything not on that list, including WPForms' inline `<script>`/`<style>` tags. KSES removes disallowed tags but can leave their text content behind as visible page text, which is what surfaced as raw JS/CSS above the form; losing the script also meant WPForms' frontend JS never ran, leaving fields stuck disabled and unstyled
- `chance/popup`'s closed backdrop/dialog (now visible-but-`opacity:0` instead of `display:none`, see above) had no explicit `pointer-events` rule, so the full-viewport `position: fixed` backdrop could still intercept clicks and hijack scroll/wheel input over the entire page even while closed and invisible — added `pointer-events: none` on both elements' closed/base state and `pointer-events: auto` only under `[data-state="open"]`, rather than relying on `inert` alone to suppress pointer interaction
- `chance/popup`'s `isOpen` was a persisted block attribute that `edit.js` wrote to on every toggle, including opening — if a post was saved (or autosaved) while a popup was open, `isOpen: true` got baked into that block's serialized JSON in `post_content`, so the editor would load it already "open" (full-canvas `pointer-events: auto` backdrop) on every subsequent visit, permanently blocking clicks/scroll in the block editor. `render.php` never read this attribute anyway (the frontend always starts closed via `view.js`), so it was pure transient UI state that never should have been persisted — removed from `block.json`, editor now tracks open/closed with local-only `useState( false )`. Existing posts with a stuck `isOpen: true` self-heal on next load since WordPress ignores attribute keys no longer declared in the block's schema
- `chance/popup`'s closed dialog/backdrop still blocked clicks and scroll in the block editor even after the `isOpen` and `pointer-events` fixes above, on a post that had never been saved with the popup open — root cause was that `style.scss`'s unconditional `.popup-dialog { display: flex }` (needed on the frontend so WPForms' JS-measured widgets still get real layout dimensions while closed) has equal-or-higher specificity than the browser's default `[hidden] { display: none }` rule, so setting the `hidden` attribute in `edit.js` never actually collapsed the box — it stayed fully laid out and centered via `position: fixed`, just invisible. Its own `pointer-events: none` didn't help either, because Gutenberg's block-wrapper styles reassert `pointer-events: auto` on the nested InnerBlocks content (e.g. the WPForms block) inside it, overriding the inherited `none`. Added an editor-only override (`editor.scss`) forcing `display: none !important` on `[hidden]`, safe there because the editor's InnerBlocks preview is always a static, disabled SSR render with no live JS-measured widgets to protect
- `chance/post-meta` block bindings source is now also registered client-side (`src/utils/meta-binding-source.js`) — WordPress core's native "Attributes" inspector panel looks the source up in the JS block bindings registry, and without a matching registration it showed "Source not registered" (disabled) and, once a value did resolve, substituted the source's raw label string into the actual block attribute (e.g. `core/image`'s `id`), which could crash the block's editor preview
- Removed the `chance/bind-embed` and `chance/bind-file` core-block-variation bindings (`core/embed`'s `url`, `core/file`'s `href`) — WordPress core's block bindings system only supports a fixed allowlist of block/attribute pairs (`get_block_bindings_supported_attributes()`), and neither `core/embed` nor `core/file` is on it, so those bindings were silently ignored everywhere (editor and front end) and never worked. Use the `chance/meta-embed` / `chance/meta-file` custom blocks instead — they don't rely on core's bindings allowlist

### Added

- `chance/chance-card` block, the successor to `chance/cover-card`: same post-card behavior, but the featured-image background now applies to the inner `.user-content` div instead of the card's outer wrapper, and the bottom bar/buttons are no longer `position: absolute` (they flow as normal flex children). `chance/cover-card` is deprecated — kept registered so existing content keeps rendering, but existing instances need to be migrated to `chance/chance-card` manually
- All `chance/*`/`theatrum/*` custom block icons are now tinted blue (`#448CCA`, the theme's "Blue" palette color) via a `blocks.registerBlockType` filter (`src/block-color.js`), so custom blocks read as a distinct visual group in the inserter/list view/toolbar — mirroring how `chance/bind-*` meta variations are tinted purple
- Post-meta block bindings source (`inc/block-bindings.php`) for `chance/post-meta`
- `theatrum_is_allowed_settings_option()` allowlist guard for board-member/staff-member/site-option option lookups

### Changed

- Rebuilt `chance/media-popover` as three nested blocks: `chance/popover` (container), `chance/popover-trigger`, and `chance/popover-content`. Previously the trigger text lived as `InnerBlocks` inside the single popover block, with media selected via a fixed sidebar picker (image/video only). Now the trigger and the popover content are each their own block that accepts any nested blocks (like a Group), so the popover can show more than media, and the trigger can be any content including an already-linked block — the built-in `linkType`/`linkUrl`/`linkPageId` fields were dropped as a result. Confirmed 0 live usages in the database before removing the old block; folder renamed `media-popover` → `popover`
- Renamed the `chance/title-subtitle` block to `chance/title-advanced` and reworked its inner-block template: the title is now a `core/post-title` (H1), the subtitle is a meta-bound `core/heading` (H2) bound to the `subtitle` field, and a new meta-bound `core/paragraph` above the title is bound to the `pre_title` field — both via the `chance/post-meta` bindings source
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
- Renamed `chance/thumbnail-list` to `chance/list-thumbnail` and refactored it to a nested-block pattern (model after `list-icons`/`list-item-icon`): items are now individual `chance/list-item-thumbnail` child blocks with a per-item thumbnail, giving native reordering/drag-and-drop instead of a custom item-management UI. Fixed the flip-card hover animation (was using a `translateY` meant for an absolutely-positioned overlay, plus `overflow: hidden` that silently killed the 3D `preserve-3d` transform) and added the missing `viewScript` registration, so the animation now runs on the frontend at all. Editor and frontend now share layout/dimensions via CSS custom properties instead of duplicated inline styles, so backend and frontend no longer diverge.
- `chance/list-item-thumbnail` items now hold real nested `core/heading` + `core/paragraph` InnerBlocks instead of fixed title/description RichText fields, so item content can include multiple headings/paragraphs like any other block content
- `chance/list-thumbnail` gained list-wide image controls: `imageSizeSlug` (WP registered image size — Thumbnail/Medium/Large/Full/custom — passed to children via block context and re-resolved against `core.getMedia()` whenever it changes), `thumbnailAspectRatio` (auto/1:1/4:3/3:4/16:9/9:16, derives the flip panel's height from width via CSS `aspect-ratio` instead of the fixed height setting), and `thumbnailObjectFit` (cover/contain/fill)

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
- Removed the `production-details` block — confirmed unused across all published content, templates, and patterns (only referenced in a docs/catalog page and a trashed test page)

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
