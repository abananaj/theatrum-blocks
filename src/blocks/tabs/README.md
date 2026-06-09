I want to build a custom tabs block and child "tab" block based on the starter files in this dir. It should be dynamic and use InnerBlocks. First review these docs:
- [Use styles and stylesheets](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/applying-styles-with-stylesheets/)
- [Creating dynamic blocks](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/creating-dynamic-blocks/)
- [Nested Blocks: Using InnerBlocks](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/nested-blocks-inner-blocks/)
- [Enqueueing assets in the Editor](https://developer.wordpress.org/block-editor/how-to-guides/enqueueing-assets-in-the-editor/)

Then produce a simple implementation of a tabs block and tab child block. The tabs block should use InnerBlocks to allow for multiple tab child blocks. Each tab child block should have a title and content. The tabs block should render the titles as clickable tabs and the content of the active tab below.

It should look the same on the frontend and block editor. Don't add uneccessary css or styling, just the basics to make it functional. Use the block editor's default styles for the tabs and content.