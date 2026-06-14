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