# Expand Card (`theatrum/card-expand`)

A card that reveals its body. Two independent Inspector settings decide how: **Reveal Style** (`revealStyle`) picks the mechanic, **Activate On** (`activateOn`) picks the trigger.

| Reveal Style | Behaviour                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------- |
| **Expand**   | The body opens beneath a heading that stays put, hanging over what follows rather than resizing the card. Default. Modelled on the `expanding-card` CodePen. |
| **Overlay**  | Closed, it looks like an Expand card — image, then header. Opening slides the header+body panel up over the image, coming to rest on the card's bottom edge. |

| Activate On | Behaviour                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------ |
| **Click**   | Clicking the card opens it; clicking it again closes it. Default. |
| **Hover**   | The card opens while the pointer is over it (or focus is inside it) and closes when that stops. Adds the option to link the image to the post. |

Either way, **a click outside an open card collapses it** — including a click on a different card, so only one is ever open at a time.

This block replaces two earlier, separate blocks — `theatrum/card-expanding` and `theatrum/card-expand-overlay` — which are retired entirely in the same change that introduced this one (see [Migrating old content](#migrating-old-content)).

## Text is nested blocks; the image is not

The card's content is ordinary InnerBlocks, seeded (`edit.js`'s `TEMPLATE`) as two `core/group`s — the same split `theatrum/card-scroll` uses:

| Group      | Role                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `__header` | Expand mode: the disclosure trigger. `view.js` takes the first `h1`–`h6` inside it, wherever it sits, and turns it into the accessible control (button, `aria-expanded`, focus ring). Overlay mode: the visible top of the sliding panel, and the trigger's accessible *label* instead — see below. Either way, a header with no heading isn't invalid; the whole group stands in for it, so any content is enough. |
| `__body`   | What opens/reveals. Expand mode collapses it to nothing until opened, out of the page's flow. Overlay mode parks it below the fold and scrolls its own overflow rather than letting the panel travel past the top of the card. |

The two sections overlap by a hairline (`__content > * + *` carries `margin-block-start: -1px`, and Overlay's more specific `__body` rule repeats it). They meet at whatever fractional height the header's content works out to, and a boundary landing mid-device-pixel is antialiased — both backgrounds blend with what is behind them, which is this block's own light backing (`__content` in Overlay, the `__collapse` wrapper in Expand). On sections an author has painted darker than the card, that reads as a faint light line across the card. The overlap covers it, since the lower section paints last. Expand mode needs one more thing for the same reason: its panel is out of flow and therefore paints *after* the header, so its backing would land between the two — `__header` is given `z-index: 1` there so it stays on top and nothing lighter can get between the sections.

Everything inside either group is an ordinary, selectable, editable block — authors can add, remove and reorder anything within a group, nothing is locked. Only the group's class (`__header`/`__body`) matters to `view.js` and `style.scss`; the blocks inside are free.

The image is deliberately **not** a nested block. It's a block attribute chosen and sized from the sidebar, so its dimensions belong to the card rather than to the content flow, there's no `core/image` in the List View competing for the same settings, and it can be *the current post's featured image* — which no saved `core/image` could express.

An empty header: in Click mode, Expand has nothing to make a trigger out of, so the card renders permanently open, and Overlay still toggles (its trigger is the frame) but has nothing showing before it's opened and nothing to label the control with. In Hover mode neither needs a trigger, but the header is still the only thing a visitor sees before the card opens. The editor says so in the Inspector in every combination, rather than leaving it to be discovered on the front end.

Content saved before Expand mode's header/body split was added (inherited from this block's ancestor `theatrum/card-expanding`) is a flat heading + paragraph run with no groups at all; `view.js`'s Expand path falls back to its original heuristic for that shape — the first heading in `__content`, and everything after it.

## Image controls

**Use the post's featured image** is the first control in the panel. With it on, the card draws the featured image of the post it is rendering — inside a Query Loop that is each queried post in turn, which is the whole reason the block renders server-side (see below). A separately selected image stays usable as the fallback for posts that haven't got one, and the picker's button relabels itself to say so. The attachment's own alt text describes the featured image while the block's Alt Text field describes the selected one, so the two are never swapped.

The rest of the shared `src/components/card-image` panel (also used by `theatrum/card-scroll`) provides: image select/replace/remove, alt text, resolution, width, height, aspect ratio, object fit, and focal point. Every setting is written to the `__image` element as a `--theatrum-card-image-*` custom property, which `style.scss` reads with its own fallbacks.

Reveal Style changes what's offered: **Overlay** hides the Width control (`showWidth={false}`) — the image always fills the card edge-to-edge there, so a narrower image has nothing to do — and restricts Height to absolute units (`heightUnits={ABSOLUTE_UNIT_OPTIONS}`), since the image is the only thing sizing the frame and a percentage against a card that's sized by its own contents resolves to nothing. **Expand** offers Width, and Height in any unit, hidden while Aspect Ratio is deriving it (shown when Aspect Ratio is Auto).

On the front end `render.php` renders the image through `wp_get_attachment_image()`, so it ships with `srcset`/`sizes` and core's lazy-loading. In the canvas `use-card-image-preview.js` resolves the same picture from block context, so the editor shows what the front end will print.

## How it renders

The block is **dynamic**: `save()` writes only the nested blocks (bare, as `theatrum/carousel` does) and `render.php` prints the card wrapper, the image element, and the `__content` wrapper around `$content` — reading `attributes.revealStyle` to decide the markup shape and to add the `is-overlay` wrapper class, and `attributes.activateOn` to add `is-hover` (which nothing but `view.js` reads) and to decide whether the image is wrapped in a link.

The sizing custom properties go on the `__image` element rather than the block wrapper, because `get_block_wrapper_attributes()` puts a merged style through `safecss_filter_attr()`, which strips custom properties — the same reason `theatrum/carousel` writes its own vars directly. `theatrum_card_image_html()`/`theatrum_card_image_style()` in `inc/helpers.php` build these for both card blocks and mirror `get-card-image-vars.js`; keep the two in step.

This is a from-scratch block name with no earlier saved shape of its own, so there is no legacy-content check in `render.php` the way `theatrum/card-expanding` needed — see [Migrating old content](#migrating-old-content).

## How Expand mode renders

Image then `__content` stacked in normal document flow — the card itself is the white panel, with the image bleeding to its edges.

The body is the exception: once `.is-ready`, `__collapse` is absolutely positioned at `top: 100%`, so the card keeps the footprint it has closed (image plus header) and the opening body hangs below it, over whatever follows, instead of growing the card and pushing the rest of the page down. `.is-expanded`'s existing `z-index` is what lifts it over the content it covers. It is out of flow in *both* states rather than only while open, so closing animates exactly the way opening did instead of snapping back into flow first.

Two consequences the CSS has to handle. The card can no longer clip its own children (`overflow: visible` once ready, or the hanging panel would be cut off), so `__image` carries the top corner radii itself. And the panel now paints outside the card's box, so it repeats the card's background, bottom radii and shadow from the same literals — a background set on the block through colour supports stays on the wrapper and doesn't reach it.

That is also why `view.js` *wraps* the body group rather than animating it directly: the group carries the theme's own padding, and a padded box can't be collapsed to nothing — `height: 0` leaves the padding behind, which out of flow would hang below every closed card as a strip of background with the body's first line showing through. The wrapper has none of its own.

The saved markup carries no ids or ARIA, so `view.js`'s `setUpExpandCard` assembles the interactive structure on load. In Click mode that means a full disclosure control (Hover mode skips all of it — see [Activation](#activation-click-or-hover)):

- it finds `__header`/`__body` by class (falling back to the pre-split heuristic — see above — when they're absent, which still requires an actual heading since there's no group boundary to lean on instead);
- inside `__header`, the first `h1`–`h6` becomes the trigger, or — when there isn't one — the whole group does;
- the trigger's contents move into a real `<button>` (`<h3><button>` is the WAI-ARIA accordion shape, and a real button gets Enter/Space for free), gaining `aria-expanded` + `aria-controls`;
- the `__body` group is wrapped in a `__collapse` element, which is what the height transition actually animates (for the pre-split shape, the same element is synthesized around everything after the heading);
- ids are minted here rather than baked into `save()`, so several cards on a page never collide.

The button is left `display: inline` so the heading's `line-clamp-1` utility still governs the text; a `::after` overlay makes the whole heading row a hit area too.

Clicking is delegated to the whole card, not just the heading, so the image and the rest of the card are clickable the way visitors expect. The one exception: a real link/button/form control elsewhere on the card — most likely inside the opened body — behaves normally instead of also toggling.

Trigger content that already holds a link, button or other control can't also hold a button (nested interactive elements are invalid), so those fall back to `div[role="button"]` (or, when the trigger is the whole header group, that group's own wrapper) with keyboard activation wired by hand.

`.is-ready` gates the collapsed CSS, so a visitor without JS gets the whole card rather than a permanently clipped one.

## How Overlay mode renders

Unlike Expand mode, the image and the content panel need to occupy the *same* box, one on top of the other, so `render.php` wraps both in one `__frame` element. The frame needs no sizing of its own: the image sits in it in normal flow and gives it its height, and `style.scss` pads a header-tall strip underneath with `padding-block-end: var(--theatrum-card-expand-header-height)`.

That variable is the whole trick, and `view.js` measures it — the header is whatever blocks the author put there, at whatever the card's width makes them wrap to, so it can't be guessed in CSS. A `ResizeObserver` on the header keeps it current (a rewrapped heading, a late web font, an image loading inside the header), falling back to a `resize` listener where that isn't available.

Once `.is-ready` (view.js's `setUpOverlayCard` has wired the toggle), `__content` is absolutely positioned with its top edge at the frame's bottom (`top: 100%` — which resolves against the *padding* box, so it clears the strip) and pulled back up by exactly the header's height. The header therefore fills the strip and the body hangs below the fold, clipped by the frame's `overflow: hidden` — the same picture an Expand card shows when closed.

Opening translates the panel to `-100%`, which is 100% of the **panel's own box**, not the frame's: the panel lands with its bottom flush against the card's bottom, the header directly above the body, and whatever the image is taller than the panel still showing above it. (A percentage `transform` is always relative to the element's own border box, so this needs nothing definite anywhere.) `max-height: 100%` keeps a tall panel inside the frame — a percentage that resolves here because an absolutely positioned box's containing block always has a used height, however that height was derived.

`__header` is `flex: 0 0 auto` (fixed at the panel's own top) and `__body` is `flex: 1 1 auto; min-height: 0; overflow-y: auto` (takes what's left and scrolls) — so a body with more to show than the frame has room for scrolls internally instead of pushing the panel past the top of the card.

That makes `__body` the card's one scroll region, so `view.js` tags it `ct-scrollbar` — the chance-ollie theme's own compiled class, consumed rather than restated here, the same way `theatrum/carousel` picks it up for its own scroller. It's added in `view.js` rather than `render.php` because the body is an author's own block inside the rendered inner blocks, and because it only ever scrolls once the card is wired. With the theme inactive the class simply does nothing and the browser's default bar shows.

Because the header travels with the body, it can't double as the clickable/announced control the way Expand mode's heading can. In Click mode `view.js` instead makes the whole `__frame` the accessible control: `role="button"`, `tabindex="0"`, keyboard-activatable, `aria-expanded`/`aria-controls` wired to `__body`, and an `aria-label` borrowed from the header's own text (or, with a header that isn't just a heading, its general text content) so a screen reader announces the card by its title. `aria-hidden` goes on `__body` rather than the whole panel, precisely because the header is on show in both states.

