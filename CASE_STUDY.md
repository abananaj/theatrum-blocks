# theatrum-blocks — Block Library

> First draft. Component deep-dive; project-level story lives in the [root case study](../../../CASE_STUDY.md).

29 custom Gutenberg blocks. The oldest repo in the project — block work started a month before the theme existed.

---

## Goal

- Give editors blocks that read the site's **custom meta and taxonomy data** — something core WordPress has no answer for.
- Keep display logic out of the theme, so the blocks stay portable and independently versioned.
- One convention for all 29, so the twenty-ninth block costs what the third did.

---

## Timeline

198 commits, 2026-04-18 → 2026-08-31.

- **Apr** — Init. Blocks imported out of the theme; refactored onto `block.json` with split edit/save; credits split out to its own mu-plugin.
- **May** — The meta-block family built out (gallery, file, icon, thumbnail list, popover, carousel, styled text).
- **Jun** — Scaffolding formalized: `block.jsonc` template, TOC, example blocks, npm scripts. Table blocks built. Security/escaping audit, `usesContext` and block.json metadata cleanup.
- **Jul** — The heaviest month. Query filters and query-loop variations by post type; breadcrumbs with arrow-trail styling; advanced title and blockquote; page nav; production tabs; popup rebuilt on the core button trigger; a large dead-code purge.
- **Aug** — WYSIWYG support; meta-field content fallback; the `chance/` → `theatrum/` rename in three phases (PHP functions → block types and bindings → CSS classes), plus a DB-content migration script; `ct` → `tm` CSS prefix; carousel and slider format controls; deprecated blocks deleted; coding-standards fix passes.

---

## Structure

`src/blocks/` — each block is a directory with `block.json`, registration auto-discovered.

**Meta blocks** — read custom fields off the current post `meta-field` · `meta-date` · `meta-time` · `meta-image` · `meta-gallery` · `meta-file` · `meta-embed` · `meta-button` · `meta-related` · `meta-repeater` · `term-meta` · `site-option`

**Query blocks** — filtered, sorted post lists `query-loop` · `query-filter`

**Layout & navigation** `tabs` · `table-advanced` · `table-of-contents` · `breadcrumbs` · `page-nav` · `popup` · `popover`

**Media & display** `carousel` · `slider` · `list-icons` · `list-thumbnail` · `title-advanced` · `blockquote-advanced` · `production-quotes` · `performances-list`

Plus `utils/` (shared helpers) and `block.jsonc` (the documented template).

---

## Highlights

**The block API**

- `block.jsonc` is a commented, documented template — a new block starts from a known-good shape rather than a copy-paste of whatever was nearest.
- Auto-discovery from `block.json` means registration is never hand-maintained.
- Server-rendered blocks share one `render.php` convention; bindings and `usesContext` follow one pattern across the library.

**Meta blocks as the core idea**

- The site's value is in its custom data — production dates, credits, galleries, venue details.
- Core WordPress gives editors no way to place that data on a page. The `meta-*` family is the answer: pick a field from a dropdown scoped to the post type, place it, style it.
- Grouping a Heading with an empty `meta-*` block hides the Heading automatically — no editor configuration, no empty sections on the front end.

**The rename**

- `chance/` → `theatrum/` touched block types, binding sources, PHP functions, CSS classes, compiled assets, **and the block markup already saved in the database**.
- Done in staged phases (safe identifiers first, block types second, CSS third) with a migration script for existing content.

**Standards pass**

- 71 unescaped-output findings fixed, ABSPATH guards added to every render template, i18n text domain wired up, nonce handling justified or corrected on GET filter reads.

---

## Results

> **TODO:**
> - Which blocks the client actually uses most
> - Editor screenshots — the meta-field dropdown, query-filter controls
> - Reuse: which of these are genuinely portable to another project
