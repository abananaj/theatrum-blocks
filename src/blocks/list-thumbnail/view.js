/**
 * Thumbnail List Block Frontend Script
 *
 * Drives the two-face flip-card preview. Ported from the source CodePen:
 * exactly two <img> faces (front / back) alternate as the visible face while
 * the flipper rotates by `index * -180deg` on hover. The rotated-away face is
 * hidden via `backface-visibility: hidden`, so we can safely update its src
 * before it comes back into view.
 *
 * List items are rendered by the `theatrum/list-item-thumbnail` child block —
 * each carries its thumbnail URL/alt as data attributes for us to read here.
 *
 * Animation duration comes from the `--animation-speed` CSS custom property
 * set in save.js (applied to the flipper transition in style.scss).
 */

document.addEventListener( 'DOMContentLoaded', function () {
	const blocks = document.querySelectorAll(
		'.wp-block-theatrum-list-thumbnail'
	);

	blocks.forEach( ( block ) => {
		const listItems = block.querySelectorAll( '.list-item' );
		const flipper = block.querySelector( '.thumbnail-flipper' );
		const front = block.querySelector( '.thumbnail-front' );
		const back = block.querySelector( '.thumbnail-back' );

		if ( ! flipper || ! front || ! back || listItems.length === 0 ) {
			return;
		}

		const updateThumbnail = ( index ) => {
			const item = listItems[ index ];
			if ( ! item ) {
				return;
			}

			const url = item.getAttribute( 'data-thumb-url' ) || '';
			const alt = item.getAttribute( 'data-thumb-alt' ) || '';

			// Even indices land on the front face, odd on the back.
			const face = index % 2 ? back : front;
			if ( url ) {
				face.src = url;
				face.alt = alt;
			}

			flipper.style.transform = `rotateX(${ index * -180 }deg)`;
		};

		listItems.forEach( ( item, index ) => {
			item.addEventListener( 'mouseenter', () =>
				updateThumbnail( index )
			);
		} );

		// Show the first item on load.
		updateThumbnail( 0 );
	} );
} );