This does mean the frame's `role="button"` can end up containing focusable descendants once the body has a link or a button of its own — the same accepted compromise Expand mode documents for a heading that already holds a link.

Clicking is delegated to the whole card, matching Expand mode's "click anywhere" behaviour. A real link/button/form control elsewhere on the card (most likely inside the opened body) behaves normally instead of also toggling.

`.is-ready` gates all of the overlay-specific CSS: before it's added, the frame is a plain flow container — image at its natural height, content following normally below it — the same no-JS fallback shape Expand mode uses, so nothing is ever hidden without a way to reach it.

## Activation: Click or Hover

**Activate On** is independent of Reveal Style — either mechanic can be triggered either way — and it is a wrapper class (`is-hover`, or its absence) that `view.js` reads, exactly as it reads `is-overlay`.

**Click** is the default and the shape both mode sections above describe: a real trigger, full `aria-expanded`/`aria-controls`/`aria-hidden` state, and clicking delegated to the whole card.

**Hover** reveals the card while the pointer is over it and hides it again when the pointer leaves, with `focusin`/`focusout` giving the keyboard the same reveal — the pairing `theatrum/list-thumbnail` already uses. `focusout` checks `relatedTarget` against the card, so moving focus *within* it (into a link in the opened body, say) isn't treated as leaving.

