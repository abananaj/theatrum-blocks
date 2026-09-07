# Expanding Card (`theatrum/card-expanding`)

A card that opens on **click** to reveal what sits below its heading. Modelled on the `expanding-card` CodePen (`.examples/expanding-card.zip`).

## Text is nested blocks; the image is not

The card's content is ordinary InnerBlocks, seeded (`edit.js`'s `TEMPLATE`) as two `core/group`s — the same split `theatrum/card-scroll` uses:

| Group        | Role                                                                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `__header`   | Holds the heading. `view.js` takes the first `h1`–`h6` inside it, wherever it sits, and turns it into the accessible disclosure control (button, `aria-expanded`, focus ring). |
| `__body`     | What opens. Collapsed to one line until the card is opened.                                                                                       |

Everything inside either group is an ordinary, selectable, editable block — authors can add, remove and reorder anything within a group, nothing is locked. Only the group's class (`__header`/`__body`) matters to `view.js` and `style.scss`; the blocks inside are free.

The image is deliberately **not** a nested block. It's a block attribute chosen and sized from the sidebar, so its dimensions belong to the card rather than to the content flow, there's no `core/image` in the List View competing for the same settings, and it can be *the current post's featured image* — which no saved `core/image` could express.

No heading anywhere in the header, no toggle: the card renders permanently open, and the editor says so in the Inspector rather than leaving it to be discovered on the front end.

Content saved before this split was added is a flat heading + paragraph run with no groups at all; `view.js` falls back to its original heuristic for that shape — the first heading in `__content`, and everything after it — so existing posts keep working without a migration (see [Migrating old content](#migrating-old-content)).

## Image controls

**Use the post's featured image** is the first control in the panel. With it on, the card draws the featured image of the post it is rendering — inside a Query Loop that is each queried post in turn, which is the whole reason the block renders server-side (see below). A separately selected image stays usable as the fallback for posts that haven't got one, and the picker's button relabels itself to say so. The attachment's own alt text describes the featured image while the block's Alt Text field describes the selected one, so the two are never swapped.

The rest of the shared `src/components/card-image` panel (also used by `theatrum/card-scroll`) provides: image select/replace/remove, alt text, resolution (which registered image size to load), width, height, aspect ratio, object fit, and focal point. Every setting is written to the `__image` element as a `--theatrum-card-image-*` custom property, which `style.scss` reads with its own fallbacks — so the block decides what each value means, and the markup stays free of inline geometry.

Height is hidden while an aspect ratio is deriving it, and appears when Aspect Ratio is set to Auto — the same pattern `theatrum/list-thumbnail` uses.

On the front end `render.php` renders the image through `wp_get_attachment_image()`, so it ships with `srcset`/`sizes` and core's lazy-loading. In the canvas `use-card-image-preview.js` resolves the same picture from block context, so the editor shows what the front end will print — including the right featured image for each card in a Query Loop.

## How it renders

The block is **dynamic**: `save()` writes only the nested blocks (bare, as `theatrum/carousel` does) and `render.php` prints the card wrapper, the image element, and the `__content` wrapper around `$content`. That split is what lets the image depend on the post being rendered.

The sizing custom properties go on the `__image` element itself rather than the block wrapper, because `get_block_wrapper_attributes()` puts a merged style through `safecss_filter_attr()` — the same reason `theatrum/carousel` writes its own vars directly. `theatrum_card_image_html()` in `inc/helpers.php` builds the element for both card blocks and mirrors `get-card-image-vars.js`; keep the two in step.

## How the disclosure is built

The saved markup carries no ids or ARIA, so `view.js` assembles the interactive structure on load:

- it finds `__header`/`__body` by class (falling back to the pre-split heuristic — see above — when they're absent);
- the heading's contents move into a real `<button>` (`<h3><button>` is the WAI-ARIA accordion shape, and a real button gets Enter/Space for free), gaining `aria-expanded` + `aria-controls`;
- the `__body` group is tagged `__collapse`, which is what the height transition actually animates (for the pre-split shape, `view.js` synthesizes that element instead, wrapping everything after the heading);
- ids are minted here rather than baked into `save()`, so several cards on a page never collide — the same reason `theatrum/tabs` assigns its ARIA at runtime.

The button is left `display: inline` so the heading's `line-clamp-1` utility still governs the text; a `::after` overlay makes the whole heading row a hit area too.

Clicking is delegated to the whole card, not just the heading, so the image and the rest of the card are clickable the way visitors expect. The one exception: a real link/button/form control elsewhere on the card — most likely inside the opened body — behaves normally instead of also toggling, so content the author nests inside stays usable once the card is open.

A heading that already holds a link can't hold a button (nested interactive elements are invalid), so those fall back to `div[role="button"]` with keyboard activation wired by hand — the compromise `theatrum/tabs` documents.

`.is-ready` gates the collapsed CSS, so a visitor without JS gets the whole card rather than a permanently clipped one.

## Migrating old content

`deprecated.js` carries three earlier shapes, newest first:

- **v3** rendered entirely from saved markup, before the featured-image option required server-side rendering. Only the markup changed, so there is no `migrate`.
- **v2** kept the image as a nested `core/image`; `migrate` lifts its id/url/alt back into the image attributes and drops the block.
- **v1** kept image *and* text as fixed attributes; `migrate` turns title/description into `core/heading` + `core/paragraph`.

All were short-lived and unreleased, and `wp db query` found no live instances of v1 when the rewrite landed — the deprecations cover drafts and other environments. Note that a deprecation only rewrites saved markup when the post is opened **and saved**; until then the front end serves whatever HTML is in `post_content`.
