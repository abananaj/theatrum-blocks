# Theatrum Blocks — Cleanup, Deprecation & Streamlining

## Context

`theatrum-blocks.php` has accumulated ~60 lines of inline TODO comments under the `$custom_blocks` array — a running list of small defects and ideas across 48 blocks. This plan triages those notes, backs them with root-cause diagnoses, records the deprecated-block migration set (with exact database and theme-template locations), and fixes the architectural duplication behind most of the complaints.

**The single finding that explains most of the notes:** no block in the plugin uses `ServerSideRender`. Every dynamic block ships (a) a bespoke REST endpoint and (b) a hand-written React preview that re-implements `render.php` in JSX. `inc/rest-endpoints.php` is 1,424 lines of 20 near-identical register/callback pairs. Because the two renderers are maintained separately, they drift — which is exactly what "looks different in the editor than the frontend" means for meta-repeater, meta-file, meta-date/time, and production-performances.

**Decisions taken:**
- Hybrid `ServerSideRender` adoption (display blocks only; keep custom previews where the editor needs interactive controls).
- Rebuild `card-carousel` on InnerBlocks; deprecate `cover-carousel`.
- Fix the `table-of-contents` build; delete `meta-icon`.
- Register the missing block categories; do **not** rename namespaces.

---

## Phase 1 — Deprecated blocks & migration

`site-option` and `term-meta` **already contain** the replacement logic and already declare the needed variations. `term-meta/render.php:11-82` is a verbatim copy of `season-producer/render.php:8-75`, and `site-option/render.php:37-179` absorbs both member blocks via `memberType`. No new code is needed — only content migration and retirement.

> ⚠️ **The note in `theatrum-blocks.php:132` is wrong.** It says season-producer should be replaced by *site-option*. It reads **term meta** off the `season` taxonomy, so the correct target is `chance/term-meta` with `displayType: "season-producer"`.

### Migration map

| Deprecated block | Replacement | Attribute mapping |
|---|---|---|
| `chance/board-member` | `chance/site-option` var. `board` | `+memberType:"board"`; `optionName`/`tagName`/`href`/`prepend`/`append` carry over |
| `chance/staff-member` | `chance/site-option` var. `staff` | `+memberType:"staff"`; same carry-over |
| `chance/season-producer` | `chance/term-meta` var. `season-producer` | `+displayType:"season-producer"`; `metaKey`/`headingText`/`headingLevel` carry over |
| `chance/video-trailer` (folder `production-trailer`) | `chance/meta-embed` | `metaKey` → `keyInput`; `caption` carries over; drop `aspectRatio`/`responsive`/`previewable` |
| `chance/meta-icon` | *(delete — no replacement)* | see caveat below |
| `chance/cover-carousel` | `chance/card-carousel` (post-Phase 3) | manual re-author; 1 live instance |

### Live instances (non-revision), verified against the database

| Block | Post ID | Type / Status | Title |
|---|---|---|---|
| `chance/board-member` | 2750 | page/publish | People |
| `chance/staff-member` | 2750 | page/publish | People |
| `chance/season-producer` | 64289 | page/publish | Website Manual |
| | 99222 | page/publish | Blocks |
| | 58462 | production/publish | Sanctuary City |
| | **107324** | **wp_block/publish** | **Production Grid v1** (synced pattern — fixes all its uses at once) |
| `chance/meta-icon` | 64289 | page/publish | Website Manual | - USER REMOVED MANUALLY, 0 LIVE USES FOUND. - |
| `chance/video-trailer` | 64289 | page/publish | Website Manual |
| `chance/cover-carousel` | 64289 | page/publish | Website Manual |

### ⚠️ Theme template dependency — must migrate before deleting `meta-icon`

The database is not the only consumer. `wp-content/themes/chance-ollie/templates/single-production.html` hard-codes:

- **`chance/meta-icon` × 9** — lines 408, 414, 420, 426, 432, 438, 444, 450, 456 (`keyInput: notes_1_icon` … `notes_9_icon`, `iconSize: 20`)
- **`chance/season-producer` × 4** — lines 18, 26, 104, 112

You told me meta-icon isn't used anywhere important, but these nine template uses render on every single production page. Before removing the block, decide what replaces those production-note icons — `meta-image` cannot render dashicon-style values, and `meta-file`'s mime→icon map is a different mechanism. **This is a checkpoint, not a step to run through.** If the `notes_*_icon` ACF fields store image IDs, `meta-image` works and the migration is mechanical; if they store dashicon slugs, meta-icon has no replacement and should be kept instead.

