# Frankenstein Block

A reference/teaching block that combines four key WordPress block features:

## Features Demonstrated

1. **Dynamic Rendering** — Server-side PHP rendering via `render.php`
2. **Inner Blocks** — Allows users to add nested content (heading, paragraph, image)
3. **Block Supports** — Color controls (text/background) exposed in the editor
4. **Interactivity** — Client-side JavaScript behavior with toggle and theme switching

## File Structure

- `block.json` — Block metadata combining all four features
- `edit.js` — Editor component with RichText + InnerBlocks
- `render.php` — Server-side rendering with interactivity setup
- `view.js` — Interactivity store and actions
- `index.js` — Block registration entry point
- `editor.scss` — Editor-only styles
- `style.scss` — Frontend styles

## How It Works

**Editor (`edit.js`)**
- Shows a description field (RichText) at the top
- Renders inner blocks template below (heading, paragraph, image)

**Frontend (`render.php`)**
- Displays the description
- Includes toggle button to show/hide inner block content
- Includes theme toggle button for light/dark mode
- Uses WordPress Interactivity API for client-side behavior

**Interactivity (`view.js`)**
- `toggleOpen()` — Shows/hides the inner blocks content
- `toggleTheme()` — Switches between light/dark theme
- `logIsOpen()` — Callback that logs state changes (for debugging)

## Example Use Cases

- Learn how to combine multiple block features in one block
- Use as a template for more complex blocks
- Experiment with the Interactivity API alongside traditional block features
