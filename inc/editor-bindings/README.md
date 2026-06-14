# Editor Bindings

This example is taken from the following WordPress Developer Blog post:

-   [Getting and setting Block Binding values in the Editor](https://developer.wordpress.org/news/2024/10/getting-and-setting-block-binding-values-in-the-editor/)

<!-- Please, do not remove these @TABLE EXAMPLES BEGIN and @TABLE EXAMPLES END comments or modify the table inside. This table is automatically generated from the data at _data/examples.json and _data/tags.json -->
<!-- @TABLE EXAMPLES BEGIN -->

| Example                                                                                                       | <span style="display: inline-block; width:250px">Description</span>                                 | Tags                                                                                                                                 | Download .zip                                                                                                                                                                                                     | Live Demo                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Editor Bindings](https://github.com/WordPress/block-development-examples/tree/trunk/plugins/editor-bindings) | Shows how to create a block that uses editor bindings to connect custom fields to the block editor. | <small><code><a href="https://WordPress.github.io/block-development-examples/?tags=block-bindings">block-bindings</a></code></small> | [📦](https://github.com/WordPress/block-development-examples/releases/download/latest/editor-bindings.zip 'Install the plugin on any WordPress site using this zip and activate it to see the example in action') | [![](https://raw.githubusercontent.com/WordPress/block-development-examples/trunk/_assets/icon-wp.svg)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/WordPress/block-development-examples/trunk/plugins/editor-bindings/_playground/blueprint.json 'Click here to access a live demo of this example') |

<!-- @TABLE EXAMPLES END -->

## Understanding the Example Code

<img src="./assets/snapshot.png" alt="Editor Bindings Example Screenshot" style="width:50%;" />

Some key ideas for this example:

-   **Custom Binding Source Registration**: The plugin registers a `block-dev-ex/post-data` binding source both server-side (`register_block_bindings_source()`) and client-side (`registerBlockBindingsSource()`)
-   **Dynamic Data Access**: The binding source provides access to post title, excerpt, and permalink through the Block Bindings API
-   **Editor Integration**: Uses WordPress Data API (`@wordpress/blocks` and editor store) to fetch and update post data in real-time
-   **Controlled Editability**: Implements `canUserEditValue()` to make title and excerpt editable while keeping permalink read-only
-   **Context-Aware**: Uses `postId` context to determine which post's data to fetch and display
-   **WordPress 6.9+ UI Integration**: Implements `getFieldsList()` to expose binding fields (Title, Excerpt, Permalink) in the editor's Block Bindings dropdown interface, allowing users to easily connect block attributes to custom data sources

## Related resources

-   [Block Bindings API documentation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/)
-   [`registerBlockBindingsSource` documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#registerbindingsource)
-   [Block Bindings improvements in WordPress 6.9](https://make.wordpress.org/core/2025/11/12/block-bindings-improvements-in-wordpress-6-9/)

---

> **Note**
> Check the [Start Guide for local development with the examples](https://github.com/WordPress/block-development-examples/wiki/Examples#start-guide-for-local-development-with-the-examples)
This file, `examples/editor-bindings/src/index.js`, demonstrates how to register a custom ["block bindings source"](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/) in the WordPress block editor ([Gutenberg](https://developer.wordpress.org/block-editor/)) using the [`@wordpress/blocks`](https://www.npmjs.com/package/@wordpress/blocks) package. Here's a breakdown of what's happening:

---

### 1. Imports

```js
import { registerBlockBindingsSource } from '@wordpress/blocks';
```

-   This imports the function needed to register a new source for block bindings. See the [@wordpress/blocks documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/).

---

### 2. Attribute Definitions

```js
const readOnlyAttributes = [ 'permalink' ];
const editableAttributes = [ 'title', 'excerpt' ];
```

-   `readOnlyAttributes`: Attributes that can be read but not edited (e.g., the post permalink).
-   `editableAttributes`: Attributes that can be both read and edited (e.g., the post title and excerpt).

---

### 3. Registering the Block Bindings Source

```js
registerBlockBindingsSource({
  name: 'block-dev-ex/post-data',
  usesContext: [ 'postType' ],
  ...
});
```

-   Registers a new source called `block-dev-ex/post-data`.
-   It declares that it uses the `postType` context (e.g., 'post', 'page').
-   Learn more about [block bindings sources](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/).

---

### 4. getValues

```js
getValues({ select, bindings }) { ... }
```

-   This function is called to retrieve the current values for the bound attributes.
-   It loops through all bindings, and for each one:
    -   If the attribute is in `editableAttributes` or `readOnlyAttributes`, it fetches the value from the editor's state using [`select('core/editor')`](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-editor/) and [`getEditedPostAttribute`](https://github.com/WordPress/gutenberg/blob/trunk/packages/editor/src/store/selectors.js#L110).
-   Returns an object mapping attribute names to their current values.

---

### 5. setValues

```js
setValues({ dispatch, bindings }) { ... }
```

-   This function is called to update the values of the bound attributes.
-   It loops through all bindings and collects the new values.
-   If there are any values to update, it dispatches an action to update the post in the editor: [`dispatch('core/editor').editPost(values)`](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-editor/#editpost).

---

### 6. canUserEditValue

```js
canUserEditValue({ context, args }) { ... }
```

-   Determines if the current user can edit a given attribute.
-   Returns `true` only if:
    -   The post type is `'post'`.
    -   The attribute is in `editableAttributes`.

---

## Summary

This example shows how to create a custom block bindings source that allows blocks to bind to post data (title, excerpt, permalink). It defines which attributes are editable, how to get and set their values, and when editing is allowed.

**Use case:**  
This is useful for blocks that want to display or edit post-level data (like the post title or excerpt) directly from within the block editor, using the new block bindings API.

For more information, see the [Gutenberg Handbook](https://developer.wordpress.org/block-editor/).

If you want a deeper dive into any part of this file or how to use it in a block, let me know!
