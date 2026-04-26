# Post Cover Block

A dynamic block that extends the WordPress Core Cover block with featured image support from user-selected posts.

## Features

- **Post Selection**: Choose any post from your site to use its featured image as the cover background
- **Full Cover Block Functionality**: Inherits all the features and options of the WordPress core Cover block:
  - Overlay color and opacity control
  - Focal point adjustment for image positioning
  - Configurable minimum height
  - Content alignment options
  - Inner block support (headings, paragraphs, buttons, etc.)
  - Light/Dark theme toggle
  - Background image repeat option

## Attributes

- `postId` (number): The ID of the post whose featured image to display
- `dimRatio` (number): Overlay opacity level (0-100, default 50)
- `overlayColor` (string): Predefined overlay color
- `customOverlayColor` (string): Custom hex color for overlay
- `focalPoint` (object): Background image focal point coordinates {x, y}
- `minHeight` (number|string): Minimum height of the cover
- `minHeightUnit` (string): Unit for minimum height (px, em, etc.)
- `contentPosition` (string): Content alignment position
- `isDark` (boolean): Whether to apply dark text styling
- `isRepeated` (boolean): Whether to repeat the background image

## Usage

1. Add the Post Cover block to your page or post
2. Use the inspector panel to select a post
3. Configure overlay, layout, and focal point settings as needed
4. Add inner content blocks (heading, paragraph, buttons, etc.)
5. Customize colors, spacing, and typography like any other block

## Server-Side Rendering

The block uses server-side rendering (render.php) to:

- Fetch the selected post data
- Retrieve the featured image URL
- Apply all styling and overlay settings
- Support inner block content

## Frontend Display

The block renders with:

- Featured image background from the selected post
- Customizable overlay for text readability
- All CSS classes compatible with WordPress core Cover block styling
- Responsive design that adapts to mobile screens

## Nesting Support

Supports nesting of these core blocks inside:

- Heading blocks
- Paragraph blocks
- Button blocks
- Button group blocks
- Lists
- Columns
- Groups
