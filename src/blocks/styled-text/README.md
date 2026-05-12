# Styled Text Block

A flexible text block that combines the simplicity of heading and paragraph blocks with powerful styling capabilities for individual text spans.

## Features

- **Selectable HTML Tags**: Render text as `h1` through `h6` or `p` tags
- **Rich Text Content**: Full support for WordPress rich text editing
- **Individually Styled Spans**: Select any text to create a styled span with custom typography and colors
- **Typography Options**: Font size, family, weight, style, letter spacing, line height, text decoration, and text transform
- **Color Options**: Text color and background color for each span
- **Full Block Support**: All standard WordPress block supports including alignment, spacing, borders, shadows, and filters

## Block Name

`chance/styled-text`

## Usage

### Basic Setup

1. Add the block to your page/post
2. Select the desired HTML tag (Heading 1-6 or Paragraph) from the Inspector panel
3. Enter your text content in the RichText editor

### Creating Styled Spans

1. Highlight any text in your content
2. Click the "Styled Span" button in the toolbar (or use `Ctrl+Shift+S`)
3. The selected text is now tracked as a styled span
4. In the Inspector panel, select the span from the list to customize its styling

### Styling Options

Each styled span supports:

- **Font Size** (e.g., `18px`, `1.2em`)
- **Font Family** (e.g., `Georgia, serif`)
- **Font Weight** (300, 400, 600, 700, 800)
- **Font Style** (Normal, Italic, Oblique)
- **Letter Spacing** (e.g., `0.05em`)
- **Line Height** (e.g., `1.5`, `24px`)
- **Text Decoration** (None, Underline, Overline, Line-through)
- **Text Transform** (None, Uppercase, Lowercase, Capitalize)
- **Text Color**
- **Background Color**

## Attributes

| Attribute     | Type   | Default | Description                            |
| ------------- | ------ | ------- | -------------------------------------- |
| `content`     | string | `''`    | HTML content with rich text formatting |
| `tagName`     | string | `'p'`   | HTML tag to render (h1-h6, p)          |
| `styledSpans` | array  | `[]`    | Array of styled span objects           |

### Styled Span Object Structure

```json
{
	"id": "unique-uuid",
	"text": "Selected text content",
	"fontSize": "18px",
	"fontFamily": "Georgia, serif",
	"fontWeight": "700",
	"fontStyle": "italic",
	"letterSpacing": "0.05em",
	"lineHeight": "1.5",
	"textDecoration": "underline",
	"textTransform": "uppercase",
	"color": "#FF0000",
	"backgroundColor": "#FFFF00"
}
```

All typography and color properties are optional.

## Supports

This block includes support for:

- Alignment
- Custom CSS classes
- Anchor links
- Full typography controls (via block supports)
- Full color controls (via block supports)
- Spacing (margins, padding)
- Borders (color, radius, style, width)
- Shadows
- Opacity
- Filters (duotone)
- Interactivity

## Server-Side Rendering

The block uses server-side rendering to apply individual styles to spans. Each styled span generates a scoped CSS rule that applies its custom properties.

The rendered output is a single element of the selected tag type with all styling applied server-side.

## Example Output

```html
<style scoped>
	.styled-span-abc123 {
		color: #ff0000;
		font-weight: 700;
	}
	.styled-span-def456 {
		font-size: 18px;
		background-color: #ffff00;
	}
</style>

<h2 class="wp-block-chance-styled-text">
	This is <span class="styled-span-abc123">important</span> text with
	<span class="styled-span-def456">highlights</span>.
</h2>
```

## Development

### Files Structure

- `block.json` - Block configuration and attributes
- `index.js` - Editor UI component
- `editor.scss` - Editor-only styles
- `style.scss` - Frontend styles
- `render.php` - Server-side rendering logic
- `README.md` - This file

### Building

The block is built as part of the theatrum-blocks plugin build process using wp-scripts.

```bash
npm run build
```

### Notes

- The block stores styled spans as an array of objects with unique IDs
- Styling is applied via scoped CSS generated server-side
- The RichText content remains editable in the block editor
- Styled span information is preserved in the block attributes
