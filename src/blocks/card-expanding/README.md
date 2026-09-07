# Expanding Card (`theatrum/card-expanding`)

A card that opens on **click** to reveal what sits below its heading. Modelled on the `expanding-card` CodePen (`.examples/expanding-card.zip`).

## Text is nested blocks; the image is not

The card's content is ordinary InnerBlocks. A new card is seeded with `core/heading` + `core/paragraph`, and both are selectable and editable in the canvas and the List View — authors can add, remove and reorder anything, nothing is locked.

The image is deliberately **not** a nested block. It's a block attribute chosen and sized from the sidebar, so its dimensions belong to the card rather than to the content flow, there's no `core/image` in the List View competing for the same settings, and it can be *the current post's featured image* — which no saved `core/image` could express.

Two positions in the nested content carry meaning (`style.scss`, `view.js` and `edit.js`'s `TEMPLATE` share the contract):

| Position    | Role                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------- |
| 1st child   | The heading — what a visitor clicks. `view.js` takes the first `h1`–`h6`, wherever it sits.      |
| 2nd onwards | The body. Collapsed to one line until the card is opened.                                       |

No heading, no toggle: the card renders permanently open, and the editor says so in the Inspector rather than leaving it to be discovered on the front end.

## Image controls

**Use the post's featured image** is the first control in the panel. With it on, the card draws the featured image of the post it is rendering — inside a Query Loop that is each queried post in turn, which is the whole reason the block renders server-side (see below). A separately selected image stays usable as the fallback for posts that haven't got one, and the picker's button relabels itself to say so. The attachment's own alt text describes the featured image while the block's Alt Text field describes the selected one, so the two are never swapped.

The rest of the shared `src/components/card-image` panel (also used by `theatrum/card-scroll`) provides: image select/replace/remove, alt text, resolution (which registered image size to load), width, height, aspect ratio, object fit, and focal point. Every setting is written to the `__image` element as a `--theatrum-card-image-*` custom property, which `style.scss` reads with its own fallbacks — so the block decides what each value means, and the markup stays free of inline geometry.

Height is hidden while an aspect ratio is deriving it, and appears when Aspect Ratio is set to Auto — the same pattern `theatrum/list-thumbnail` uses.

On the front end `render.php` renders the image through `wp_get_attachment_image()`, so it ships with `srcset`/`sizes` and core's lazy-loading. In the canvas `use-card-image-preview.js` resolves the same picture from block context, so the editor shows what the front end will print — including the right featured image for each card in a Query Loop.

## How it renders

The block is **dynamic**: `save()` writes only the nested blocks (bare, as `theatrum/carousel` does) and `render.php` prints the card wrapper, the image element, and the `__content` wrapper around `$content`. That split is what lets the image depend on the post being rendered.

The sizing custom properties go on the `__image` element itself rather than the block wrapper, because `get_block_wrapper_attributes()` puts a merged style through `safecss_filter_attr()` — the same reason `theatrum/carousel` writes its own vars directly. `theatrum_card_image_html()` in `inc/helpers.php` builds the element for both card blocks and mirrors `get-card-image-vars.js`; keep the two in step.

## How the disclosure is built

The saved markup carries no ids, ARIA or collapse wrapper, so `view.js` assembles the interactive structure on load:

- the heading's contents move into a real `<button>` (`<h3><button>` is the WAI-ARIA accordion shape, and a real button gets Enter/Space for free), gaining `aria-expanded` + `aria-controls`;
- everything after the heading is wrapped in one `__collapse` element, which is what the height transition can actually animate;
- ids are minted here rather than baked into `save()`, so several cards on a page never collide — the same reason `theatrum/tabs` assigns its ARIA at runtime.

The button is left `display: inline` so the heading's `line-clamp-1` utility still governs the text; a `::after` overlay makes the whole heading row the hit area, scoped to that row so links in the opened body stay clickable.

A heading that already holds a link can't hold a button (nested interactive elements are invalid), so those fall back to `div[role="button"]` with keyboard activation wired by hand — the compromise `theatrum/tabs` documents.

`.is-ready` gates the collapsed CSS, so a visitor without JS gets the whole card rather than a permanently clipped one.

## Migrating old content

`deprecated.js` carries three earlier shapes, newest first:

- **v3** rendered entirely from saved markup, before the featured-image option required server-side rendering. Only the markup changed, so there is no `migrate`.
- **v2** kept the image as a nested `core/image`; `migrate` lifts its id/url/alt back into the image attributes and drops the block.
- **v1** kept image *and* text as fixed attributes; `migrate` turns title/description into `core/heading` + `core/paragraph`.

All were short-lived and unreleased, and `wp db query` found no live instances of v1 when the rewrite landed — the deprecations cover drafts and other environments. Note that a deprecation only rewrites saved markup when the post is opened **and saved**; until then the front end serves whatever HTML is in `post_content`.