### Never used anywhere (0 instances, safe to remove)

`theatrum/card-static`, . (`theatrum/query-loop` also shows 0, but it is `inserter:false` by design — it registers `core/query` variations, so keep it.)
NOTE: KEEP `chance/copyright-date-block`

### Retirement mechanics
1. Migrate content (theme templates by hand; DB via a `wp eval-file` script in `.build/scripts/`, run against a DB export first).
2. Add `supports.inserter: false` + a `deprecated` category to each retired block so existing content keeps rendering.
3. Remove the folder and its `$custom_blocks` entry only after a full-site render check.

---

## Phase 2 — Editor/frontend parity via ServerSideRender (the big win)

**Migrate to `<ServerSideRender>`** (12 blocks). Editor output becomes byte-identical to the frontend by construction:

`meta-date`, `meta-time`, `meta-field`, `meta-related`, `meta-repeater`, `meta-file`, `meta-embed`, `meta-button`, `site-option`, `term-meta`, `production-quotes`, `production-performances`

**Keep custom previews** (interactive editor controls): `meta-gallery`, `meta-image`, `cover-card`.

This directly resolves, without per-block CSS patching:
- **meta-repeater** editor styling (`edit.js:111` emits `wp-block-chance-meta-repeater-preview`; `style.scss:3` targets `.repeater-rows`, which the preview never renders)
- **meta-file** editor icon (`edit.js:96-105` hardcodes `dashicons-media-document`; the iframed canvas also never loads the dashicons font — no `wp_enqueue_style('dashicons')` exists anywhere)
- **production-performances** not rendering in the editor at all

### Then delete the dead endpoints
Remove from `inc/rest-endpoints.php`: `meta-date`, `meta-time`, `post-meta`, `meta-repeater`, `meta-button`, `meta-icon`, `board-member`, `site-option`, `staff-member`, `term-meta-field`, `meta-embed`, `meta-related`, `season-producer`, `meta-file`, `production-quotes`, `production-performances`, `production-cast`.

**Keep** `theatrum_editor_permission_check()`, the `cover-card` resolver (`rest-endpoints.php:26`), `meta-gallery`, `meta-image`, and add a taxonomy/term list endpoint for term-meta's pickers. Expect ~1,100 of 1,424 lines to go.

---

## Phase 3 — Block-specific fixes

Ordered by "user-visible breakage" first.

### Broken on the frontend
- **`popup` — inner content never saves.** `edit.js:48` mounts `<InnerBlocks />` inside `{open && (…)}`, and `isOpen` defaults to `false` (`block.json:56`), so the tree is unmounted and never serialized. **Fix:** always mount `<InnerBlocks />`; toggle visibility with CSS, never conditional mounting. Also add an explicit trigger `:hover` color rule (`style.scss` deliberately delegates the button to the theme, whose hover swaps text to the background color).
- **`cover-carousel` — slides invisible, nav dead.** `render.php:52` writes inline `style="opacity:0"` on inactive slides; `.is-active{opacity:1}` (`style.scss:21`) lacks `!important`, so inline always wins. The editor "works" only because `editor.scss:24` *does* use `!important`. Also **double-registered**: `index.js:9` calls `registerBlockType` with inline attributes and `category:'common'` instead of importing `block.json`, causing validation resets (the "opacity not saved" symptom). Given deprecation, apply the minimal `!important` fix so the one live instance renders until it's re-authored.
- **`card-carousel` — arrows dead, FE squished.** Two bugs: `style.scss:63` targets `.ct-carousel-arrows` but `render.php:22` outputs `.ct-carousel-controls`; and `view.js:12` gates arrows on `scrollWidth - clientWidth > 0`, which is 0 when the `display:grid` track (`style.scss:79-97`) doesn't overflow. The `items` default in `block.json:53-64` uses numeric `id:1` while `edit.js:16` generates string ids — the likely "media won't save" report.
- **`table-of-contents` — never registers.** It is the **only one of 48** `block.json` files missing an `editorScript` field, so wp-scripts emits no bundle: `build/blocks/table-of-contents/` contains just `block.json`. **Fix:** add `"editorScript": "file:./index.js"`; replace the bare handle `"style": "wp-block-table-of-contents"` with `file:./style-index.css`; create the missing `src/blocks/utils/init-block.js` (imported at `index.js:10`) or inline it; delete the leftover `index.php`, whose `register_block_type_from_metadata(__DIR__ . '/table-of-contents')` builds a doubled path.
- **`query-filter` — full page reload.** `view.js:37` ends `updateFilter` with `window.location.assign()`. **Fix:** call `actions.navigate()` from `@wordpress/interactivity-router`, and set `enhancedPagination: true` on the `core/query` variations in `query-loop/index.js:59-84`. Server-side `theatrum_filter_query_loop_by_term()` / `_by_orderby()` (`helpers.php:617,662`) already read the params and need no change.
- **`meta-embed` — YouTube Error 153.** `render.php:61-68` hand-builds a `youtube-nocookie.com/embed/{id}` iframe with no `origin` param and no `referrerpolicy`; nocookie validates the embedding host via Referer and rejects the stripped default. **Fix:** append `?origin=` + `referrerpolicy="strict-origin-when-cross-origin"`, or route YouTube through the `wp_oembed_get()` path already used for the generic variation (`render.php:73`).

