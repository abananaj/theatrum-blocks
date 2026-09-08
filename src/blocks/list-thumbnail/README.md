# Thumbnail List Block

An interactive block that displays a list of items with corresponding thumbnail images. When users hover over list items, a small flip-card icon travels to sit beside the hovered row and updates with a smooth 3D flip animation. Each item is a nested `theatrum/list-item-thumbnail` block (nested heading/paragraph content, plus a thumbnail image) — modeled after the `list-icons` / `list-item-icon` pattern, with the icon's travel-and-flip behavior ported from the source CodePen.

## Features

- **Nested List Items**: Each item is its own block — native WP reordering, drag-and-drop, and per-item Inspector settings
- **Nested Content**: Each item's content is real `core/heading` + `core/paragraph` InnerBlocks, not fixed text fields — add, remove, or reorder them like any other block content
- **Thumbnail Images**: Each item's thumbnail is selected from the media library
- **Image Resolution Control**: List-wide setting for which registered WP image size (Thumbnail/Medium/Large/Full/custom) is actually served
- **Aspect Ratio & Object Fit**: List-wide controls for the flip-card icon's aspect ratio (auto/1:1/4:3/3:4/16:9/9:16) and how the image fills it (cover/contain/fill)
- **3D Flip Animation**: Two-face flip card (front/back), same mechanism as the source CodePen
- **Travelling Icon**: The icon is absolutely positioned and translates to the hovered row's position instead of staying fixed in one place
- **Customizable Layout**: Choose which edge the icon hugs (left or right)
- **Configurable Sizing**: Control item height, thumbnail width/height with flexible units
- **Animation Speed**: Adjust animation speed (0.2s, 0.3s, 0.5s, or 1s)
- **Hide Description Until Hover**: Optionally collapse each item's paragraph content, revealing it on hover
- **Responsive Design**: Automatically adapts to mobile and tablet sizes
- **Full Block Support**: Supports alignment, spacing, typography, colors, borders, shadows, and more

## Parent Block: `theatrum/list-thumbnail`

List-wide settings, applied as CSS custom properties consumed by the child items and the flip-card icon:

- `thumbnailPosition` (string): Which edge the flip-card icon hugs - "left" or "right" (default: "right")
- `thumbnailWidth` / `thumbnailWidthUnit` (string): Flip-card icon width (default: "48px")
- `thumbnailHeight` / `thumbnailHeightUnit` (string): Flip-card icon height (default: "48px") — ignored when `thumbnailAspectRatio` is not "auto"
- `itemHeight` / `itemHeightUnit` (string): Height of each list item (default: "80px")
- `animationSpeed` (string): Duration of the flip/hover transitions - "0.2", "0.3", "0.5", or "1" (default: "0.3")
- `imageSizeSlug` (string): WP registered image size used to resolve every item's thumbnail URL (default: "full"); passed down to children as block context (`theatrum/imageSizeSlug`)
- `thumbnailAspectRatio` (string): "auto" (use `thumbnailHeight`), "1", "4/3", "3/4", "16/9", or "9/16" — when set, height is derived from width via CSS `aspect-ratio` instead
- `thumbnailObjectFit` (string): "cover", "contain", or "fill" (default: "cover")
- `hideDescriptionUntilHover` (boolean): Collapses each item's paragraph content and reveals it only while that item is hovered (default: false)

## Child Block: `theatrum/list-item-thumbnail`

- Nested content: `core/heading` + `core/paragraph` InnerBlocks (default template), restricted to those two block types
- `thumbnailId` (number): Media library attachment ID
- `thumbnailUrl` (string): Resolved URL of the thumbnail image at the parent's chosen `imageSizeSlug`
- `thumbnailAlt` (string): Alt text for accessibility

The thumbnail image is selected via the Inspector panel while the child block is selected. Because this is a static block, `thumbnailUrl` is re-resolved from the source media (`core.getMedia`) whenever the parent's Resolution setting changes, so existing items pick up the new size automatically — re-save the post for it to take effect on the frontend.

## Editor Features

- **Add Items**: Use the InnerBlocks appender to add new `list-item-thumbnail` blocks
- **Edit Content**: Edit each item's heading/paragraph content directly like any nested block; select the item to manage its thumbnail in the Inspector
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
3. Edit each item's heading/paragraph content; select the item to add a thumbnail image via the Inspector
4. Repeat for additional items
5. Customize the layout, image resolution/aspect ratio, and animation settings in the parent block's Inspector panel

## Responsive Behavior

On mobile and tablet devices (screens under 768px), the layout automatically switches to a single-column display with a static thumbnail positioned below the list items (the travelling behavior is disabled — hover doesn't apply on touch).

## Frontend Interaction

- Hovering (or focusing, via keyboard) a list item translates the icon to sit beside that row and displays its thumbnail
- Smooth 3D flip animation transitions between thumbnails (two-face front/back flip card, same as the source CodePen)
- First item's thumbnail is displayed on page load
- Works seamlessly across modern browsers with CSS 3D transform support
