# Production Tabs (`chance/production-tabs` + `chance/tab`)

Responsive tabbed content. **Horizontal tabs on desktop, vertical accordion on
mobile** — one active tab/panel at a time in both layouts.

## Blocks

| Block | Role |
| ----- | ---- |
| `chance/production-tabs` | Parent. Holds the tabs; `align`, color, spacing & typography supports. |
| `chance/tab` | Child. One tab = an editable heading (`title` attribute) + free-form InnerBlocks content. |

Editors add a tab per section via the parent's block appender and type the
heading inline; "how many tabs" = how many child blocks.

## How the responsive switch works

Each `chance/tab` saves a flat `.ct-tab__header` `<button>` + `.ct-tab__panel`
pair inside a `.ct-tab` wrapper.

- **Mobile (default):** headers are full-width and stacked; only the active
  panel shows → accordion.
- **Desktop (`min-width: 768px`):** `.ct-tab` becomes `display: contents` so the
  headers/panels join the parent flex row. Headers get `order: 0` (a tab strip);
  the single active panel gets `order: 1; width: 100%` and drops below.

`view.js` toggles `.is-active` on click (adds `.is-ready` to disable the
no-JS "first panel open" fallback). See `style.scss`.

Styling is intentionally minimal — refine later.
