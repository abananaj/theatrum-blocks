/**
 * Thumbnail List Block Frontend Script. Drives the two-face flip-card icon (ported from the source CodePen): two <img> faces alternate as the flipper rotates `index * -180deg` on hover; the rotated-away face is `backface-visibility: hidden`, so its src can be swapped before it's visible again.
 * The icon also travels: .thumbnail-container is absolutely positioned within .thumbnail-list-wrapper, and on hover it's translated to the hovered item's offsetTop (centered against that row's height) so it sits directly beside whichever item is hovered instead of staying in one fixed spot.
 * List items (`theatrum/list-item-thumbnail`) carry thumbnail URL/alt as data attributes; items missing one (or saved before the blue-gradient placeholder became default) fall back to that placeholder so the panel never shows blank/broken.
 * Animation duration comes from `--animation-speed` (set in save.js, applied in style.scss).
 */

const PLACEHOLDER_THUMBNAIL_URL =
	'https://chance-theater.s3.us-west-1.amazonaws.com/2026/06/blue-gradient.png';

document.addEventListener( 'DOMContentLoaded', function () {
	const blocks = document.querySelectorAll(
		'.wp-block-theatrum-list-thumbnail'
	);

	blocks.forEach( ( block ) => {
		const listItems = block.querySelectorAll( '.list-item' );
		const container = block.querySelector( '.thumbnail-container' );
		const flipper = block.querySelector( '.thumbnail-flipper' );
		const front = block.querySelector( '.thumbnail-front' );
		const back = block.querySelector( '.thumbnail-back' );

		if (
			! container ||
			! flipper ||
			! front ||
			! back ||
			listItems.length === 0
		) {
			return;
		}

		const updateThumbnail = ( index ) => {
			const item = listItems[ index ];
			if ( ! item ) {
				return;
			}

			const url =
				item.getAttribute( 'data-thumb-url' ) ||
				PLACEHOLDER_THUMBNAIL_URL;
			const alt = item.getAttribute( 'data-thumb-alt' ) || '';

			// Even indices land on the front face, odd on the back.
			const face = index % 2 ? back : front;
			face.src = url;
			face.alt = alt;

			flipper.style.transform = `rotateX(${ index * -180 }deg)`;

			const offsetY =
				item.offsetTop +
				( item.offsetHeight - container.offsetHeight ) / 2;
			container.style.transform = `translateY(${ offsetY }px)`;
		};

		listItems.forEach( ( item, index ) => {
			item.addEventListener( 'mouseenter', () =>
				updateThumbnail( index )
			);
			// Keyboard parity: focusing a link inside the item swaps the thumbnail too.
			item.addEventListener( 'focusin', () => updateThumbnail( index ) );
		} );

		// Show the first item on load.
		updateThumbnail( 0 );
	} );
} );
