# Carousel Block

A responsive carousel block for displaying cards in a horizontally scrollable list. `theatrum/carousel` is the wrapper (headline + arrows + scroll track); each card is a `theatrum/carousel-item` child block, editable like a Group — it accepts any inner blocks (image, heading, paragraph, or anything else).

## Features

- **Horizontal Scrolling**: Smooth carousel with drag and touch support
- **Drag to Scroll**: Users can drag the carousel to scroll
- **Navigation Arrows**: Previous/Next buttons to navigate through cards
- **Responsive Design**: Works on desktop and mobile devices
- **Editable Headline**: Customize the carousel title
- **InnerBlocks Cards**: Each card is a real block — add/remove/reorder in the editor canvas, and put any blocks inside it

## Block Attributes

### `theatrum/carousel`

#### headline

- **Type**: string
- **Default**: "Headline"
- **Description**: The title displayed above the carousel

### `theatrum/carousel-item`

No attributes — content is entirely InnerBlocks.

## Usage in PHP

```php
echo do_blocks( '<!-- wp:theatrum/carousel {"headline":"Featured Items"} -->
<!-- wp:theatrum/carousel-item -->...<!-- /wp:theatrum/carousel-item -->
<!-- /wp:theatrum/carousel -->' );
```

## Files

- `block.json` / `carousel-item/block.json` — Block configuration and metadata
- `render.php` — Server-side rendering of the wrapper/header/arrows; embeds the rendered `theatrum/carousel-item` cards inside `<ul class="ct-carousel-content">`
- `edit.js` / `carousel-item/edit.js` — Editor components (edit.js mirrors render.php's markup for a WYSIWYG preview)
- `save.js` — Returns bare `<InnerBlocks.Content />` for render.php to embed
- `view.js` — Frontend drag-to-scroll + arrow navigation

## Styling

The block uses SCSS for styling with support for:

- Hover effects on images
- Smooth scrolling
- Drag cursor feedback
- Responsive arrow button display
- Dark background cards
