# Code Review — theatrum-blocks — July 5, 2026

**Scope:** Full plugin — `theatrum-blocks.php`, `inc/` PHP, all 37 block directories (`render.php`, `block.json`, `edit.js`, `view.js`, SCSS), build config, and every documentation file (README, CLAUDE.md, AGENTS.md, CHANGELOG, DEV_MODE).
**Context consulted:** README "Resources" web links (Block Bindings API, Block Supports API, Interactivity API, WP Coding Standards), Notion work log *2026-06-11 — Whip these blocks into shape*, and Notion *Block Editor ↔ Frontend Parity — Testing Checklist*.
**Reviewer goal per Anna:** beyond fixing this install, evaluate the plugin as a **reusable base to copy for future clients** — see §6 Portability and §7 Style Separation.

---

## Executive Summary

The plugin is in solid shape where it counts most: output escaping is disciplined, tag names are allowlisted, `unserialize()` uses `allowed_classes => false`, every `render.php` now calls `get_block_wrapper_attributes()` (the June 11 parity work held), and the Interactivity API and Block Bindings are used correctly per current WP guidance.

The biggest problems are:

1. **Two security issues** in the REST layer (one known-but-worse-than-documented, one new).
2. **A namespace identity crisis** — blocks are split across `chance/*`, `theatrum/*`, and one block squatting on **`core/`** — which breaks the devMode feature for most blocks and is the single largest obstacle to reusing the plugin for other clients.
3. **Date handling correctness** — mixed format assumptions in production queries and non-timezone-aware `date()` calls.
4. **Docs drift** — README/CLAUDE.md describe commands and functions that no longer exist, and CHANGELOG has fallen behind the last five commits.
5. **~10 directories of vendored tutorial/demo code** shipped inside the plugin.

---

## 1. 🔴 Security

### 1.1 `/cover-card` endpoint: worse than the README states
`inc/rest-endpoints.php:34` — `permission_callback => '__return_true'` (known issue). But the exposure is broader than the README's description:

- **Private/draft post disclosure.** A numeric `meta_key` is treated as a post ID (`rest-endpoints.php:56-57`) and passed to `get_post()` with **no post-status or capability check**. Anonymous users can enumerate `/wp-json/chance/v1/cover-card/123` and read the **title, permalink, featured image, and opening/closing meta of drafts, private, and pending posts** of *any* post type.
- **Meta-key probing.** The non-numeric path runs a `post_type => 'any'` query with `compare => EXISTS` on an arbitrary key (`rest-endpoints.php:70-77`), letting anonymous users confirm which meta keys exist site-wide.

**Fix:** if the home-page widget genuinely needs public access, keep the route public but (a) require `get_post_status($post_id) === 'publish'` (or `is_post_publicly_viewable()`), (b) restrict `post_type` to an allowlist (`production`, `event`), and (c) allowlist accepted meta keys. Otherwise switch to `theatrum_editor_permission_check`.

### 1.2 Arbitrary `wp_options` read for any `edit_posts` user
`get_board_member_rest_callback` (`rest-endpoints.php:557`), `get_staff_member_rest_callback` (`:750`), and `get_site_option_rest_callback` (`:663`) return `get_option($option_name)` for **any option name** matching `[a-zA-Z0-9_-]+`. Contributors/Authors (who have `edit_posts`... editors certainly) can read options like `mailserver_pass`, or API keys/secrets stored by other plugins.

**Fix:** validate `option_name` against a prefix allowlist (`options_board_`, `options_staff_`, `options_` ACF fields actually used), or resolve the option through ACF field lookups only. The same applies to the `board-member`/`staff-member`/`site-option` **render.php** files, which also `get_option()` an attribute-supplied name — lower risk (attribute is set by editors in post content), but the same allowlist helper would cover both.

### 1.3 Minor hardening notes
- `theatrum_get_meta_embed_rest_callback` iframe fallback (`rest-endpoints.php:988-991`): URL is interpolated with `esc_attr()`; use `esc_url()`. Also `frameborder` is obsolete HTML.
- `theatrum_get_production_cast_rest_callback` uses `posts_per_page => -1` (`rest-endpoints.php:899`) — unbounded query; cap it.

---

## 2. 🟠 Correctness Bugs

### 2.1 Production queries compare `opening`/`closing` meta in three different formats
`inc/helpers.php`, `chance_get_current_production()` / `chance_get_next_production()`:

- First query compares meta against a **Unix timestamp** with `type => 'DATETIME'` (`helpers.php:218-231`).
- Fallback query compares against `date('Y-m-d')` with `type => 'DATE'` (`:267`).
- Next-production query compares against `date('Y-m-d H:i:s')` with `type => 'DATETIME'` (`:337`).

