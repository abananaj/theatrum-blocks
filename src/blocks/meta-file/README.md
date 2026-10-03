This block will link to an attachment by taking a meta key that is either a post object or post ID and render a link to it that opens in a new tab. The User will input the required text for the link. [acf documentation](https://www.advancedcustomfields.com/resources/file/)

**Multiple files:** if the field holds a list (ACF gallery, array of attachment IDs/URLs/file arrays), one link is rendered per file. "Show multiple files as a list" (`showAsList`, default on) wraps them in `<ul class="wp-block-theatrum-meta-file-list">`; off, the links sit inline.

**Link text:** `linkTextSource` picks the link text — `custom` (the Link Text attribute, default), `title` (attachment title), or `filename`. Title/filename fall back to the custom text when the file has none.
