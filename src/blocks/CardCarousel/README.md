# Card Carousel Block

A responsive carousel block for displaying cards with images, titles, and subtitles in a horizontally scrollable list.

## Features

- **Horizontal Scrolling**: Smooth carousel with keyboard navigation and touch support
- **Drag to Scroll**: Users can drag the carousel to scroll
- **Navigation Arrows**: Previous/Next buttons to navigate through cards
- **Responsive Design**: Works on desktop and mobile devices
- **Editable Headline**: Customize the carousel title
- **Configurable Items**: Add/edit carousel items with image, title, subtitle, and link

## Block Attributes

### headline

- **Type**: string
- **Default**: "Headline"
- **Description**: The title displayed above the carousel

### items

- **Type**: array
- **Default**: Array with one sample item
- **Description**: Array of carousel items, each with:
    - `id`: Unique identifier
    - `image`: Image URL
    - `title`: Card title
    - `subtitle`: Card subtitle
    - `link`: Card link URL

## Usage in PHP

```php
echo do_blocks('<!-- wp:chance/card-carousel {"headline":"Featured Items","items":[...]} /-->');
```

## Files

- `block.json` - Block configuration and metadata
- `render.php` - Server-side rendering of the carousel
- `index.js` - Frontend carousel functionality
- `index.css` - Carousel styles

## Styling

The block uses SCSS for styling with support for:

- Hover effects on images
- Smooth scrolling
- Drag cursor feedback
- Responsive arrow button display
- Dark background cards with rounded corners