These cannot all be right for the same stored meta format (ACF date fields store `Ymd`; the rest of the codebase treats these keys as flexible strings). Whichever format `opening`/`closing` actually use, at least one branch silently returns wrong results. Also `date()` here is server-timezone, not site-timezone.

**Fix:** confirm the stored format once, normalize all three queries to it, and use `wp_date()`/`current_datetime()` for "now".

### 2.2 `date()` instead of `wp_date()` (site timezone) — locations updated
Known issue, but README's line references are stale:
- `src/blocks/cover-card/render.php:68, 71, 77, 79` (README says 55, 64)
- `inc/helpers.php:400` (`chance_format_production_date`) — plus its docblock says the default format is `'F j, Y'` while the signature default is `'M j'` (`helpers.php:388-392`)
- `src/blocks/copyright-date-block/render.php:12` (`date("Y")` — harmless for a year, but `wp_date('Y')` is the standard)
- `helpers.php:43` — `date('Y', $timestamp)` used for validation (server TZ; benign but inconsistent)

### 2.3 `cover-card` ignores block context `postId`
`src/blocks/cover-card/render.php:9` reads only `$attributes['postId']`. Inside a query loop the card will not adapt. **Fix:** `$post_id = $attributes['postId'] ?? ($block->context['postId'] ?? 0);` (confirmed still open; README flags this too.)

### 2.4 `query-filter` orderby mode has no consumer
`src/blocks/query-filter/render.php:86-104` emits `?orderby=date-asc|title-desc|…`, and `view.js` just navigates to the new URL. Nothing in the plugin (only `theatrum_filter_query_loop_by_term` hooks `query_loop_block_query_vars`) or the theme consumes these values — `date-asc`/`title-desc` are not valid WP query vars either. Taxonomy mode only works when the query loop **inherits the main query** and the taxonomy has a public query var. The orderby filter is effectively dead UI.
**Fix:** add a `query_loop_block_query_vars` filter that reads the sanitized GET params and maps `date-asc` → `orderby=date&order=ASC`, etc.

### 2.5 devMode filter never fires for `chance/*` blocks
`theatrum-blocks.php:207` matches names starting with `theatrum/`, but ~30 blocks are named `chance/*`. Only the 15 `theatrum/*` blocks get the injected attribute; only `breadcrumbs/edit.js` actually uses it. See §3.1 (namespaces) and §5 (DEV_MODE.md overstates the feature).

### 2.6 Smaller correctness items
- **`get_meta_date_rest_callback`** (`rest-endpoints.php:169-175`): when the date can't be parsed, `$timestamp` is `false`/`null` and `wp_date($format, null)` renders **today's date** instead of an error/raw value.
- **`chance_post_meta_binding_callback`** (`inc/block-bindings.php:29`): `sanitize_key()` **lowercases** the meta key — any ACF/meta key containing uppercase letters silently fails to bind. Use a gentler sanitizer (e.g. `preg_replace('/[^a-zA-Z0-9_\-]/', '', $key)`).
- **`query-filter/render.php:43-49`**: `$_GET` values are not `wp_unslash()`ed (WPCS), and an array param (`?foo[]=1`) passes `sanitize_text_field()` an array → PHP warning + literal `"Array"` in a hidden input. Skip non-string values.
- **`board-member/render.php:106`**: in the list branch, `esc_html($append)` is concatenated **after** `</div>`, outside the block wrapper (the single branch puts it inside at `:134`). Inconsistent markup.
- **`mktime()` + `wp_date()` mixing** (`rest-endpoints.php:1303`): `mktime` interprets components in the **server** timezone while the components come from `wp_date` (site timezone) — "today at midnight" can be off by the TZ offset around midnight. Use `(new DateTimeImmutable('today', wp_timezone()))->getTimestamp()`.
- **`meta-time`** is marked ❌ remove, but is still registered (`theatrum-blocks.php:91`) with its REST endpoint.
- **Negative-cache miss** in `theatrum_parse_flexible_date` (`helpers.php:26-28`): storing `null` then testing `!== false` makes the negative cache a no-op on object-cache backends that return `false` for stored `null`. Store a sentinel (e.g. `'none'`) instead.

---

## 3. 🟡 Standards & Technical Debt

