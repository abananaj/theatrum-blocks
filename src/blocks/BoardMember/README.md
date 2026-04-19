# Board Member Block

Display board member information from WordPress options.

## Attributes

- **optionName** (string): The WordPress option key to retrieve from wp*options table. Typically prefixed with `option_board*`or`options*board*`
- **tagName** (string): The HTML tag to use for rendering (p, span, a, h1-h6). Default: p
- **href** (string): The URL for links (only used when tagName is 'a')

## Features

- Real-time preview in block editor via REST endpoint
- Flexible HTML tag selection including anchor tags with links
- Supports both single values and arrays of post IDs
- Automatically resolves post IDs to post titles with links
- Decodes HTML entities for proper display
- Server-side rendering for frontend output

## REST Endpoint

GET `/wp-json/chance/v1/board-member/{option_name}`

Returns an object with:

- `value`: String representation of the option value (or empty if items exist)
- `items`: Array of board member objects containing:
    - `title`: Member's name
    - `url`: Link to member's post
    - `meta_title`: Member's position/title
    - `position`: Board position label

## Server Rendering

The block displays:

- **Arrays of post IDs**: List of linked member names with position information and italicized titles
- **Single values**: The value wrapped in the selected HTML tag

## Usage

Add the block to a page or post and enter the option key (e.g., `option_board_members`, `option_board_officers`).
