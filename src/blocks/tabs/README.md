# Tabs (`theatrum/tabs` + `theatrum/tab` + `theatrum/tab-heading` + `theatrum/tab-content`)

Responsive tabbed content. **Horizontal tabs on desktop, vertical accordion on
mobile** — one active tab/panel at a time in both layouts.

## Blocks

| Block | Role |
| ----- | ---- |
| `theatrum/tabs` | Parent. Holds the tabs; `align`, color, spacing & typography supports. |
| `theatrum/tab` | Holds exactly one `theatrum/tab-heading` + one `theatrum/tab-content` (`templateLock: 'all'` — editors can't add/remove/reorder these two). |
| `theatrum/tab-heading` | The clickable label. Locked (`templateLock: 'all'`) to a single `core/heading` (level 3) — can't be removed, added to, or swapped for a paragraph. |
| `theatrum/tab-content` | The panel content. Freeform InnerBlocks, explicitly unlocked (`templateLock: false`) so it doesn't inherit `theatrum/tab`'s lock — behaves like a Group. |

Editors add a tab per section via the parent's block appender; each new tab
comes pre-templated with its heading + content block.

**Nested `templateLock` gotcha:** Gutenberg's `InnerBlocks`/`useInnerBlocksProps`
inherit `templateLock` from the nearest ancestor unless a child explicitly sets
its own. Both `theatrum/tab-heading` and `theatrum/tab-content` set `templateLock`
explicitly (`'all'` and `false` respectively) rather than relying on what
`theatrum/tab` happens to be set to — don't remove those, even if they look
redundant, or the inherited lock silently breaks block-type transforms/
splitting again.

### Tab heading colors

`theatrum/tab-heading` has its own normal/hover/active text + background color
controls in the block Inspector (not the core color supports — those don't
have hover/active states). Colors are written as CSS custom properties on the
block's wrapper (`color-style.js`) and consumed in `style.scss` with a
fallback chain: hover → normal → `inherit`/`transparent`, so leaving hover/
active unset doesn't lose whatever normal color was set.

## How the responsive switch works

Each `theatrum/tab-heading` saves a `.ct-tab__header` element (`div[role="button"]`
— not a real `<button>`, since headings aren't valid inside one) and each
`theatrum/tab-content` saves a `.ct-tab__panel` `<div>`, both direct children of
the `.ct-tab` wrapper.

- **Mobile (default):** headers are full-width and stacked; only the active
  panel shows → accordion.
- **Desktop (`min-width: 768px`):** `.ct-tab` becomes `display: contents` so the
  headers/panels join the parent flex row. Headers get `order: 0` (a tab strip);
  the single active panel gets `order: 1; width: 100%` and drops below.

`view.js` toggles `.is-active` on click or Enter/Space (adds `.is-ready` to
disable the no-JS "first panel open" fallback). See `style.scss`.

## Migrating old content

Pre-refactor `theatrum/tab` blocks stored the heading as a `title` attribute
(RichText) and the panel content directly as freeform InnerBlocks. A
`deprecated.js` entry on `theatrum/tab` migrates that shape automatically —
opening/saving an old post rewrites it into `theatrum/tab-heading` +
`theatrum/tab-content` children.

Styling is intentionally minimal — refine later.
