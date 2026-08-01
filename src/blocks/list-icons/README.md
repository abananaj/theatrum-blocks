# Icon List Block

A flexible list block that displays icons alongside list item text. Supports both ordered and unordered lists with extensive customization options.

## Features

- **List Type Options**: Support for both ordered (ol) and unordered (ul) lists
- **Per-Item Icons**: Add icons from the media library to individual list items
- **Customizable Icon Position**: Place icons left, right, top, or bottom relative to text
- **Icon Size Control**: Adjust icon size with flexible units (px, em, rem, %)
- **Icon Spacing**: Control gap between icon and text
- **Icon Color**: Apply custom colors to icons (CSS colors supported)
- **Hover Behavior**: Option to show icons only on hover for cleaner design
- **Item Management**: Add, remove, delete, and reorder list items easily
- **Accessibility**: Alt text support for all icons

## Editor Features

### List Settings Panel

- **List Type**: Choose between unordered and ordered lists
- **Reset to Defaults**: Restore all settings to their default values

### Icon Settings Panel

- **Icon Size**: Set size with flexible units (default: 24px)
- **Icon Position**: Choose position relative to text
- **Icon Spacing**: Set gap between icon and text (default: 8px)
- **Icon Color**: Apply custom CSS color values
- **Hover Only**: Show/hide icons only on hover

### Item Settings

- **Item Text**: Edit the text content of the selected list item
- **Icon Selection**: Choose from media library images
- **Icon Alt Text**: Add descriptive text for accessibility
- **Move Up/Down**: Reorder items in the list
- **Delete Item**: Remove item from the list

## Usage Example

1. Insert the "Icon List" block into your page
2. Click **Add Item** to create a new list item
3. Select the item in the preview and configure in the sidebar:
   - Enter item text
   - Select an icon from the media library
   - Add alt text for accessibility
4. Use global Icon Settings to adjust:
   - Icon position (left/right/top/bottom)
   - Icon size and spacing
   - Icon color
   - Hover-only visibility
5. Choose between ordered or unordered list format

## Frontend Output

The block renders semantic HTML with appropriate aria labels and CSS classes:

```html
<ul class="wp-block-theatrum-list-icons">
	<li class="list-icons-item">
		<img src="..." alt="..." class="list-icons-icon" />
		<span class="list-icons-text">Item text</span>
	</li>
</ul>
```

### CSS Classes

- `.wp-block-theatrum-list-icons` - Main list wrapper
- `.list-icons-item` - Individual list item
- `.list-icons-icon` - Icon image
- `.list-icons-text` - Item text
- `.icon-position-{position}` - Positional modifier (left, right, top, bottom)
- `.icon-hover-only` - Applied when hover-only is enabled
- `.hover-only` - Applied to icons in hover-only mode

## Styling with Theme.json

You can style this block using theme.json color and typography settings. The block supports:

- Text color (applied to list text)
- Background color (applied to list wrapper)
- Font sizes, families, weights
- Margins and padding
- Borders and shadows

## Attributes

| Attribute      | Type    | Default | Description                                  |
| -------------- | ------- | ------- | -------------------------------------------- |
| `listType`     | string  | 'ul'    | List type: 'ul' or 'ol'                      |
| `items`        | array   | []      | Array of list items with id, text, icon data |
| `iconSize`     | string  | '24'    | Icon size value                              |
| `iconSizeUnit` | string  | 'px'    | Icon size unit: px, em, rem, %               |
| `iconPosition` | string  | 'left'  | Icon position: left, right, top, bottom      |
| `iconSpacing`  | string  | '8'     | Spacing between icon and text (px)           |
| `iconColor`    | string  | ''      | CSS color value for icons                    |
| `hoverOnly`    | boolean | false   | Show icons only on hover                     |
