# Site Option Block

A custom WordPress block for displaying values from the WordPress options table (wp_options). Includes support for generic options, staff members, and board members.

## Overview

This is a dynamic block that retrieves and displays values from the WordPress options table. It's useful for displaying site settings like site name, tagline, URL, or any custom options stored in wp_options. It also includes specialized variations for displaying staff and board member information.

## Block Variations

### 1. Generic Option (Default)

Display any value from the WordPress options table with customizable HTML tags.

**Features:**

- Specify any option key
- Choose HTML tag: p, span, a, h1-h6
- Optional link URL for anchor tags
- Typography, color, and spacing support

**Use Cases:**

- Site name, tagline, URL
- Custom plugin settings
- General option display

### 2. Staff Member Variation

Display staff member information from WordPress options with position titles.

**Features:**

- Displays staff member posts with links
- Includes position titles in output
- Handles multiple post IDs or single values
- ACF field integration for pretty option names
- Position title displayed inline with staff name

**Attributes:**

- `memberType`: "staff"
- `optionName`: WordPress option key

**Output Format:**

```
Staff Name, Position Title
Position Meta (Title)
```

### 3. Board Member Variation

Display board member information from WordPress options without position titles.

**Features:**

- Displays board member posts with links
- No position title display in list
- Handles multiple post IDs or single values
- ACF field integration for pretty option names
- Position meta on new line

**Attributes:**

- `memberType`: "board"
- `optionName`: WordPress option key

**Output Format:**

```
Board Member Name
Title/Role Info
```

## Attributes

- `memberType` (string): "" (generic), "staff", or "board" (default: "")
- `optionName` (string): WordPress option key to retrieve from wp_options table
- `tagName` (string): HTML tag for generic options - "p", "span", "a", "h1-h6" (default: "p")
- `href` (string): URL for anchor tags
- `prepend` (string): Optional text to prepend
- `append` (string): Optional text to append
- `className` (string): Custom CSS classes

## REST Endpoints

The block uses these endpoints based on display type:

- Generic: `/chance/v1/site-option/{option_name}`
- Staff: `/chance/v1/staff-member/{option_name}`
- Board: `/chance/v1/board-member/{option_name}`

## Features

- **Configurable Display Type**: Switch between generic option, staff, and board variations
- **wp_options Integration**: Fetches values directly from WordPress options table
- **Typography Support**: Full control over font settings (size, family, weight, style, line-height, letter-spacing, text transform, text decoration)
- **Spacing Support**: Configure margins and padding
- **Color Support**: Set text color and background color
- **Serialized Data Support**: Handles serialized arrays/objects and converts to JSON
- **ACF Integration**: Pretty option names from ACF field labels
- **No Fallback**: Returns nothing if option doesn't exist or is empty
- **Server-Rendered**: Dynamic block with server-side rendering
- **Reusable**: Can be used multiple times with different configurations

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
