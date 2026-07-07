# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**[← Back to wp_root](../../../../CLAUDE.md)** | [AGENTS.md](AGENTS.md) | [CHANGELOG.md](CHANGELOG.md)

## Project Overview

Theatrum Blocks is a WordPress plugin that provides custom Gutenberg blocks for the Chance Theater website. It's a multi-block plugin that registers 30+ blocks used for displaying production information, metadata, carousels, and other custom content types.

## Development Commands

All commands use `wp-scripts` (WordPress development CLI):

**Starting development:** `npm run start`
- Starts webpack in watch mode with hot reload for block changes
- Use this while editing blocks

**Building for production:** `npm run build` or `npm run deploy`
- One-time build without watch mode, generates minified assets in `/build` directory with the blocks manifest
- `deploy` and `build` currently run the same command

**Building with watch:** `npm run build:watch`
- One-time-build's watch-mode equivalent — same output as `build`, but rebuilds on file change

**Code formatting:** `npm run format`
- Formats JavaScript/PHP files to WordPress standards

**Linting:**
- `npm run lint:js` — Lint JavaScript files
- `npm run lint:css` — Lint CSS/SCSS files

**Package updates:** `npm run packages-update`
- Updates WordPress dependencies

**Plugin distribution:** `npm run plugin-zip`
- Creates a distributable zip file of the plugin

## Architecture

### Directory Structure

```
theatrum-blocks/
├── src/
│   ├── blocks/              # Individual block directories
│   │   ├── [block-name]/
│   │   │   ├── block.json   # Block metadata & configuration
│   │   │   ├── edit.js      # Editor-side React component
│   │   │   ├── render.php   # Server-side rendering (dynamic blocks)
│   │   │   └── index.js     # Optional: block registration/icons
│   │   └── _variations/     # Block variation blocks (inherit parent)
│   ├── utils/               # Shared JavaScript utilities
│   └── style-book.js        # Style Book positioning script
├── inc/
│   ├── helpers.php          # Shared PHP utilities (date parsing, queries)
│   └── rest-endpoints.php   # Custom REST API endpoints for blocks
├── build/                   # Compiled output — COMMITTED (served by the deploy branch)
│   ├── blocks/              # Compiled block bundles
│   ├── blocks-manifest.json # Manifest of all registered blocks
│   └── style-book.js        # Compiled style book script
├── theatrum-blocks.php      # Main plugin file
└── package.json             # Dependencies & build scripts
```

### Block Structure

Each block follows this pattern:

1. **block.json** — Metadata file that defines:
   - Block name, title, category
   - Attributes (editable properties)
   - Supports (styling, alignment, etc.)
   - Context requirements
   - Render callback for dynamic blocks

2. **edit.js** — React component for the block editor:
   - Receives `attributes` and `setAttributes` props
   - Renders inspector controls (settings sidebar)
   - Renders preview or live editor view
   - Can use `useServerSideRender` hook to show backend-rendered output

3. **render.php** — Optional PHP template for frontend rendering:
   - Receives `$attributes` (block attributes)
   - Receives `$content` (inner block content)
   - Receives `$block` (block object with context)
   - Used for dynamic blocks where content depends on server-side data

4. **index.js** — Optional: registers the block with custom icons

### Block Categories

The plugin organizes blocks into three groups in `theatrum-blocks.php`:

1. **Standard display blocks** — UI components (breadcrumbs, carousels, popups, etc.)
2. **Meta blocks** — Extract and display post meta fields (meta-field, meta-date, meta-image, etc.)
3. **Production-specific blocks** — Domain-specific blocks for Chance Theater (production-tabs, season-producer, etc.)
4. **Query blocks** — Frontend filtering/sorting (query-filter)

Block variations (in `_variations/` directory) extend existing WordPress blocks with presets.

## Key Files

**theatrum-blocks.php** (Main plugin file)
- Registers all blocks via `theatrum_register_blocks()`
- Registers custom "Custom Blocks" category via `theatrum_register_block_category()`
- Enqueues Style Book editor script
- Block variations (in `_variations/` directories) are registered client-side via the enqueued `build/meta-variations.js`, not a PHP function