Hover mode builds **no trigger and sets no ARIA at all**: no `<button>`, no `role="button"`, no `aria-expanded`, no `aria-hidden`. That is deliberate rather than an omission — there is nothing for a visitor to press, so announcing a disclosure control would be announcing something they can't operate. The content simply stays in the accessibility tree in both states and the reveal is purely visual. Everything *structural* still runs either way (finding `__header`/`__body`, tagging `__collapse`, measuring the overlay header height), since that is what `style.scss` animates.

Hover doesn't exist on a touch screen, so `view.js` gates it on `matchMedia( '(hover: hover)' )` and falls back to the complete Click-mode wiring where it doesn't match. A hover card on a phone is therefore a tap-to-open card, not an unreachable one. Nothing in `style.scss` keys off `is-hover` for exactly this reason: the class is on the wrapper even when the fallback took over.

### Linking the image to the post

`linkImageToPost` is offered **only** in Hover mode, because that is where it earns its place: with no click needed to open the card, a click has nothing else to do, and a keyboard visitor has no tab stop on the card at all unless the body happens to hold a link. The image link supplies both.

`theatrum_card_image_html()` (`inc/helpers.php`, shared with `theatrum/card-scroll`) wraps the picture in `<a class="…__image-link">` *inside* the `__image` element, so the geometry custom properties stay on the element every stylesheet already targets and the `__image img` rules reach through the anchor untouched. `render.php` supplies `get_permalink()` for the post being rendered — inside a Query Loop each queried post in turn, the same post the featured image comes from — and `get_the_title()` as an `aria-label`, since the picture may be a featured image whose alt text belongs to someone else's post, or a decorative one with no alt at all.

In Overlay mode this puts a focusable link inside what Click mode would make a `role="button"` — but only Hover mode offers the link, and Hover mode builds no such role, so the two never actually meet.

The editor does not draw the anchor, the same way it doesn't draw Overlay mode's `__frame`: both are front-end-only markup from `render.php`.

### Clicking outside

Every wired card registers a "collapse" callback in one module-level list, and a single `document` click listener collapses each card the click didn't land inside — the pattern `theatrum/popover` uses, hoisted to one shared listener because a page can hold a great many cards.

A click inside a card reaches that card's own handler first and the document listener second, so the card just clicked keeps the state it took and every other open card closes: one card open at a time, and a click on the page around them closes the lot.

## Migrating old content

There isn't any. `theatrum/card-expand` is a from-scratch block name — it does not read or migrate `theatrum/card-expanding` or `theatrum/card-expand-overlay` content, both of which are retired in the same change that introduced this block (see `CHANGELOG.md`). A post using either old block name needs its card(s) manually recreated with `theatrum/card-expand`.
