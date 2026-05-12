# SVG Icon Block

## Overview

A specialized block for displaying SVG files from the media library with full styling and layout control. This block behaves like the core image block but only accepts SVG files.

## Features

- **SVG-Only Media Library**: Only SVG files can be selected, preventing accidental use of raster images
- **Custom Width Control**: Set SVG width in pixels (px), percentages (%), em, or rem units
- **Alignment Options**: Support for left, center, right, wide, and full alignment
- **Custom CSS**: Apply inline CSS per block instance to customize fill, stroke, opacity, and other SVG properties
- **Alt Text**: Accessibility support with alt text for screen readers
- **Responsive**: SVG automatically scales with responsive design

## Attributes

- `svgId` (number): WordPress attachment ID of the selected SVG
- `svgUrl` (string): URL to the SVG file
- `svgAlt` (string): Alt text for the SVG
- `width` (string): Width value (default: "100")
- `widthUnit` (string): Unit for width (px, %, em, rem; default: "px")
- `alignment` (string): Block alignment (left, center, right, wide, full; default: "center")
- `customCSS` (string): Inline CSS rules to apply to the SVG

## Block Controls (Inspector Panel)

- **Select SVG**: Button to choose or replace the SVG file
- **Remove SVG**: Button to clear the selected SVG
- **Alt Text**: Input field for accessibility description
- **Width & Unit**: Controls for sizing the SVG with flexible units
- **Custom CSS**: Textarea for adding inline CSS rules

## Usage Example

### Basic Usage

1. Add the SVG Icon block to your page
2. Click "Select SVG" and choose an SVG file from the media library
3. Set the width and alignment as needed

### Styling SVG Elements

Use the Custom CSS field to style SVG properties:

```css
fill: #333;
stroke: #000;
opacity: 0.8;
```

## Supports

- HTML: False (managed by block save)
- Alignment: left, center, right, wide, full
- Anchor: Yes
- Custom className: Yes
- Spacing: margin and padding

## Technical Details

- **Type**: Static block (saves to database using save.js)
- **Rendering**: Client-side via save.js with scoped CSS
- **Files**: edit.js, save.js, style.scss, editor.scss, view.js, index.js
- **Category**: Media
