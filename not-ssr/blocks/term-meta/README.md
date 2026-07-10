# Term Meta Block

Display metadata for taxonomy terms, with support for generic term meta and season producer displays.

## Block Variations

### 1. Generic Term Meta (Default)

Display any metadata value for a selected taxonomy term.

**Features:**

- Select taxonomy and term dynamically
- Specify any meta key
- Customize HTML tag
- Optional prepend/append text
- Full typography and color support

**Use Cases:**

- Display term descriptions, colors, icons
- Show custom term metadata
- Generic taxonomy term field display

### 2. Season Producer Variation

Display season producer titles from the current post's season taxonomy term.

**Features:**

- Automatically retrieves the season term for the current post
- Displays producer names in a formatted list
- Supports multiple producers from ACF fields
- Optional heading with customizable heading level
- Supports both "Season Producers" and "Associate Season Producers" fields

**Attributes:**

- `displayType`: "season-producer"
- `metaKey`: "season_producers" or "associate_season_producers"
- `headingText`: Optional heading label
- `headingLevel`: h2-h6

**Output:**

```
Season Producers (optional heading)
- Producer 1 Name
- Producer 2 Name
```

## Attributes

### Generic Display

- `displayType`: "generic" (default)
- `taxonomy`: Taxonomy REST base (e.g., "categories", "tags")
- `termId`: Selected term ID
- `metaKey`: Term meta field key to retrieve
- `tagName`: HTML tag - "p", "span", "a", "h1-h6" (default: "p")
- `prepend`: Optional text to prepend
- `append`: Optional text to append

### Season Producer Display

- `displayType`: "season-producer"
- `metaKey`: "season_producers" or "associate_season_producers"
- `headingText`: Optional heading label
- `headingLevel`: Heading HTML tag - "h2" to "h6" (default: "h2")

## REST Endpoints

- Generic: `/chance/v1/term-meta-field/{term_id}/{meta_key}`
- Season Producer: `/chance/v1/season-producer/{post_id}/{meta_key}`

## Features

- **Dynamic Term Selection**: Choose from any registered taxonomy
- **Flexible Meta Keys**: Display any term metadata
- **ACF Support**: Works with ACF term fields
- **Season Term Auto-Detection**: Season producer variation automatically finds the post's season
- **Heading Support**: Season producer can include optional headings
- **Typography & Color**: Full support for typography, colors, spacing, and borders
- **Reusable**: Use multiple times with different configurations
