# Media Popover Block

A WordPress block that displays media (images or videos) in a tooltip-style popover overlay that appears on hover. Perfect for adding interactive media experiences throughout your site.

## Features

- **Media Selection**: Choose images or videos from your media library
- **Hover Display**: Media appears in a popover tooltip on hover
- **Link Support**: Optionally link the trigger text to a URL or internal page
- **Responsive**: Adapts to different screen sizes
- **Mobile Friendly**: Touch support for mobile devices (tap to toggle popover)
- **Customizable**: Set trigger text, popover width, and alignment
- **Accessibility**: Proper alt text support and semantic HTML

## Usage

1. Add the block to your post or page
2. Select a media file (image or video) from your media library
3. Optionally customize:
   - **Trigger Text**: The text that users hover over (default: "Hover to view")
   - **Link Type**: Choose to link to an external URL, internal page, or none
   - **Width**: Set the popover width in px, %, em, or rem
   - **Alignment**: Align the block left, center, or right

## Attributes

- `mediaId` (number): The ID of the selected media file
- `mediaUrl` (string): The URL of the selected media
- `mediaAlt` (string): Alt text for accessibility
- `mediaType` (string): Either "image" or "video"
- `triggerText` (string): Text displayed as the hover trigger
- `linkType` (string): "none", "url", or "page"
- `linkUrl` (string): External URL for the link
- `linkPageId` (number): WordPress page ID for internal links
- `linkTarget` (boolean): Open link in new tab
- `width` (string): Popover width value
- `widthUnit` (string): Unit for width (px, %, em, rem)
- `alignment` (string): Block alignment (left, center, right)

## Styling

The block uses scoped CSS with a unique ID to avoid conflicts. The popover styles include:

- Smooth fade-in/fade-out transitions
- Positioned above the trigger text
- Arrow pointer beneath the popover
- Box shadow for depth
- Rounded corners and modern styling

## Examples

### Simple Image Popover

```
Trigger: "View Details"
Media: A product image
Link: None
```

### Product Link with Preview

```
Trigger: "See Preview"
Media: Product image or video
Link: Product page (opens in same tab)
```

### Gallery Preview

```
Trigger: "Gallery"
Media: Gallery image
Link: Full gallery page (opens in new tab)
```

Also, add ability to select media by meta key, so that the popover can be dynamically linked to media associated with the current post or other context.
