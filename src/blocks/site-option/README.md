# Site Option Block

A custom WordPress block for displaying values from the WordPress options table (wp_options).

## Overview

This is a dynamic block that retrieves and displays values from the WordPress options table. It's useful for displaying site settings like site name, tagline, URL, or any custom options stored in wp_options.

## Block Structure

```
SiteOption/
├── block.json      # Block metadata and configuration
├── index.js        # Editor interface with option name control
├── index.css       # Editor and frontend styles
├── render.php      # Server-side render callback
└── README.md       # Documentation
```

## Features

- **Configurable Option Name**: Specify which option to retrieve via Inspector Controls
- **wp_options Integration**: Fetches values directly from WordPress options table
- **Typography Support**: Full control over font settings (size, family, weight, style, line-height, letter-spacing, text transform, text decoration)
- **Spacing Support**: Configure margins and padding
- **Color Support**: Set text color and background color
- **Serialized Data Support**: Handles serialized arrays/objects and converts to JSON
- **No Fallback**: Returns nothing if option doesn't exist or is empty
- **Server-Rendered**: Dynamic block with server-side rendering
- **Reusable**: Can be used multiple times with different option names

## Installation

1. Ensure the block files are in the theme's `blocks/SiteOption/` directory
2. The block is automatically registered via `blocks/functions.php`
3. Include blocks registration in your theme's functions.php:

```php
require_once get_template_directory() . '/blocks/functions.php';
```

## Usage

In Gutenberg editor, add the "Site Option" block to any post/page template:

1. Add the "Site Option" block
2. In the Inspector Controls (sidebar), enter the option name
3. The block will display the value from wp_options table

### Common Option Names

- `siteurl` - Site URL
- `home` - Home URL
- `blogname` - Site name/title
- `blogdescription` - Site tagline
- `admin_email` - Admin email
- `users_can_register` - User registration enabled

### Example Output

```html
<p class="wp-block-chance-site-option">https://chancetheater.dev</p>
```

## Block Attributes

- `optionName` (string) - The name of the WordPress option to retrieve
- `tagName` (string, default: 'p') - HTML tag to wrap content (p, span, h1-h6, a)
- `href` (string, default: '') - URL for link tag
- `className` (string) - Auto-generated classes for typography, spacing, and color

## Block Settings (Inspector Controls)

### Basic Settings

- **Option Name** - Enter the WordPress option key to retrieve
- **HTML Tag** - Choose the semantic HTML element (<p>, <span>, <h1>-<h6>, <a>)
- **Link URL** - If using <a> tag, specify the URL

### Typography Settings

- Font Size
- Font Family
- Font Weight
- Font Style
- Line Height
- Letter Spacing
- Text Decoration
- Text Transform

### Spacing Settings

- **Margin** - Top, Right, Bottom, Left
- **Padding** - Top, Right, Bottom, Left

### Color Settings

- **Text Color** - Set the text/font color
- **Background Color** - Set the background color

## Notes

- Returns nothing if the option doesn't exist in wp_options
- Returns nothing if the option value is empty
- Serialized data (arrays/objects) are converted to JSON strings
- Option values are escaped with `esc_html()` for security
- Empty strings and false values both return nothing
