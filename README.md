# Theatrum Blocks

A WordPress plugin providing 30+ custom Gutenberg blocks for Chance Theater's website. Includes production management, metadata displays, carousels, and filtering components.

**Version:** 0.1.0  
**License:** GPL-2.0-or-later

## Quick Links

👉 **For development setup and commands:** See [CLAUDE.md](./CLAUDE.md)  
👉 **For using Claude agents with this project:** See [AGENTS.md](./AGENTS.md)  
👉 **For changelog and release workflow:** See [CHANGELOG-SETUP.md](./CHANGELOG-SETUP.md)

> **Note:** This plugin operates independently from the theme and main project, but coordinates with both. The documentation patterns are similar across [chance-ollie theme](../../themes/chance-ollie/) and [wp_root project docs](../../). Check [.build/blocks.md](../../../../.build/blocks.md) for comprehensive block development guidance and [.deploy/deploy.md](../../../../.deploy/deploy.md) for deployment workflows.

## Overview

Theatrum Blocks is a multi-block plugin that registers custom Gutenberg blocks under the "Custom Blocks" category. It provides:

- **Display Blocks** — Breadcrumbs, carousels, popups, icon lists, media popovers
- **Meta Blocks** — Display and manage post meta fields (dates, images, galleries, files, etc.)
- **Production Blocks** — Production details, performances, quotes, trailers, staff
- **Query Blocks** — Frontend filtering and sorting for query loops
- **Block Variations** — Extended variations of core WordPress blocks

All blocks are fully configurable in the editor with color, typography, spacing, and alignment controls via theme.json.

## Block Categories

### Standard Display Blocks
- `breadcrumbs` — Hierarchical breadcrumb navigation
- `card-carousel` — Carousel of cards with swipe controls
- `cover-carousel` — Full-width image carousel
- `cover-card` — Large card with background image
- `icon-list` — Formatted list with icons
- `media-popover` — Click-to-expand media modal
- `popup` — Modal dialog block
- `svg-icon` — Reusable SVG icon display
- `thumbnail-list` — Grid of thumbnail cards

### Meta Blocks (Extract & Display Post Meta)
- `meta-button` — Render meta as button
- `meta-date` — Parse and format dates
- `meta-embed` — Embed media from meta URLs
- `meta-field` — Generic meta field display
- `meta-file` — File download link from meta
- `meta-gallery` — Image gallery from meta
- `meta-icon` — Icon from meta value
- `meta-image` — Image from meta URL
- `meta-related` — List related posts from meta
- `meta-repeater` — Repeating meta fields (producers, quotes, etc.)
- `meta-time` — Time field display

### Production-Specific Blocks (Chance Theater)
- `production-details` — Venue and performance details
- `production-performances` — List performances using meta-repeater
- `production-quotes` — Display quotes using meta-repeater
- `production-trailer` — Video trailer embed
- `term-meta` — Display taxonomy term metadata
- `season-producer` — Producer list variant of term-meta
- `staff-member` — Individual staff member card
- `site-option` — Display site option values

### Query & Interaction
- `query-filter` — Frontend filter/sort for query loops

### Block Variations
- `subtitle-title` — Heading with subtitle variant
- `heading-toggle` — Toggleable heading section

## Getting Started

### Installation

1. Clone or place plugin in `wp-content/plugins/theatrum-blocks/`
2. Activate in WordPress Admin
3. Blocks appear under **Custom Blocks** category in editor

### Development

```bash
# Start development server with hot reload
npm run start

# Build for production (one-time)
npm run deploy

# Format code to WordPress standards
npm run format

# Lint JavaScript
npm run lint:js

# Lint CSS
npm run lint:css
```

See [CLAUDE.md](./CLAUDE.md) for detailed development guidance.

## Directory Structure

```
theatrum-blocks/
├── src/
│   ├── blocks/                      # Individual block directories
│   │   ├── [block-name]/
│   │   │   ├── block.json           # Block metadata
│   │   │   ├── edit.js              # Editor React component
│   │   │   ├── render.php           # Server-side rendering
│   │   │   └── index.js             # Optional registration/icons
│   │   └── _variations/             # Block variation blocks
│   ├── utils/                       # Shared JavaScript utilities
│   └── style-book.js                # Style Book positioning
├── inc/
│   ├── helpers.php                  # PHP utilities (date parsing, etc.)
│   └── rest-endpoints.php           # Custom REST API routes
├── build/                           # Compiled output (gitignored)
│   ├── blocks/                      # Compiled block bundles
│   └── blocks-manifest.json         # Block registry
├── theatrum-blocks.php              # Main plugin file
├── package.json                     # Dependencies & scripts
├── CLAUDE.md                        # Development guide
├── AGENTS.md                        # Agent workflows
├── CHANGELOG.md                     # Release history
├── CHANGELOG-SETUP.md               # Changelog workflow
└── README.md                        # This file
```

## Key Concepts

### Block Types

- **Static Blocks** — Markup saved in post content, rendered by JavaScript
- **Dynamic Blocks** — Have `render.php`, markup generated server-side

### Block Context

Blocks can access post context (postId, postType, etc.) via `block->context` in render.php or as useBlockProps context in edit.js.

### REST Endpoints

Custom endpoints registered in `inc/rest-endpoints.php` provide data for block editors. Endpoints prefixed with `/chance/v1/`.

### Helpers

`inc/helpers.php` provides utilities like `theatrum_parse_flexible_date()` which parses dates in multiple formats with caching for performance.

## Dependencies

- **WordPress 6.8+** (for block support)
- **PHP 7.4+**
- **@wordpress/scripts** — Build tooling
- **@wordpress/block-editor** — Block editor components
- **@wordpress/components** — UI controls
- **@wordpress/element** — React utilities
- **@wordpress/i18n** — Internationalization

## Workflow

### Adding a New Block

1. Plan the block architecture (see [AGENTS.md](./AGENTS.md#plan-agent))
2. Scaffold with `npx @wordpress/create-block@latest --variant=dynamic`
3. Implement edit.js (editor UI) and render.php (frontend output)
4. Register block in `theatrum-blocks.php`
5. Review code with `/code-review` or `/wp-standards`

### Making a Release

1. Update version in `package.json`
2. Create release commit with message like "Release v0.2.0"
3. Tag commit: `git tag -a v0.2.0`
4. Run `npm run deploy` to build for distribution

See [CHANGELOG-SETUP.md](./CHANGELOG-SETUP.md) for full changelog workflow.

## Code Review

Before pushing changes:

```bash
# Quick quality check
/code-review low

# WordPress standards compliance
/wp-standards

# Security audit
/security-review
```

See [AGENTS.md](./AGENTS.md) for more code review options.

## Changelog

All changes are documented in [CHANGELOG.md](./CHANGELOG.md) following [Keep a Changelog](https://keepachangelog.com/) format with [Semantic Versioning](https://semver.org/).

The changelog is automatically updated when you make git commits. See [CHANGELOG-SETUP.md](./CHANGELOG-SETUP.md) for details.

## Resources

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
- [block.json Reference](https://developer.wordpress.org/blocks/block.json/)
- [Block Supports API](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [Inspector Controls](https://developer.wordpress.org/block-editor/reference-guides/components/inspector-controls/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [Multi-block Plugin Guide](https://developer.wordpress.org/news/2024/09/how-to-build-a-multi-block-plugin/)