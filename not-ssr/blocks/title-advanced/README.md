# Title (Advanced) — `chance/title-advanced`

A heading group that seeds three inner blocks for the current post's header:

1. **Pre-title** — a `core/paragraph` (`<p>`) whose content is bound to the `pre_title` post meta / ACF field.
2. **Title** — a `core/post-title` block rendered as `<h1>` (the current post's title, dynamic).
3. **Subtitle** — a `core/heading` at `<h2>` whose content is bound to the `subtitle` post meta / ACF field.

## Bindings

The pre-title and subtitle use the plugin's custom **`chance/post-meta`** block-bindings source
(`inc/block-bindings.php`), which reads the value with ACF's `get_field()` and falls back to
`get_post_meta()` for the current post (`postId` context).

> **Editor note:** `chance/post-meta` is a server-side source, so the bound lines show a locked
> field in the editor and resolve to their actual values on the frontend. This matches the
> behavior of the plugin's `chance/bind-*` core-block variations.

## Structure

Static block — `save.js` outputs `InnerBlocks.Content`; the pre-title/subtitle bindings and the
post-title are resolved at render time. Allowed inner blocks: `core/post-title`, `core/heading`,
`core/paragraph`.
