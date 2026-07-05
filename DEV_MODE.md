# Dev Mode Display

The theatrum-blocks plugin includes a dev mode feature that displays block names and class names during development, making it easier to identify which block is being rendered and its applied styles.

## How It Works

- All blocks in this plugin's `chance/*` and `theatrum/*` namespaces automatically have a `devMode` boolean attribute (default: `false`), added via the `block_type_metadata` filter in `theatrum-blocks.php`
- The attribute alone doesn't add any UI — only blocks that opt in with the steps below (currently just `breadcrumbs`) show the toggle and indicator
- When enabled in the block inspector, a small indicator appears in the top-left corner showing:
  - **Block name** (e.g., `theatrum/breadcrumbs`)
  - **First class name** from the element's class list

## Adding Dev Mode to a Block

### 1. Import the utilities

In your block's `edit.js`:

```javascript
import { DevModeToggle, useDevMode } from '../../inc/display-block-name';
```

### 2. Extract the `devMode` attribute

```javascript
export default function YourBlockEdit( {
	attributes,
	setAttributes,
	name,
	// ... other props
} ) {
	const { devMode } = attributes;
	// ... rest of your component
}
```

### 3. Set up the hook

After creating your `blockProps` with `useBlockProps()`:

```javascript
const blockProps = useBlockProps();

// Apply dev mode
useDevMode( {
	element: blockProps.ref?.current,
	isDevMode: devMode,
	blockName: name,
} );
```

### 4. Add the toggle control

In your inspector controls (typically in the "advanced" section):

```javascript
<InspectorControls group="advanced">
	{/* ...existing controls... */}
	<DevModeToggle
		isDevMode={ devMode }
		onChange={ ( value ) =>
			setAttributes( { devMode: value } )
		}
	/>
</InspectorControls>
```

## Example

See `src/blocks/breadcrumbs/edit.js` for a complete working example.

## Styling Notes

- The dev mode indicator has `position: absolute` and is positioned at the top-left corner
- The indicator has `z-index: 9999` to appear above other content
- Parent elements automatically get `position: relative` if needed
- The indicator has a dark semi-transparent background with white text for visibility

## Removing Dev Mode

If you don't want to add dev mode to a specific block, simply skip steps 1-4. The attribute will still be available on the block (and always `false` by default), but the UI won't provide a toggle for it.
