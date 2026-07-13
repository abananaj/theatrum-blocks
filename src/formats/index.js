/**
 * Frontend entry for the Carousel/Slider formats. Only loaded on pages that
 * actually use `is-style-ct-carousel` / `is-style-ct-slider` (see the
 * `render_block` enqueue sniff in inc/block-styles.php), so this doesn't
 * need to guard against absence — but it does need to skip roots already
 * owned by the native chance/carousel and chance/slider blocks, since their
 * own view.js already initializes them.
 */

import './style.scss';

import { initCarousel } from './carousel';
import { initSlider } from './slider';

window.addEventListener( 'load', () => {
	for ( const root of document.querySelectorAll( '.is-style-ct-carousel' ) ) {
		if ( root.classList.contains( 'wp-block-chance-carousel' ) ) {
			continue;
		}
		initCarousel( root );
	}

	for ( const root of document.querySelectorAll( '.is-style-ct-slider' ) ) {
		if ( root.classList.contains( 'ct-slider' ) ) {
			continue;
		}
		initSlider( root );
	}
} );
