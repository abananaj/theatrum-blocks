/**
 * Front end: keeps the card you clicked where it is on the screen while the stack reflows.
 *
 * The Icon Accordion opens with `autoclose` on, so a click usually collapses one card and opens
 * another. When the card that closes sits above the one you clicked, the page loses that card's
 * height while the scroll position stays put, and everything below — including the heading you were
 * aiming at — slides up under the cursor. It is worst on a long stack, and the browser's own scroll
 * anchoring does not cover it: the change is animated, it happens inside the viewport rather than
 * above it, and the anchor node it settles on is rarely the card you are looking at.
 *
 * So: measure the clicked toggle's position before core touches anything, then hold it there. This
 * runs as a closed loop — each frame it re-measures and corrects the difference rather than
 * computing an offset once — so it converges even while the 0fr -> 1fr row animation is still
 * moving, and it cannot fight the browser into a runaway if scroll anchoring also adjusts.
 *
 * Enhancement only. Without it the accordion behaves exactly as it does today; the file is enqueued
 * (theatrum-blocks.php) just for pages that render an accordion carrying the style class.
 */

const ACCORDION = '.wp-block-accordion.is-style-ct-accordion-icon';
const ITEM = '.wp-block-accordion-item';
const TOGGLE = '.wp-block-accordion-heading__toggle';

/** How long to keep correcting after the card's own transition ends, in ms. */
const SLACK = 120;

/** Ceiling on the watch, in ms, so a pathological transition-duration can't pin the page. */
const MAX_WATCH = 1000;

/** Sub-pixel drift isn't worth a scroll call, and scrollBy would round it away regardless. */
const THRESHOLD = 0.5;

let cancelActive = null;

/**
 * The longest transition on an element, in milliseconds.
 *
 * Read rather than hard-coded so the watch tracks whatever --ct-duration-slow-1 currently resolves
 * to — including 0s under prefers-reduced-motion, where the reflow is instant and SLACK alone is
 * enough to catch it.
 *
 * @param {Element} element Element to measure.
 * @return {number} Duration in ms, clamped to MAX_WATCH.
 */
function transitionDuration( element ) {
	const declared =
		window.getComputedStyle( element ).transitionDuration || '';

	const longest = declared.split( ',' ).reduce( ( max, value ) => {
		const parsed = parseFloat( value ) || 0;
		return Math.max( max, value.includes( 'ms' ) ? parsed : parsed * 1000 );
	}, 0 );

	return Math.min( longest, MAX_WATCH );
}

/**
 * Holds `toggle` at its current viewport position until the accordion settles.
 *
 * @param {Element} toggle The heading button that was activated.
 */
function pin( toggle ) {
	const target = toggle.getBoundingClientRect().top;
	const deadline =
		performance.now() +
		transitionDuration( toggle.closest( ITEM ) || toggle ) +
		SLACK;

	let frame = 0;

	const cancel = () => {
		window.cancelAnimationFrame( frame );
		window.removeEventListener( 'wheel', cancel );
		window.removeEventListener( 'touchstart', cancel );
		window.removeEventListener( 'keydown', cancel );
		cancelActive = null;
	};

	const step = () => {
		const drift = toggle.getBoundingClientRect().top - target;

		if ( Math.abs( drift ) >= THRESHOLD ) {
			// `instant`, not the default `auto`: auto obeys a `scroll-behavior: smooth` set
			// anywhere up the tree, which would animate each correction and never catch up.
			window.scrollBy( { top: drift, left: 0, behavior: 'instant' } );
		}

		if ( performance.now() < deadline ) {
			frame = window.requestAnimationFrame( step );
			return;
		}

		cancel();
	};

	// A second click mid-animation re-pins to the new toggle; only one loop ever runs.
	if ( cancelActive ) {
		cancelActive();
	}

	cancelActive = cancel;

	// Anything the reader does to scroll for themselves wins immediately — correcting past that
	// would feel like the page fighting back. The click's own keydown has already fired by now.
	window.addEventListener( 'wheel', cancel, { passive: true } );
	window.addEventListener( 'touchstart', cancel, { passive: true } );
	window.addEventListener( 'keydown', cancel );

	frame = window.requestAnimationFrame( step );
}

// Capture phase, so the measurement happens before core's Interactivity API store toggles the card.
document.addEventListener(
	'click',
	( event ) => {
		const toggle = event.target?.closest?.( TOGGLE );

		if ( toggle?.closest( ACCORDION ) ) {
			pin( toggle );
		}
	},
	true
);
