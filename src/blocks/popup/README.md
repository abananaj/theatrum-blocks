# Popup Block

A dialog/popup block that reveals nested content. It has no button of its own — it's opened by one or more **Popup Trigger** buttons (a `core/button` variation, `src/popup-trigger-variation.js`) placed anywhere on the page and linked to it via its HTML Anchor.

## Key Features

- Opened by any number of separate Popup Trigger buttons, linked via `#anchor`
- Hide/show animation for smooth UX
- Supports nested content inside the dialog
- Optional Dialog Label for screen readers (falls back to the HTML Anchor if blank)
- Alignment options (left, center, right)

## Usage

1. Insert a `chance/popup` block and give it an HTML Anchor (Advanced panel).
2. Insert a `core/button` block, choose the **Popup Trigger** style variation, and set its URL to `#that-anchor`.

The trigger and the popup don't need to be near each other in the layout — any page content can link to a popup this way.
