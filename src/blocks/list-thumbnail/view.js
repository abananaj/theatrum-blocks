/**
 * Thumbnail List Block Frontend Script. Drives the two-face flip-card icon (ported from the source CodePen): two <img> faces alternate as the flipper rotates `index * -180deg` on hover; the rotated-away face is `backface-visibility: hidden`, so its src can be swapped before it's visible again.
 * The icon also travels: .thumbnail-container is absolutely positioned within .thumbnail-list-wrapper, and on hover it's translated to the hovered item's offsetTop (centered against that row's height) so it sits directly beside whichever item is hovered instead of staying in one fixed spot.
 * List items (`theatrum/list-item-thumbnail`) carry thumbnail URL/alt as data attributes; items missing one (or saved before the blue-gradient placeholder became default) fall back to that placeholder so the panel never shows blank/broken.
 * Animation duration comes from `--animation-speed` (set in save.js, applied in style.scss).
 * Lists with SVG thumbnails swap both faces for <div>s at load and inline each item's SVG so nomenclature colors apply; `ct-icon-keep-colors` on the list or an item opts out.
 */

const PLACEHOLDER_THUMBNAIL_URL =
	'https://chance-theater.s3.us-west-1.amazonaws.com/2026/06/blue-gradient.png';

const KEEP_COLORS_CLASS = 'ct-icon-keep-colors';

// Items with an SVG thumbnail carry a <template class="list-item-svg"> (inc/list-thumbnail-svg.php); ct-icon-keep-colors on the list or item falls back to the plain <img>.
const getSvgTemplate = ( block, item ) =>
	block.classList.contains( KEEP_COLORS_CLASS ) ||
	item.classList.contains( KEEP_COLORS_CLASS )
		? null
		: item.querySelector( ':scope > template.list-item-svg' );

// An <img> face can't hold inline SVG, so swap it for a <div> with the same classes; runtime-only, saved markup is untouched.
const toDivFace = ( img ) => {
	const div = document.createElement( 'div' );
	div.className = img.className;
	img.replaceWith( div );
	return div;
};

// Per-item ct-icon-{role} classes are copied onto the face, which sits outside the item.
const getIconRoleClasses = ( item ) =>
	[ ...item.classList ].filter(
		( name ) => name.startsWith( 'ct-icon-' ) && name !== KEEP_COLORS_CLASS
	);

document.addEventListener( 'DOMContentLoaded', function () {
	const blocks = document.querySelectorAll(
		'.wp-block-theatrum-list-thumbnail'
	);

	blocks.forEach( ( block ) => {
		const listItems = block.querySelectorAll( '.list-item' );
		const container = block.querySelector( '.thumbnail-container' );
		const flipper = block.querySelector( '.thumbnail-flipper' );
		let front = block.querySelector( '.thumbnail-front' );
		let back = block.querySelector( '.thumbnail-back' );

		if (
			! container ||
			! flipper ||
			! front ||
			! back ||
			listItems.length === 0
		) {
			return;
		}

		const hasSvg = [ ...listItems ].some( ( item ) =>
			getSvgTemplate( block, item )
		);
		const faceBaseClasses = {};
		if ( hasSvg ) {
			faceBaseClasses.front = front.className;
			faceBaseClasses.back = back.className;
			front = toDivFace( front );
			back = toDivFace( back );
		}

		// Div faces: inline the item's SVG, or an <img> for raster thumbnails so a list can mix both.
		const fillDivFace = ( face, baseClass, item, url, alt ) => {
			const template = getSvgTemplate( block, item );
			face.className = [ baseClass, ...getIconRoleClasses( item ) ].join(
				' '
			);
			if ( template ) {
				const svg = template.content.cloneNode( true );
				face.replaceChildren( svg );
				return;
			}
			const img = document.createElement( 'img' );
			img.src = url;
			img.alt = alt;
			face.replaceChildren( img );
		};

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
			if ( hasSvg ) {
				fillDivFace(
					face,
					index % 2 ? faceBaseClasses.back : faceBaseClasses.front,
					item,
					url,
					alt
				);
			} else {
				face.src = url;
				face.alt = alt;
			}

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
