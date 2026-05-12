# Thumbnail List Block

An interactive block that displays a list of items with corresponding thumbnail images. When users hover over list items, the thumbnail display updates with smooth 3D flip animations.

## Features

- **Interactive List Display**: Each item shows a title and description
- **Thumbnail Images**: Each list item can have an associated thumbnail image from the media library
- **3D Flip Animation**: Smooth animated transitions between thumbnails with 3D flip effect
- **Customizable Layout**: Choose thumbnail position (left or right)
- **Configurable Sizing**: Control item height, thumbnail width/height with flexible units
- **Animation Speed**: Adjust animation speed (0.2s, 0.3s, 0.5s, or 1s)
- **Responsive Design**: Automatically adapts to mobile and tablet sizes
- **Full Block Support**: Supports alignment, spacing, typography, colors, borders, shadows, and more

## Block Attributes

- `items` (array): List of items with title, description, and thumbnail image data
- `thumbnailPosition` (string): Position of thumbnails - "left" or "right" (default: "right")
- `thumbnailWidth` (string): Width value for thumbnail display (default: "400")
- `thumbnailWidthUnit` (string): Unit for thumbnail width - "px", "%", "em", or "rem" (default: "px")
- `thumbnailHeight` (string): Height value for thumbnail display (default: "300")
- `thumbnailHeightUnit` (string): Unit for thumbnail height - "px", "em", or "rem" (default: "px")
- `itemHeight` (string): Height of each list item (default: "80")
- `itemHeightUnit` (string): Unit for item height - "px", "em", or "rem" (default: "px")
- `animationSpeed` (string): Duration of animations - "0.2", "0.3", "0.5", or "1" (default: "0.3")

## Item Structure

Each item in the `items` array contains:

- `id` (string): Unique identifier for the item
- `title` (string): Display title of the item
- `description` (string): Description text for the item
- `thumbnailId` (number): Media library attachment ID
- `thumbnailUrl` (string): URL of the thumbnail image
- `thumbnailAlt` (string): Alt text for accessibility

## Editor Features

- **Add Items**: Click "+ Add Item" button to create new list items
- **Edit Items**: Click on any item in the preview to select and edit it
- **Upload Thumbnails**: Select images from the media library for each item
- **Reorder Items**: Use the Move Up/Move Down buttons to reorder items
- **Delete Items**: Remove individual items with the Delete button

## Styling

The block supports all standard WordPress block styling options:

- Text and background colors with gradient support
- Typography (font size, family, weight, style, etc.)
- Spacing (margin, padding, block gap)
- Borders (color, radius, style, width)
- Shadow and opacity effects

## Usage Example

1. Add a new Thumbnail List block to your page
2. Click "+ Add Item" to create your first list item
3. Enter a title and description
4. Click on the item and select an image for the thumbnail
5. Repeat for additional items
6. Customize the layout and animation settings in the Inspector panel

## Responsive Behavior

On mobile and tablet devices (screens under 768px), the layout automatically switches to a single-column display with the thumbnail positioned below the list items.

## Frontend Interaction

- Hovering over list items displays the associated thumbnail
- Smooth 3D flip animation transitions between thumbnails
- First item's thumbnail is displayed on page load
- Works seamlessly across modern browsers with CSS 3D transform support
