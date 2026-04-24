# Onstage Next Block

Display the next upcoming production after the current one as a featured card with background image.

## Key Features

- **Automatic Display**: Shows the next upcoming production after current
- **Manual Selection**: Editor can override and choose a specific production
- **Featured Image Background**: Uses production's featured image as card background
- **Customizable Button Text**: Editors can configure the "Learn More" button label
- **Standard WordPress Block Classes**: Uses core block classes (`wp-block-cover`, `wp-block-button__link`)
- **Responsive Design**: Adapts to different screen sizes

## Sidebar Controls

### Production Selection

- **Search/Select**: Find and select a specific production to display
- Leave empty to use automatic next production selection
- Shows selected production or auto mode status

### Button Settings

- **Button Text**: Customize the action button text (default: "Learn More")

## Frontend Output

Renders as a styled card link with:

- Featured image as background
- Production title as overlay text
- Opening and closing dates
- Configurable call-to-action button

## Usage

### Automatic Mode (Default)

1. Insert the block
2. Leave "Production Selection" empty
3. Block displays the next upcoming production

### Manual Selection

1. Search for a specific production
2. Click to select it
3. Block displays only that production
