
# ✅ [Tutorial: Build your first block](https://developer.wordpress.org/block-editor/getting-started/tutorial/)

1. Scaffold & setup a new plugin-based block:

```bash
npx @wordpress/create-block@latest  --variant=dynamic
wp plugin activate copyright-date-block
 cd copyright-date-block
 npm run start
```

2. Updating block.json
   [block.json reference](https://developer.wordpress.org/block-editor/getting-started/fundamentals/block-json/)
   [supports reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
3. Updating index.js - custom icon here
   [block registration](https://developer.wordpress.org/block-editor/getting-started/fundamentals/registration-of-a-block/)
4. Updating edit.js
   [block wrapper docs](https://developer.wordpress.org/block-editor/getting-started/fundamentals/block-wrapper/)
5. Updating render.php
6. Cleanup, delete unused files
7. Stop npm run start and run:

```bash
npm run build
```

8. Add block attributes
   [block attributes](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-attributes/)
9. Inspector Controls and block editor UI components
   [Inspector Controls docs](https://developer.wordpress.org/block-editor/reference-guides/components/inspector-controls/)
   [Components and panels](https://developer.wordpress.org/block-editor/reference-guides/components/panel/#panelbody)

- TextControl, ToggleControl, SelectControl, etc.

10. Add static rendering fallback (optional)
    [Static vs Dynamic rendering](https://developer.wordpress.org/block-editor/getting-started/fundamentals/static-dynamic-rendering/)


# [Multi-block plugin](https://developer.wordpress.org/news/2024/09/how-to-build-a-multi-block-plugin/)
