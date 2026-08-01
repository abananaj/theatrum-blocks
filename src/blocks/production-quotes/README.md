# Production Quotes Block

A custom WordPress block for displaying quotes from an ACF repeater field on theater productions.

## Overview

This is a dynamic block that retrieves and displays all quotes from the `quotes` ACF repeater field on the current post. Each quote row contains quote text, citation, and optional link.

## Block Structure

```
ProductionQuotes/
├── block.json      # Block metadata and configuration
├── index.js        # Editor interface
├── index.css       # Editor and frontend styles
├── render.php      # Server-side render callback
└── README.md       # Documentation
```

## Features

- **ACF Repeater Integration**: Pulls from `production_quotes` repeater field
- **Multiple Quotes**: Displays all quote rows present on the post
- **Quote & Source Fields**: Supports quote text and source/citation
- **Quote-Box Styling**: Styled with left border and padding matching quote-box pattern
- **Server-Rendered**: Dynamic block with server-side rendering
- **Flexible Markup**: Quotes rendered with proper semantic HTML

## ACF Field Setup

The block expects an ACF repeater field with the following configuration:

**Repeater Field Name:** `quotes`

**Sub-fields:**

- `quote-text` (Text Area) - The quote text
- `quote-cite` (Text) - The source/citation for the quote
- `quote-link` (Relationship) - Optional post ID link (the source text will link to this post's permalink)

## Installation

1. Ensure the block files are in the theme's `blocks/ProductionQuotes/` directory
2. The block is automatically registered via `blocks/functions.php`
3. Include blocks registration in your theme's functions.php:

```php
require_once get_template_directory() . '/blocks/functions.php';
```

## Usage

Add the "Production Quotes" block to any post template. The block will automatically:

1. Fetch all rows from the `production_quotes` repeater field
2. Display each quote with its source citation
3. Style them with the quote-box pattern styling

### Example Output

```html
<div class="wp-block-theatrum-production-quotes">
	<div class="wp-block-theatrum-production-quotes-item">
		<blockquote class="wp-block-quote">
			<p>It was only in the theatre that I lived.</p>
			<p>
				<em><a href="https://example.com">Oscar Wilde</a></em>
			</p>
		</blockquote>
	</div>
	<!-- More quote items... -->
</div>
```

## Notes

- Returns nothing if no `quotes` repeater field is found or if it's empty
- Skips empty quote entries (entries without quote-text)
- Quote text is processed with `wp_kses_post()` for security
- Citation text is escaped with `esc_html()`
- The `quote-link` Relationship field stores a post ID which is converted to a URL using `get_permalink()`
- Links are only applied if a valid post ID is set and the post exists
- Uses theme's main color preset for the left border if available
