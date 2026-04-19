This block will function similarly to the WordPress core Cover block. It will include a function that does the following:

1. gets value which will be a post_id for given meta key input by user in sidebar
2. use post_id to get post object including title, featured image, and permalink
3. output a card with the post's featured image as the background, and the title overlaid on top. The entire card will link to the post's permalink.
4. this card should support nesting the basic wp core blocks
5. User will edit inner blocks in block editor and should support the other custom meta data blocks nested inside it (e.g. production open/close date, production credits, etc.)
