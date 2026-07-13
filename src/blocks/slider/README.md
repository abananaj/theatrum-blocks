# Slider Block

A fading slideshow block, based on the classic prev/next/dots slideshow in `example.html`. `chance/slider` is the wrapper (track + arrows + dots); each slide is a `chance/slider-item` child block, editable like a Group — it accepts any inner blocks (image, heading, paragraph, or anything else).

## Features

- **Fade Transition**: Only one slide is visible at a time, fading in via CSS animation
- **Navigation Arrows**: Previous/Next buttons, wrapping around at both ends
- **Dot Navigation**: One dot per slide, click/keyboard to jump to it
- **Numbered Badge**: "n / total" badge per slide, generated from the live slide count
- **Autoplay**: Optional, with a configurable interval; resets when the user navigates manually
- **InnerBlocks Slides**: Each slide is a real block — add/remove/reorder in the editor canvas, and put any blocks inside it

## Block Attributes

### `chance/slider`

#### autoplay

- **Type**: boolean
- **Default**: `false`
- **Description**: Automatically advance to the next slide

#### autoplaySpeed

- **Type**: number
- **Default**: `5000`
- **Description**: Milliseconds between automatic slide advances (only used when autoplay is on)

### `chance/slider-item`

No attributes — content is entirely InnerBlocks.

## Usage in PHP

```php
echo do_blocks( '<!-- wp:chance/slider {"autoplay":true,"autoplaySpeed":4000} -->
<!-- wp:chance/slider-item -->...<!-- /wp:chance/slider-item -->
<!-- /wp:chance/slider -->' );
```

## Files

- `block.json` / `slider-item/block.json` — Block configuration and metadata
- `edit.js` / `slider-item/edit.js` — Editor components; mirror save.js's markup, plus a JSX-rendered dot count and numbertext badge (derived from sibling block count via `useSelect`, since a plain `save()` can't read that) for a WYSIWYG preview
- `save.js` / `slider-item/save.js` — Static markup: wrapper, track, arrows, and an empty dots container; slides render as bare `<li>`s holding their InnerBlocks content
- `view.js` — Frontend fade/arrow/dot navigation and autoplay; builds the numbertext badges and dots from the live DOM slide count

## Styling

The block uses SCSS for styling with support for:

- Fade-in animation on the active slide
- No-JS fallback (first slide visible before `view.js` runs)
- Positioned prev/next arrows with hover feedback
- Dot navigation with an active state