### Cosmetic / consistency
- **`meta-date` / `meta-time` spacing.** Root cause is markup, not CSS: they put the block wrapper directly on the semantic tag (`<p class="wp-block-chance-meta-date">`), and `tagName` defaults to `"p"` — so the theme's paragraph line-height applies. `meta-field` defaults to `"span"` and nests it inside an `inline-block` div. **Fix:** default both to `"span"` and reset `line-height` (neither style file does today).
- **`production-tabs` editor is vertical, FE is horizontal.** Deliberate, not a bug: `edit.js:11` adds `.is-editor`, letting `editor.scss:6-28` (3 classes) out-specify `style.scss`'s `@media (min-width:768px)` horizontal rules (2 classes). **Fix:** drop the vertical override and let the editor inherit `style.scss`. Then apply the modern tab styling from the [Codepen reference](https://codepen.io/annabananajennings/pen/NPbeYbW).
- **`page-nav` gated to Pages.** `render.php:17-19` is `if (! is_page()) return '';`. Widen to `is_singular(['page','production','event'])`.
- **`list-icons/list-item-icon`** — add an icon color picker that defaults to `currentColor` for SVG icons.
- **`meta-image`** — add `dimensions.aspectRatio` support; today the only control is a registered-image-size `SelectControl` and the `<img>` is hardcoded `max-width:100%;height:auto` (`render.php:87`).
- **`meta-field`** — add boolean display (user-supplied text for `0`/`1`).
- **`meta-repeater`** — add a `<p>` wrapper option (subfields become `<span>`, as the default); drop the `div` option; auto-`<li>` subfields under `ul`/`ol`; add a `list-style:none` toggle.
- **`media-popover`** — invert nesting so the hovered element is the child.
- **`query-loop`** — swap variation icons (production→masks, venue→building, artist→color palette).
- **`table-advanced`** — default to `table-layout:auto`; add Tab/Shift-Tab cell navigation.

