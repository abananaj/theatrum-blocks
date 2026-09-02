/**
 * Front-end behavior for the Carousel block — actual runtime lives in ../../formats/carousel.js, shared with the `is-style-ct-carousel` format on core/query and core/gallery (see ../../formats/index.js).
 */

import { initCarousel } from '../../formats/carousel';

window.addEventListener( 'load', () => {
	for ( const component of document.querySelectorAll(
		'.theatrum-carousel-wrapper'
	) ) {
		initCarousel( component );
	}
} );
