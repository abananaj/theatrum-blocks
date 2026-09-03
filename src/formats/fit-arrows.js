/**
 * Outside arrows (left/right: -48px) need that much room beyond the block. Near a viewport edge — a sidebar column, a narrow screen — they pushed the whole page into horizontal scroll (breakpoint audit B-12), so this toggles an auto-inside class, re-checked on resize, that the SCSS styles exactly like the authored inside position.
 */

const OUTSIDE_ROOM = 48;

/**
 * @param {HTMLElement} root      The arrows' containing block.
 * @param {string}      autoClass Class to toggle when there is no room outside.
 * @param {string[]}    skip      Authored classes that already decide the position.
 */
export function fitArrows( root, autoClass, skip ) {
	if ( skip.some( ( cls ) => root.classList.contains( cls ) ) ) {
		return;
	}

	const apply = () => {
		const { left, right } = root.getBoundingClientRect();
		const viewport = document.documentElement.clientWidth;
		root.classList.toggle(
			autoClass,
			left < OUTSIDE_ROOM || right + OUTSIDE_ROOM > viewport
		);
	};

	apply();

	let frame = 0;
	window.addEventListener( 'resize', () => {
		window.cancelAnimationFrame( frame );
		frame = window.requestAnimationFrame( apply );
	} );
}