### Deferred (low value)
`meta-button`/`popup` nestable inside `core/buttons` (fights core's block-supports model); popup deep-linking via URL anchor; `cover-card` rendering one card per post ID in a multi-value meta field (overlaps `meta-related` — revisit after Phase 4).

---

## Phase 4 — Configuration & duplication cleanup

### Register the missing categories
Only `theatrum` is registered (`theatrum-blocks.php:175-199`), but blocks declare four categories. **19 blocks land in an unregistered category:** `metablock` (14), `production` (3), `deprecated` (2). Register all four in the same filter.

### Fix invalid `supports` keys
Confirmed by count across `src/blocks/**/block.json`:

| Key | Files | Status |
|---|---|---|
| `"filters"` | 15 | ❌ typo — core's key is `"filter"` |
| `"filter"` | 3 | ✅ correct |
| `"opacity"` | 17 | ❌ not a core block support; no-op |
| `"border"` | 21 | ✅ stable key |
| `"__experimentalBorder"` | 11 | ⚠️ legacy; same for `__experimentalFontFamily` etc. |

`cover-card/block.json` declares **both** `filter` and `filters`. Normalize to `filter`, delete every `opacity`, and migrate `__experimental*` typography/border keys to their stable names.

### Centralize duplicated PHP
Add to `inc/helpers.php` and adopt across `render.php` files:
- `theatrum_get_meta(int $post_id, string $key)` — the ACF-then-`get_post_meta` fallback, currently copy-pasted in `meta-file/render.php:26-29`, `meta-image/render.php:26-29`, `meta-related/render.php:31-36`, `block-bindings.php:40-45`, and `rest-endpoints.php:983-986`.
- `theatrum_sanitize_tag(string $tag, array $allowed = [...])` — replaces four hand-rolled `in_array` allowlists (`meta-field:51`, `site-option:253`, `meta-repeater:41`, `meta-related:74`) and three bare `tag_escape()` calls (`meta-date:99`, `meta-time:57`, `term-meta:101`), which are *not* equivalent — `tag_escape` permits any tag.
- Route `cover-card`, `board-member`, and `staff-member`'s hand-rolled `get_the_title`/`get_permalink` loops through the existing `theatrum_resolve_post_links()` (`helpers.php:170`).
- Delete `season-producer/render.php` outright once retired — `term-meta/render.php:11-82` is a byte-for-byte duplicate.

### Normalize attribute names (new blocks + deprecations only — do not rename in place)
The same concept has four names today: `keyInput` (9 blocks), `metaKey` (6), `optionName` (3), `repeaterKey` (1). Likewise `openInNewTab` / `openInNewWindow` / `linkTarget` (and `linkTarget` is boolean in `media-popover`, string in `meta-gallery`). Renaming would invalidate ~1,900 block instances. **Settle on `metaKey` / `openInNewTab` for anything new**, and record the rest as known debt in `CLAUDE.md`.

### Metadata hygiene
`example: {}` appears on nearly every block — a no-op yielding a blank inserter preview. Only `production-tabs` supplies a real one. Add real `example.attributes` where a preview is meaningful; drop the empty stubs elsewhere. 13 blocks omit `textdomain`; `query-loop` omits `$schema`, `description`, `keywords`, and `icon`. Bring `src/blocks/block.jsonc` in line with actual conventions (it still models the `theatrum/` namespace and `__experimentalBorder`).

### Fix a latent security/correctness smell
`wp_kses_data(get_block_wrapper_attributes(...))` appears in `meta-field/render.php:66`, `meta-related/render.php:82`, `site-option/render.php:99`, `season-producer/render.php:66`, and elsewhere. `wp_kses_data()` sanitizes *HTML content*, not an attribute string; running it over `class="…" style="…"` can mangle entities. It is also applied inconsistently — `meta-date/render.php:101` and `meta-time/render.php:58` pass the result straight through. Remove the `wp_kses_data()` wrapper everywhere; `get_block_wrapper_attributes()` already escapes its output.

---

## Suggested order

1. **Phase 4 config fixes** — zero behavior change, unblocks everything else.
2. **Phase 1 deprecation** — resolve the meta-icon/theme-template checkpoint first.
3. **Phase 3 frontend breakage** — popup, card-carousel, query-filter, table-of-contents, meta-embed.
4. **Phase 2 SSR migration** + endpoint deletion.
5. **Phase 3 cosmetic** + card-carousel InnerBlocks rebuild.

---

## Verification

Run `npm run build` in the plugin after every phase; a block missing from `build/blocks/<slug>/` with an `index.js` will silently fail to register (that is precisely the table-of-contents bug).

**Registration sanity check** — should print 49 after meta-icon is removed:
```bash
cd wp_root && wp eval '
$n = array_filter(array_keys(WP_Block_Type_Registry::get_instance()->get_all_registered()),
  fn($b) => str_starts_with($b,"chance/") || str_starts_with($b,"theatrum/"));
echo count($n) . " registered\n";'
```
> Note: this returns **50** today, not 48 — `chance/artist-credits` and `chance/production-credits` come from the *theme*, not this plugin.

**Deprecated-usage sweep** — must reach 0 before deleting any folder. Re-run the audit query in this plan against `wp_posts` with `post_type != 'revision'`, and grep `wp-content/themes/chance-ollie/templates/` and `parts/` for `wp:chance/` — the DB alone will miss the nine `single-production.html` uses.

**Manual checks** — on `page/64289` (Website Manual, which exercises the most blocks) and `production/58462` (Sanctuary City):
1. Editor vs frontend screenshots side by side for each SSR-migrated block (this is the whole point of Phase 2).
2. `popup` — add inner content with the dialog *closed*, save, reload, confirm it persists and renders.
3. `query-filter` — select a term; confirm results update with no full-page navigation (watch the Network panel for a document request).
4. `table-of-contents` — confirm it appears in the inserter under Design.
5. `meta-embed` — confirm a YouTube trailer plays on `production/58462`.
6. Query Monitor: confirm no PHP notices and no increase in query count after the helper centralization.

Take a database export before running any migration script.
