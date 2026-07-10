This block will be a more complex variation of the core/table block that allows for more styling options and nested blocks within cells. It will be used for the annual fund giving levels table on the donate page, but could also be used for other tables across the site.

# Child Blocks

## table-caption [<caption>](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/caption) **must be 1st child of <table>**
Automatically include as first nested block when table-advanced block is added.
### innerBlocks:
- core/heading

## table-header [<thead>](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/thead)
Automatically insert above table-body block unless user sets thead option to false in the block inspector. Defaults to true.
### innerBlocks:
- theatrum/table-row <tr>

## table-body [<tbody>](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tbody)
Automatically include as first nested block when table-advanced block is added.
### innerBlocks:
- theatrum/table-row <tr>

## table-footer [<tfoot>](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tfoot)
Insert below table-body block if user sets parent table block attribute "tableFooter" option to true in the block inspector. Defaults to false.
### innerBlocks:
- theatrum/table-row <tr>

## table-row [<tr>](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tr)
### innerBlocks:
- theatrum/table-heading-cell <th>
- theatrum/table-cell <td>

## table-heading-cell [<th>](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th)
### innerBlocks:
- core/heading
- core/paragraph
- core/icon

## table-cell [<td>](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/td)
### innerBlocks:
- core/paragraph
- core/image
- core/button
- core/list
- core/heading
- core/group
- core/details
- core/icon
- theatrum/media-popover
- theatrum/meta-field

## Table Styling Options

I would like an option to easily transform td blocks into th blocks and vice versa, which would allow users to create header rows or columns as needed. This could be implemented as a toggle in the block toolbar when a cell is selected, or as a dropdown in the block inspector with options like "Cell Type: Data Cell / Header Cell". When toggled, the block's name would switch between `theatrum/table-cell` and `theatrum/table-heading-cell`, and the appropriate HTML element (`<td>` or `<th>`) would be rendered on the frontend.
## Known Editor Rendering Issues

The editor view uses `<div>` elements styled to look like a table (via `editor.scss`) rather than actual table elements. This avoids browser HTML parsing rules that would eject Gutenberg's UI chrome (`<div>` wrappers) out of a real `<table>`. The frontend `save()` output is correct semantic HTML.

### Potential issues to watch for after testing:

- **Cell widths** — `flex: 1` gives equal-width columns. If content varies greatly between cells, columns may feel uneven. Fix: add explicit `min-width` or `width` styles per cell via the block's dimension controls or custom CSS.
- **Block appender (+ button) in rows** — The "Add block" button that appears at the end of a row's inner blocks is styled as `flex: 0 0 auto` to prevent it from taking up a full column slot, but it may still look visually out of place. Refine `.block-list-appender` targeting in `editor.scss` if needed.
- **Block toolbar overlap** — Gutenberg's floating block toolbar can occasionally shift the row layout when a cell is selected. This is cosmetic only and does not affect the saved output.
- **Colspan/rowspan not reflected in editor** — The `colspan` and `rowspan` attributes on `table-cell` and `table-heading-cell` are serialized correctly to `<td colSpan>` / `<th rowSpan>` in the frontend HTML, but the editor div layout does not reflow to visually represent spanning cells. This is a known limitation of the div-based editor approach.

---

## colgroup [<colgroup>](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/colgroup) **must be 2nd child of <table> if used** ** IMPLEMENT LATER **
### attributes:
- width (number or percentage)
- align (left, center, right)
- color (color value)
- backgroundColor (color value)
### innerBlocks:
- theatrum/col

## col [<col>](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/col) ** IMPLEMENT LATER **
### attributes:
- width (number or percentage)
- align (left, center, right)
- color (color value)
- backgroundColor (color value)
### innerBlocks: 
none