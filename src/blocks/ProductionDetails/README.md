# Production Details Block

Displays and edits production location information (venue and venue room) for the `ct-production` post type.

## Block Features

- **Display**: Shows venue name and venue room/space information
- **Post Type Specific**: Only displays on `ct-production` posts
- **Editable**: Update venue details directly in the block editor
- **Conditional**: Block only renders if venue data exists

## Block Attributes

- `venue` (string, default: "") - The venue name where production is held
- `venueRoom` (string, default: "") - The specific room or space at the venue

## Post Meta Storage

The block reads/writes to post metadata:

- `_venue` - Venue name
- `_venue_room` - Venue room or space

## Display Fields

For each production, displays:

1. **Venue** - Primary venue location
2. **Venue Room** - Specific room or performance space

## Usage

1. Add the "Production Details" block to a `ct-production` post
2. Edit the block settings in the inspector panel:
    - Enter venue name
    - Enter venue room/space (optional)
3. Save & publish

## CSS Classes

The block uses these CSS classes for styling:

- `.production-details` - Container
- `.production-venue` - Venue name paragraph
- `.production-venue-room` - Venue room paragraph

## Related

- Refactored from: `src/php/prod-details.php`
- Used for: `ct-production` custom post type editing
- Similar concept: Post meta editing blocks
