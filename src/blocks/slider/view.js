/**
 * Front-end behavior for the Slider block. The actual runtime lives in
 * ../../formats/slider.js, shared with the `is-style-ct-slider` format on
 * core/query and core/gallery — see ../../formats/index.js.
 */

import { initSlider } from '../../formats/slider';

window.addEventListener( 'load', () => {
	for ( const slider of document.querySelectorAll( '.ct-slider' ) ) {
		initSlider( slider );
	}
} );