**inc/helpers.php**
- `theatrum_parse_flexible_date()` — Parse dates in multiple formats with caching
- `theatrum_is_allowed_settings_option()` — Allowlist gate for the board-member/staff-member/site-option option-name lookups
- Utility functions for date/time and production data queries
- Cached operations to avoid redundant processing

**inc/rest-endpoints.php**
- Registers custom REST API routes for block editors
- Provides data endpoints that blocks use (e.g., `/chance/v1/cover-card/{meta_key}`)
- Includes permission callbacks for security

**inc/empty-meta.js**
- JavaScript utility for handling empty meta fields

**src/blocks/block.jsonc**
- Authoring template/reference for new block.json files (JSON with Comments) — not a real block config and not loaded by the build

## Common Development Tasks

### Adding a New Block

Use WordPress scaffolding to generate the block structure:
```bash
npx @wordpress/create-block@latest --variant=dynamic --slug=my-block
```

Then either copy the generated directory into `src/blocks/` or manually create:
```
src/blocks/my-block/
├── block.json
├── edit.js
├── render.php
├── index.js
```

Register the block by adding its name to the `$custom_blocks` array in `theatrum-blocks.php`.

### Adding Server-Side Data to a Block

Edit `render.php` in the block directory. The file receives:
- `$attributes` — Block settings from the editor
- `$content` — Inner block HTML
- `$block` — Block object containing context (postId, postType, etc.)

Example:
```php
$post_id = $block->context['postId'] ?? 0;
$meta_value = get_post_meta($post_id, 'my_meta_key', true);
```

### Adding Custom REST Endpoints

Add route registration to `inc/rest-endpoints.php`:
```php
register_rest_route('chance/v1', '/my-endpoint', [
    'methods' => 'GET',
    'callback' => 'my_callback_function',
    'permission_callback' => 'theatrum_editor_permission_check',
]);
```

Blocks can fetch from these endpoints in `edit.js` via `@wordpress/api-fetch`.

### Styling Blocks

Blocks inherit WordPress theme styling via `theme.json`. Use block.json `supports` to enable color, typography, spacing, and border controls. Inline styles are compiled by wp-scripts.

## Important Concepts

**Dynamic vs Static Blocks**
- Static blocks: Markup is saved in post content, rendered by `edit.js`
- Dynamic blocks: Have `render.php` file, markup generated server-side

**Context**
- Block.json `usesContext` declares what context data the block needs (postId, postType, etc.)
- Access via `$block->context` in render.php or JavaScript

**Caching**
- Use `wp_cache_get()`/`wp_cache_set()` in helpers.php for expensive operations
- Date parsing results are cached to avoid redundant work

**Block Manifest**
- `build/blocks-manifest.json` auto-generated, lists all registered blocks
- Used by WordPress to load block assets

## Dependencies

- `@wordpress/scripts` — Build tooling & linting
- `@wordpress/block-editor` — Block editor components
- `@wordpress/components` — UI controls
- `@wordpress/element` — React utilities
- `@wordpress/i18n` — Internationalization
- `@wordpress/api-fetch` — REST API client

## Testing Blocks

The plugin is designed to work with a local WordPress environment using `@wordpress/env`. Access blocks in the Site Editor or post editor. Blocks appear under "Custom Blocks" category.

## Related Documentation

**Plugin coordination:** This plugin operates independently but coordinates with the chance-ollie theme and wp_root project:
- **Theme docs:** See `../../themes/chance-ollie/CLAUDE.md` and `AGENTS.md` for similar patterns
- **wp_root docs:** See `../../CLAUDE.md` and `AGENTS.md` (the wp_root project documentation)
- **Build reference:** See `../../../../.build/blocks.md` for comprehensive block development guidance
- **Deployment:** See `../../../../.deploy/deploy.md` for the git push → SSH pull deployment workflow

When updating this CLAUDE.md, consider whether changes should be reflected in the theme or wp_root project docs to keep workflows in sync.
