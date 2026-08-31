/**
 * Front-end behavior for the Slider block. The actual runtime lives in
 * ../../formats/slider.js, shared with the `is-style-tm-slider` format on
 * core/query and core/gallery — see ../../formats/index.js.
 */

import { initSlider } from '../../formats/slider';

window.addEventListener('load', () => {
	for (const slider of document.querySelectorAll('.tm-slider')) {
		initSlider(slider);
	}
});
