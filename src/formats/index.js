/**
 * Frontend entry for the Carousel/Slider formats. Only loaded on pages using `is-style-ct-carousel`
 * / `is-style-ct-slider` (see the `render_block` enqueue sniff in inc/block-styles.php); skips
 * roots already owned by the native theatrum/carousel and theatrum/slider blocks, whose own view.js already initializes them.
 */

import './style.scss';

import { initCarousel } from './carousel';
import { initSlider } from './slider';

window.addEventListener( 'load', () => {
	for ( const root of document.querySelectorAll( '.is-style-ct-carousel' ) ) {
		if ( root.classList.contains( 'wp-block-theatrum-carousel' ) ) {
			continue;
		}
		initCarousel( root );
	}

	for ( const root of document.querySelectorAll( '.is-style-ct-slider' ) ) {
		if ( root.classList.contains( 'tm-slider' ) ) {
			continue;
		}
		initSlider( root );
	}
} );
