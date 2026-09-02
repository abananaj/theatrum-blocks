# Popup Block

A dialog/popup block that reveals nested content. It has no button of its own — it's opened by any `core/button` (or buttons) placed anywhere on the page and linked to it via its HTML Anchor.

## Key Features

- Opened by any number of separate buttons, linked via `#anchor`
- Hide/show animation for smooth UX
- Supports nested content inside the dialog
- Optional Dialog Label for screen readers (falls back to the HTML Anchor if blank)
- Alignment options (left, center, right)
- Optional automatic opening after a configurable delay
- Position: centered modal (default), or an offcanvas panel sliding in from the top, right, bottom, or left edge
- Size presets (Small / Medium / Large / Full) — map to a max-width for the center modal, or a fixed width/height for offcanvas panels

## Usage

1. Insert a `theatrum/popup` block and give it an HTML Anchor (Advanced panel).
2. Insert a `core/button` block (styled however you like, e.g. sitting in an ordinary `core/buttons` group next to other CTAs) and set its URL to `#that-anchor`.

Any `core/button` whose URL matches a popup's anchor becomes a trigger — no special class or style is required. For a pre-styled, ready-made look, a **Popup Trigger** style variation is also available (`src/popup-trigger-variation.js`); it's optional visual sugar, not a functional requirement.

The trigger and the popup don't need to be near each other in the layout — any page content can link to a popup this way.
