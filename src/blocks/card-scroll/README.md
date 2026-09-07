# Scroll Reveal Card (`theatrum/card-scroll`)

A horizontal card whose image panel grows out of the leading edge as the card scrolls into view. Modelled on the `gsap-card-scroll-reveal` CodePen (`.examples/gsap-card-scroll-reveal.zip`).

## Text is nested blocks; the image is not

The card's text column is ordinary InnerBlocks, seeded as two sections — see below. Everything in them is selectable and editable in the canvas and the List View, with nothing locked — add a button, a list, whatever the card needs.

The image is deliberately **not** a nested block: its width is what the reveal animates and its height is what keeps the card from jumping while it does, so it's a block attribute sized from the sidebar rather than a `core/image` with settings of its own — and so it can be *the current post's featured image*, which no saved `core/image` could express.

## Header and body

The text column is a fixed-height flex column holding two `core/group` blocks, modelled on the **Card, detailed scroll + gallery** pattern (post 108052):

| Section    | Class              | Behaviour                                                          |
| ---------- | ------------------ | ------------------------------------------------------------------ |
| Card header | `…__header`       | Sized by its content, never scrolled — always fully visible.        |
| Card body   | `…__body`         | Takes the height the header leaves and scrolls its overflow.        |

They're plain groups: background, padding, layout and inner blocks are all the author's. Only the two classes matter — they're what `style.scss` lays the column out by, and `edit.js`'s `TEMPLATE` is what puts them there (with `metadata.name` labelling each in the List View). A section renamed in the List View keeps working; one that loses its class does not, so the class is the thing to preserve.

**`__body` is the only scroll region in the card.** Nothing above it scrolls: `__content` is `overflow: hidden`, so a column with no `__body` in it clips at the band rather than scrolling. That's deliberate — a column that scrolls takes the header down with it, which is the one thing the split exists to prevent.

`min-height: 0` on the body is what makes any of it work — without it a flex item refuses to shrink below its content, and the body would push the card open instead of scrolling.

### The sections don't have to be direct children

Group the pair inside a wrapper — for a shared background or padding, which is what the source pattern does — and the band's height would stop at that wrapper, leaving the body nothing to size against; the column would overflow and the header would scroll away. So every element on the path down to `__body` is made a pass-through flex column (`&__content :has(…__body)`), and the height reaches the body however deep it sits.

Two consequences worth knowing before editing this:

- A constrained group hands its children `margin-inline: auto !important`, and auto inline margins switch off a flex item's stretch — so inside a wrapper the sections would shrink to their content. The `!important` can't be outranked, so `__header`/`__body` take `width: 100%` instead: with no free space left, both auto margins resolve to zero.
- The pass-through rule keys on the `__body` class, not on the wrapper, so it costs nothing on a card that has no wrapper.

## Image controls

**Use the post's featured image** is the first control in the panel. With it on, the card draws the featured image of the post it is rendering — inside a Query Loop that is each queried post in turn, which is the whole reason the block renders server-side (see below). A separately selected image stays usable as the fallback for posts that haven't got one.

The rest of the shared `src/components/card-image` panel (also used by `theatrum/card-expanding`) provides image select/replace/remove, alt text, resolution, width, height, object fit and focal point. Each is written to the `__image` element as a `--theatrum-card-image-*` custom property that `style.scss` reads.

**Aspect Ratio is not offered here.** The panel's width animates from zero, so a ratio-derived height would animate with it and drag every card below up and down through the reveal. Height governs the card instead (default `12rem`): the image panel and the text column each carry it, which is what fixes the card's height and gives the body something to scroll inside. `showAspectRatio={ false }` in `edit.js` is what hides the control.

That height has to be a *definite* one, twice over: the `<img>` in the panel is `height: 100%`, which against an auto-height parent resolves to the picture's natural height and blows the band open; and a text column with no height of its own simply grows with its copy. Which is also why Height here offers no `%` unit (`heightUnits={ ABSOLUTE_UNIT_OPTIONS }`) — the card has nothing for a percentage to resolve against, so one would quietly leave the card sized by its content. A card saved with `%` from before keeps showing that unit in the control, and renders as though no height were set.

## How it renders

The block is **dynamic**: `save()` writes only the nested blocks (bare, as `theatrum/carousel` does) and `render.php` prints the card wrapper, the image element, and the `__content` wrapper around `$content` — the last carrying the band height, via `theatrum_card_height_style()`. That split is what lets the image depend on the post being rendered. `theatrum_card_image_html()` in `inc/helpers.php` builds the element for both card blocks — via `wp_get_attachment_image()`, so it ships with `srcset` and lazy-loading — and mirrors `get-card-image-vars.js`; keep the two in step. The sizing custom properties go on the `__image` element rather than the block wrapper, because `get_block_wrapper_attributes()` puts a merged style through `safecss_filter_attr()`.

## How the reveal works

`view.js` adds `.is-js` (which collapses the panel to zero width) and observes each card; crossing the trigger point adds `.is-revealed`, and the panel's width transitions back to the author's setting. The flex gap keeps the text a constant distance from the panel, so the text slides across as it opens — the movement the source pen gets from GSAP. `object-fit: cover` means the narrowing panel crops the picture rather than distorting it.

A card with no image gets no `.is-js` at all and simply renders as its text column.

It is deliberately **not** driven by `theatrum-animation`'s GSAP/ScrollTrigger engine — that plugin's registry is a fixed set of generic entrance presets bound through the inspector, not a slot for a bespoke width tween, and a second ScrollTrigger stack costs more than one native `IntersectionObserver`. One-shot only (no reverse on scroll up), and reduced-motion visitors get the final state immediately.

Because `.is-js` is what collapses the panel, a visitor without JS sees the card already revealed.

## Migrating old content

`deprecated.js` carries three earlier shapes, newest first:

- **v3** rendered entirely from saved markup, before the featured-image option required server-side rendering. Only the markup changed, so there is no `migrate`.
- **v2** kept the image as a nested `core/image`; `migrate` lifts its id/url/alt back into the image attributes and drops the block.
- **v1** kept image *and* text as fixed attributes; `migrate` turns title/description into `core/heading` + `core/paragraph`.

All were short-lived and unreleased, and `wp db query` found no live instances of v1 when the rewrite landed — the deprecations cover drafts and other environments. Note that a deprecation only rewrites saved markup when the post is opened **and saved**; until then the front end serves whatever HTML is in `post_content`.

`theatrum_card_is_legacy_content()` is what spots that older markup, and it matches the wrapper class as a whole token rather than a substring — a current card's first inner block carries `{base}__header`, which a substring test reads as the old wrapper and hands straight back unrendered.

Adding the two sections needed no new deprecation: a template only seeds newly inserted blocks, and `save()`'s output didn't change. An existing card keeps its loose blocks, and — since `__body` is the only scroll region — its column now clips at the band instead of scrolling, until an author groups the content into the two sections. Adding the classes to a hand-built card is an Advanced → Additional CSS class edit on each of the two groups; nothing else about the card has to change.
