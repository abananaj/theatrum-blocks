# Title (Advanced) — `theatrum/title-advanced`

A heading group that seeds three inner blocks for the current post's header:

1. **Pretitle** — a `core/paragraph` (`<p>`) whose content is bound to the `pretitle` post meta / ACF field.
2. **Title** — a `core/post-title` block rendered as `<h1>` (the current post's title, dynamic).
3. **Subtitle** — a `core/heading` at `<h2>` whose content is bound to the `subtitle` post meta / ACF field.

## Bindings

The pretitle and subtitle use the plugin's custom **`theatrum/post-meta`** block-bindings source
(`inc/block-bindings.php`), which reads the value with ACF's `get_field()` and falls back to
`get_post_meta()` for the current post (`postId` context).

> **Editor note:** `theatrum/post-meta` is a server-side source, so the bound lines show a locked
> field in the editor and resolve to their actual values on the frontend. This matches the
> behavior of the plugin's `theatrum/bind-*` core-block variations.
>
> The live "Header" reusable blocks on the site currently use WordPress's native
> **Pattern Overrides** feature instead (`core/pattern-overrides` binding source) so editors can
> type per-page pretitle/subtitle text directly into the block. The `theatrum/post-meta` binding
> shown above is this block's own default template when freshly inserted — not what drives the
> live header patterns.

## Structure

Static block — `save.js` outputs `InnerBlocks.Content`; the pretitle/subtitle bindings and the
post-title are resolved at render time. Allowed inner blocks: `core/post-title`, `core/heading`,
`core/paragraph`.
