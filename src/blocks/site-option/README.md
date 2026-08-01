# Site Option Block

A custom WordPress block for displaying values from the WordPress options table (wp_options). Includes support for generic options, staff members, and board members.

## Overview

This is a dynamic block that retrieves and displays values from the WordPress options table. It's useful for displaying site settings like site name, tagline, URL, or any custom options stored in wp_options. It also includes specialized variations for displaying staff and board member information.

## Block Variations

### 1. Generic Option (Default)

Display any value from the WordPress options table with customizable HTML tags.

**Features:**

- Specify any option key
- Renders as a single `<p>` with the value as `<span>`, or as `<a>` if a Link URL is set
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

- `memberType` (string): "" (generic), "staff", or "board" (default: "") — set via the Staff Member/Board Member block variations, not an editable field
- `optionName` (string): WordPress option key to retrieve from wp_options table
- `href` (string): Optional URL. When set (and the option isn't a post/term reference), the value renders as `<a>` instead of `<span>`
- `prepend` (string): Optional text to prepend
- `prependTag` (string): Inline style tag wrapping the prepend text - "" (none), "em", "strong", or "small" (default: "")
- `append` (string): Optional text to append
- `appendTag` (string): Inline style tag wrapping the append text - "" (none), "em", "strong", or "small" (default: "")
- `metaKey` (string): Post meta key. When the option value resolves to a post ID, this meta field is displayed in addition to the post title (never in place of it)
- `linkPostTitle` (boolean): Whether the resolved post title links to the post (default: true). Only affects the post title — the meta value is always plain text
- `className` (string): Custom CSS classes

## REST Endpoints

The block uses these endpoints based on display type:

- Generic: `/theatrum/v1/site-option/{option_name}`
- Staff: `/theatrum/v1/staff-member/{option_name}`
- Board: `/theatrum/v1/board-member/{option_name}`

## Features

- **Variation-Based Display Type**: Insert the "Staff Member" or "Board Member" variation from the block inserter to switch display type (no in-editor toggle)
- **Single-Paragraph Output**: Renders as one `<p>` per value/reference, with the value as `<span>` or `<a>` and the meta value (if any) as a trailing `<span>` — no HTML tag chooser
- **Styled Prepend/Append**: Wrap prepend/append text in `<em>`, `<strong>`, or `<small>` independently of the main value
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
<div class="wp-block-theatrum-site-option">
	<p><span>https://chancetheater.dev</span></p>
</div>
```

## Block Attributes

- `optionName` (string) - The name of the WordPress option to retrieve
- `href` (string, default: '') - Optional URL; renders the value as `<a>` instead of `<span>` when set
- `className` (string) - Auto-generated classes for typography, spacing, and color

## Block Settings (Inspector Controls)

### Basic Settings

- **Option Name** - Enter the WordPress option key to retrieve
- **Link URL** - Optional; if set, the value renders as `<a>` instead of `<span>` (only applies when the option isn't a post/term reference)

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
