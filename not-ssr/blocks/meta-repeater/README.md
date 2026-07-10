Simple version first:

# Meta Repeater Block

Displays ACF repeater field rows with configurable subfields (A & B) and individual HTML tag selection for each.

## Key Features

- Displays ACF repeater fields with flexible subfield configuration
- Separate inputs for Subfield A and Subfield B in the sidebar
- Individual HTML tag selection for each subfield
- Wrapper tag selection (ul, ol, or div)
- Automatic list item wrapping for each repeater row
- CSS classes for subfield styling (`.repeater-subfield-a`, `.repeater-subfield-b`)
- Works with any post type that has the specified ACF repeater field
- Graceful handling when subfields are empty

## Sidebar Controls

### Repeater Settings

- **Repeater Field Key**: The ACF repeater field name/key to display
- **Wrapper Tag**: HTML tag for the outer wrapper (ul, ol, div)

### Subfield A

- **Subfield A Key**: The ACF subfield key for the first field
- **HTML Tag for Subfield A**: HTML tag to wrap Subfield A values (span, div, p, em, strong, h1-h6)

### Subfield B

- **Subfield B Key**: The ACF subfield key for the second field
- **HTML Tag for Subfield B**: HTML tag to wrap Subfield B values (span, div, p, em, strong, h1-h6)

## Frontend Output

Each repeater row outputs as:

```html
<ul class="wp-block-chance-meta-repeater">
	<li>
		<span class="repeater-subfield-a">Subfield A Value</span>
		<span class="repeater-subfield-b">Subfield B Value</span>
	</li>
</ul>
```

Tags depend on your sidebar selections. Empty subfields are skipped.

## Usage Example

For an "Awards" repeater with "award_name" and "award_year" subfields:

1. Enter repeater key: `awards`
2. Subfield A: `award_name`, Tag: `strong`
3. Subfield B: `award_year`, Tag: `em`

This creates:

```html
<ul>
	<li>
		<strong>Best Production</strong>
		<em>2025</em>
	</li>
</ul>
```

## Known Issues

- **Producers Repeater variation is deprecated.** It points to `repeaterKey: "producers"`, but no ACF field by that name exists anywhere in the codebase, so it always renders nothing. Left in place (title marked "Deprecated") pending a decision on the correct field to wire it up to.
- **Events Repeater variation cannot work as-is.** It points to `repeaterKey: "events"`, but that ACF field is a `post_object` (relationship) field, not a repeater — `get_field()` returns an array of `WP_Post` objects rather than row-arrays, so every row fails the `is_array($row)` check in `render.php` and nothing displays. The meta-repeater block architecture doesn't support relationship fields; this would need a different block or field type.
