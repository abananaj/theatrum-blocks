# Thumbnail List Block

An interactive block that displays a list of items with corresponding thumbnail images. When users hover over list items, a flip-card panel updates with a smooth 3D flip animation. Each item is a nested `chance/list-item-thumbnail` block (title, description, thumbnail image) — modeled after the `list-icons` / `list-item-icon` pattern.

## Features

- **Nested List Items**: Each item is its own block — native WP reordering, drag-and-drop, and per-item Inspector settings
- **Thumbnail Images**: Each item's thumbnail is selected from the media library
- **3D Flip Animation**: Two-face flip card (front/back), same mechanism as the source CodePen
- **Customizable Layout**: Choose thumbnail position (left or right)
- **Configurable Sizing**: Control item height, thumbnail width/height with flexible units
- **Animation Speed**: Adjust animation speed (0.2s, 0.3s, 0.5s, or 1s)
- **Responsive Design**: Automatically adapts to mobile and tablet sizes
- **Full Block Support**: Supports alignment, spacing, typography, colors, borders, shadows, and more

## Parent Block: `chance/list-thumbnail`

List-wide settings, applied as CSS custom properties consumed by the child items and the flip-card panel:

- `thumbnailPosition` (string): Position of the flip-card panel - "left" or "right" (default: "right")
- `thumbnailWidth` / `thumbnailWidthUnit` (string): Flip-card panel width (default: "400px")
- `thumbnailHeight` / `thumbnailHeightUnit` (string): Flip-card panel height (default: "300px")
- `itemHeight` / `itemHeightUnit` (string): Height of each list item (default: "80px")
- `animationSpeed` (string): Duration of the flip/hover transitions - "0.2", "0.3", "0.5", or "1" (default: "0.3")

## Child Block: `chance/list-item-thumbnail`

- `title` (string, RichText): Item title, edited inline
- `description` (string, RichText): Optional item description, edited inline
- `thumbnailId` (number): Media library attachment ID
- `thumbnailUrl` (string): URL of the thumbnail image
- `thumbnailAlt` (string): Alt text for accessibility

The thumbnail image is selected via the Inspector panel while the child block is selected.

## Editor Features

- **Add Items**: Use the InnerBlocks appender to add new `list-item-thumbnail` blocks
- **Edit Items**: Click into any item's title/description to edit inline; select the item to manage its thumbnail in the Inspector
- **Reorder Items**: Native drag-and-drop / block-mover controls
- **Delete Items**: Remove a child block like any other block

## Styling

The block supports all standard WordPress block styling options:

- Text and background colors with gradient support
- Typography (font size, family, weight, style, etc.)
- Spacing (margin, padding, block gap)
- Borders (color, radius, style, width)
- Shadow and opacity effects

## Usage Example

1. Add a new Thumbnail List block to your page
2. Use the appender to add list items (two are added by default)
3. Click into an item to edit its title/description; select it to add a thumbnail image via the Inspector
4. Repeat for additional items
5. Customize the layout and animation settings in the parent block's Inspector panel

## Responsive Behavior

On mobile and tablet devices (screens under 768px), the layout automatically switches to a single-column display with the thumbnail positioned below the list items.

## Frontend Interaction

- Hovering over list items displays the associated thumbnail
- Smooth 3D flip animation transitions between thumbnails (two-face front/back flip card, same as the source CodePen)
- First item's thumbnail is displayed on page load
- Works seamlessly across modern browsers with CSS 3D transform support
