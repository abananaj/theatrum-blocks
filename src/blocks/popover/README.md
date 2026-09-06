# Popover Block

A composable hover/tap popover made of three blocks:

- **Popover** (`theatrum/popover`) — the outer container. Always holds exactly one Popover Trigger and one Popover Content block.
- **Popover Trigger** (`theatrum/popover-trigger`) — the content that reveals the popover on hover (or tap, on touch devices). Accepts any blocks, like a Group — text, a heading, a button, an image, whatever you want people to hover over.
- **Popover Content** (`theatrum/popover-content`) — the content shown inside the popover. Also accepts any blocks — commonly a Core Image or Video block, but not limited to media.

## Usage

1. Add the "Popover" block.
2. It auto-inserts a Popover Trigger and a Popover Content block.
3. Put whatever content should be hovered/tapped inside the Trigger.
4. Put whatever should appear in the popover inside the Content block.
5. Select the Popover Content block to set its width (px, %, em, or rem) in the sidebar.

If you want the trigger to be a link, add a linked block (e.g. Buttons) as the trigger's content — the Popover block itself no longer has a built-in link field, since the trigger can now be any block, including ones that are already linkable.

## Styling

- `.ct-popover` — outer wrapper, `position: relative`.
- `.ct-popover__trigger` — the hover/tap zone.
- `.ct-popover__content` — the floating panel, absolutely positioned above the trigger, revealed via CSS sibling selector on hover/focus, or the `.is-open` class (added by `view.js` for touch support).