### 3.1 Block namespace split — `chance/*` vs `theatrum/*` vs `core/*`
From `block.json` inventory: ~30 blocks under `chance/`, 15 under `theatrum/` (tabs, table-advanced family, breadcrumbs, card-static, query-loop), and **`core/table-of-contents`** — a custom block claiming the reserved `core` namespace. That last one is a genuine hazard: WordPress ships an experimental core table-of-contents block, and a future core release could register the same name and collide (or yours blocks theirs).

Also, directory names no longer match block names: `production-trailer/` → `chance/video-trailer`, `production-performances/` → `chance/performances-list`. The June 11 session renamed `heading-toggle` precisely for this consistency; these two need the same treatment.

**Recommendation (also the #1 portability move):** pick **one vendor namespace — `theatrum/`** — for every block, rename directories to match, and write block deprecations/migration for existing content. This fixes devMode (§2.5), simplifies the `block_type_metadata` filter, and de-brands the plugin.

### 3.2 Textdomain chaos
`block.json` textdomains include per-block domains (`board-member`, `card-carousel`, `meta-date`, …), **`default`** (reserved for WP core — 6 blocks), `theatrum`, and only 2 × `theatrum-blocks`. The plugin's declared Text Domain is `theatrum-blocks`, so **i18n strings in most blocks will never load translations**, and `production-details/render.php:37,44` uses `'chance-ollie'` (README notes only line 38 — there are two occurrences). **Fix:** `"textdomain": "theatrum-blocks"` everywhere.

### 3.3 Known debt confirmed still present
- Unprefixed REST callbacks: `get_board_member_rest_callback`, `get_staff_member_rest_callback`, `get_meta_date_rest_callback`, `get_meta_time_rest_callback`, `get_post_meta_field_rest_callback`, `get_meta_repeater_rest_callback`, `get_meta_button_rest_callback`, `get_term_meta_field_rest_callback`, `get_meta_related_rest_callback`, `get_production_performances_rest_callback`, `get_site_option_rest_callback` + all the `register_*_rest_endpoint()` functions. Prefix with `theatrum_`.
- `board-member` / `staff-member` REST callbacks are ~90% identical (`rest-endpoints.php:557-651` vs `:750-844`) — the only differences are the `options_board_`/`options_staff_` prefix strings. Extract one helper taking a prefix.
- `chance_get_next_production()` runs `chance_get_current_production()` internally — 3 uncached queries per page that shows both. Wrap both in `wp_cache_get/set` (group `ct_productions`, short TTL).
- `package.json` still says `"description": "Example block scaffolded with Create Block tool."`, `"author": "The WordPress Contributors"`.

### 3.4 Code style
PHP uses PSR-ish brace placement (`function foo()\n{`), non-Yoda comparisons, and un-spaced parentheses throughout — consistent, but not WPCS. Since docs say `npm run format` formats "to WordPress standards", either adopt WPCS via PHPCS (`composer require --dev wp-coding-standards/wpcs` + a `phpcs.xml`) or state the house style in CLAUDE.md so future sessions stop "fixing" it back and forth. Currently there is **no PHP linter configured at all** (`npm run format`/`lint:*` are JS/CSS only).

### 3.5 Registration robustness / performance
`theatrum_register_blocks()` calls `register_block_type()` on 44 paths with no `file_exists()` guard — a missing `build/` produces 44 `_doing_it_wrong` notices. WP 6.8 (your minimum) supports **`wp_register_block_types_from_metadata_collection( __DIR__ . '/build/blocks', __DIR__ . '/build/blocks-manifest.json' )`** — one call, uses the manifest you already generate, faster and self-maintaining. The TODO checklists living inside the `$custom_blocks` array (`theatrum-blocks.php:31-155`) would need a new home anyway — move them to README/issues where they belong.

---

## 4. 🧹 Repo Hygiene

- **`inc/` contains nine vendored Gutenberg tutorial/demo directories** shipped with the plugin: `data-basics-59c8f8/`, `format-api-f14b86/`, `interactivity-router/`, `non-block-react-wp-data-56d6f3/`, `plugin-sidebar-9ee4a6/`, `post-meta-modal-2502fb/`, `settings-sidebar-82c525/`, `slotfill-2fb190/`, `stylesheets-79a4c3/`. None are required by `theatrum-blocks.php` (it loads only `helpers.php`, `rest-endpoints.php`, `block-bindings.php`). Commit `f5d5ac3 "remove examples"` evidently missed these. Delete them (or move to a personal reference repo) — they bloat every deploy and `plugin-zip`.
- **`src/blocks/thumbnail-list/menu-thumbnail-flip-animation/`** — an embedded third-party demo project with its own `dist/`, `LICENSE.txt`, and a `Space Grotesk` stylesheet. Extract whatever technique you need into the block and delete the vendored copy.
- **`image.png`** in the plugin root — a screenshot referenced only from a comment in `theatrum-blocks.php:151`. Move to an issue/Notion.
- **Commented-out code**: `cover-card/render.php:60-61,72-73`, `card-carousel/render.php:55-61` (dead registration snippet). Delete.
- `src/blocks/block.jsonc` is a handy authoring template — fine to keep, but document it in CLAUDE.md so it isn't mistaken for a real block config.

---

## 5. 📚 Documentation Findings

| Doc | Issue |
|---|---|
| `CHANGELOG.md` | `[Unreleased]` is completely empty, yet 5 commits landed after 0.1.1 (cover-card nomenclature hover, height fixes, README updates, misc block improvements) **and** the June 11 parity fixes were never logged (the Notion checklist's "Update CHANGELOG" wrap-up item is still unchecked). |
| `CLAUDE.md` (plugin) | References `theatrum_register_block_variations()` — this function does not exist; variations are now registered via the enqueued `build/meta-variations.js`. Says `npm run build` "Equivalent to npm run start" — stale: `build` is now a one-time build; `build:watch` is the watch variant. Says `inc/index.js` is "a Node script loaded by webpack" — it isn't in the build config. |
| `README.md` | Development section repeats only 5 scripts (missing `build`, `build:watch`, `packages-update`, `plugin-zip`). Stale line references: production-details text domain is at `render.php:37` **and** `:44` (not 38); cover-card `date()` is at `:68-79` (not 55, 64); helpers `date()` at `:400` (not 398). Block inventory lists `production-trailer`/`production-performances` but the registered names are `chance/video-trailer`/`chance/performances-list`. Says "REST API — 15+ endpoints … All require `edit_posts` except `/cover-card`" — accurate, keep in sync after §1 fixes. |
| `README.md` vs `wp_root/CLAUDE.md` | README/`.gitignore` treat `build/` as **gitignored**, while the wp_root deployment checklist requires "`dist/` and `build/` folders staged and committed" for the git-pull deploy. As written, a fresh `git pull` on the server has **no `build/` directory**. Either commit `build/` (unignore it) or add a build step to `.deploy` scripts — right now the docs contradict each other and the deploy only works if `build/` is uploaded some other way. |
| `DEV_MODE.md` | States "All Theatrum blocks automatically have a `devMode` boolean attribute" — only `theatrum/*`-named blocks do (15 of ~45), and only `breadcrumbs` wires up the UI. Update the doc (or fix the filter per §3.1). |
| `AGENTS.md` | Accurate and useful; consider adding the `/changelog` skill reminder to the commit workflow since CHANGELOG keeps drifting. |
| `tabs/block.json` | `"viewScriptModule": "@wordpress/block-library/accordion/view"` — piggybacking on a **core-internal module ID**. Clever, but it silently breaks if core renames the module, and the accordion block is newer than your declared "Requires at least: 6.8". Vendor your own small view module instead, or raise the minimum WP and document the dependency. |

---

## 6. 🔁 Reusability / Portability (the "copy for other clients" goal)

Hard-coded Chance-specific assumptions, in descending order of coupling:

1. **Namespaces** — `chance/*` block names and the `chance/v1` REST namespace + `chance/post-meta` binding source + `chance_*` function prefixes bake the client name into content markup, URLs, and code. Standardize on `theatrum/*` / `theatrum/v1` / `theatrum/post-meta` / `theatrum_*` (§3.1). Block names are stored in post content, so this is far cheaper to do **now** than after more content exists.
2. **Domain model constants** scattered through code: post types `production`, `credit`, `event`; taxonomies `season`, `series` (terms `main`, `holiday`); option `options_current_season`; meta keys `opening`, `closing`, `quotes`, `performances`, `role-group=actor`, `_venue`, `_venue_room`. Centralize in one `inc/config.php` returning a filterable array (`apply_filters('theatrum_blocks_config', [...])`) so a new client site overrides post types/keys without editing 15 files.
3. **query-filter defaults** (`block.json`: `taxonomy: "season"`, `paramName: "season"`, `label: "Season"`) — make defaults empty/generic; the block already has inspector controls.
4. **Theme coupling done right** — `cover-card`'s guarded `function_exists('ct_nomenclature_post_class')` + `theatrum_cover_card_classes` filter (`cover-card/render.php:46-52`) is exactly the right pattern. Replicate it anywhere else theme knowledge creeps in.
5. **production-details hard-gates on `get_post_type() !== 'production'`** (`render.php:17`) — should come from config/attribute.
6. **Split proposal for the template repo:** keep generic blocks (tabs, table-advanced, breadcrumbs, card-static, popup, media-popover, query-filter, query-loop, meta-* bindings, term-meta, site-option) in a clean `theatrum-blocks` starter; move theatre-domain blocks (production-*, season-producer, board/staff-member, cover-card's date logic) into a `theatrum-blocks-theatre` module or per-client child plugin. The registration array is already grouped this way — the seam exists.

## 7. 🎨 Style Separation (base CSS in plugin, theme styles in theme)

Current state is already close: 55 `var(--wp--preset--*)` usages and mostly-neutral hardcoded colors (white/black overlays, grays, WP-admin blues in editor-only UI). Leaks to fix:

- `production-quotes/style.scss:32` — literal `font-family: "gabarito", sans-serif` (brand font hardcoded in the plugin).
- `production-performances/style.scss:20,30` — `var(--wp--preset--font-family--gabarito)`: preset **slug** is theme-specific; on another client's theme the variable resolves to nothing. Use a generic slug (`--wp--preset--font-family--heading` — already done correctly in `table-advanced/table-heading-cell/style.scss:4`) or `inherit`.
- `thumbnail-list/menu-thumbnail-flip-animation/src/style.scss:10` — `"Space Grotesk"` (goes away when the vendored demo is deleted, §4).

**Recommended convention for the reusable base:**
1. Plugin `style.scss` = structure only (layout, spacing scale, states, transitions) using `currentColor`/`inherit` and theme.json preset vars with **generic slugs** (`heading`, `body`, `contrast`, `base`).
2. Where the plugin needs an opinionated hook, define plugin-scoped custom properties with fallbacks — e.g. `color: var(--theatrum-accent, currentColor)` — and let each client theme (theme.json `settings.custom` or theme stylesheet) set `--theatrum-accent`.
3. Anything decorative/brand-specific (fonts, brand colors, shadows/transforms like the cover-card hover) lives in the **theme** (`chance-ollie`), targeting the block's stable class names. The June 11 cleanup (removing cover-card editor resets that fought the theme) was a step in this direction; formalize it as a rule in CLAUDE.md.

---

## 8. ✅ What's Working Well

- Escaping discipline is genuinely good: `card-carousel` escapes at assignment, `season-producer`/`term-meta`/`board-member` allowlist tag names, `wp_kses_post` for rich text, `esc_url` everywhere it matters. I found **no XSS** in the render layer.
- `unserialize(…, ['allowed_classes' => false])` used consistently — object-injection safe.
- All `render.php` files call `get_block_wrapper_attributes()` (verified programmatically) — the parity work from June 11 stuck.
- `query-filter` is a textbook Interactivity API block (`viewScriptModule`, `data-wp-interactive`, `wp_interactivity_data_wp_context`, `supports.interactivity`).
- The Block Bindings source follows the documented API (label + `get_value_callback` + `uses_context: ['postId']`), with sensible typed handling per attribute (`id`/`url`/`href`/`content`).
- `theatrum_filter_query_loop_by_term` is well-guarded and well-documented — the best docblock in the plugin.
- apiVersion 3 across all 47 block.json files; webpack config cleanly extends wp-scripts.

---

## 9. Suggested Order of Attack

| # | Action | Effort | Refs |
|---|---|---|---|
| 1 | Lock down `/cover-card` (status/type/key allowlist) + option-name allowlist on board/staff/site-option endpoints | S | §1.1, §1.2 |
| 2 | Normalize `opening`/`closing` query format + `wp_date()` everywhere | S–M | §2.1, §2.2 |
| 3 | Rename `core/table-of-contents` immediately; plan the full `theatrum/*` namespace unification + deprecations | M–L | §3.1 |
| 4 | Fix all `block.json` textdomains → `theatrum-blocks`; fix `chance-ollie` domain in production-details | S | §3.2 |
| 5 | Delete `inc/` tutorial dirs, thumbnail-list vendored demo, `image.png`, dead comments | S | §4 |
| 6 | Resolve the `build/` gitignore vs deploy-checklist contradiction | S | §5 |
| 7 | Update CHANGELOG (backfill parity fixes + unreleased commits), CLAUDE.md, README, DEV_MODE.md | S | §5 |
| 8 | Wire up (or remove) query-filter orderby mode; cover-card context postId | S | §2.3, §2.4 |
| 9 | Extract config layer + split generic/theatre blocks for the reusable template | L | §6 |
| 10 | Adopt the style-separation convention; fix the three brand-font leaks | S–M | §7 |

*Items 1–8 are shippable independently; 9–10 define the reusable template and deserve their own branch.*
