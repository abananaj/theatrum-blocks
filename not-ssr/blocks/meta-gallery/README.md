# Meta Gallery Block

Displays a gallery of images from a post meta or ACF gallery field with full styling and features matching WordPress core/gallery block.

## Features

- **Meta/ACF Source**: Read-only display of images from post meta or ACF gallery fields
- **Core Gallery Styling**: Matches WordPress core/gallery appearance with caption overlays and blur effects
- **Full Gallery Features**:
  - Configurable columns (1-8)
  - Image cropping to uniform height
  - Fixed height mode
  - Random order display
  - Aspect ratio control (original, 1:1, 3:2, 4:3, 16:9, 9:16)
  - Navigation button styling (icon, text, both)
  - Link options (none, media files, attachment pages)
  - Image size selection (thumbnail, medium, medium-large, large, full)
  - Captions with gradient overlay and text shadow
  - Block gap/spacing controls
  - Gallery-level captions

## Attributes

- `metaKey` (string): The ACF or post meta field key
- `sizeSlug` (string): Image size to display (default: 'large')
- `columns` (number): Number of columns (1-8)
- `linkTo` (string): Link destination - 'none', 'media', 'attachment'
- `imageCrop` (boolean): Crop images to same height (default: true)
- `fixedHeight` (boolean): Use fixed height for images (default: true)
- `randomOrder` (boolean): Display images in random order (default: false)
- `aspectRatio` (string): Aspect ratio - 'auto', or numeric like '1.5' for 3:2 (default: 'auto')
- `navigationButtonType` (string): 'icon', 'text', or 'both' (default: 'icon')
- `allowResize` (boolean): Allow image resizing (default: false)
- `caption` (rich-text): Gallery-level caption
- `fallbackText` (string): Text to show when no images found

## Data Format

The block accepts images from ACF or post meta in these formats:

### ACF Gallery Field Array

```php
[
  [
    'ID' => 123,
    'url' => 'https://example.com/image.jpg',
    'alt' => 'Image alt text',
    'caption' => 'Image caption',
    'sizes' => [
      'thumbnail' => '...',
      'medium' => '...',
      'large' => '...',
      'full' => '...'
    ]
  ],
  // ... more images
]
```

### Array of Image IDs

```php
[123, 124, 125]
```

### Array of URLs

```php
[
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg'
]
```

## Usage

In the block editor:

1. Add the Meta Gallery block
2. Enter the meta key (e.g., 'production_gallery' for ACF, or custom post meta key)
3. Configure display options in the Inspector panel
4. Preview updates in real-time

## References

- [ACF Gallery Documentation](https://www.advancedcustomfields.com/resources/gallery/)
- [WordPress Core Gallery Block](https://developer.wordpress.org/block-editor/reference-guides/core-blocks/gallery/)
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
