/**
 * Carousel format — shared by theatrum/carousel and any core block styled `is-style-ct-carousel`
 * (core/query, core/gallery). Contract: a root, a scrollable track inside it, and two optional
 * arrow buttons — slides need no class/attribute, so core markup adopts this unchanged. Builds
 * arrows itself when missing (every core block, and theatrum/carousel before render.php added them).
 */

import { __ } from '@wordpress/i18n';
import { resolveTrack } from './resolve-track';
import { fitArrows } from './fit-arrows';

const CONTENT_SELECTOR = '.theatrum-carousel-content';

function buildArrow( direction ) {
	const button = document.createElement( 'button' );
	button.type = 'button';
	button.className = `theatrum-carousel-arrow theatrum-arrow-${ direction }`;
	button.setAttribute(
		'aria-label',
		direction === 'prev'
			? __( 'Previous', 'theatrum-blocks' )
			: __( 'Next', 'theatrum-blocks' )
	);
	if ( direction === 'prev' ) {
		button.classList.add( 'disabled' );
	}
	return button;
}

/**
 * @param {HTMLElement} component Root element to scan/hydrate.
 */
export function initCarousel( component ) {
	const content =
		component.querySelector( CONTENT_SELECTOR ) ??
		resolveTrack( component );

	if ( ! content ) {
		return;
	}

	let prevButton = component.querySelector( '.theatrum-arrow-prev' );
	let nextButton = component.querySelector( '.theatrum-arrow-next' );

	if ( ! prevButton && ! nextButton ) {
		prevButton = buildArrow( 'prev' );
		nextButton = buildArrow( 'next' );
		component.prepend( prevButton );
		component.append( nextButton );
	}

	const hasControls = nextButton !== null || prevButton !== null;

	fitArrows( component, 'theatrum-arrows-auto-inside', [
		'theatrum-arrows-inside',
		'theatrum-arrows-hidden',
	] );

	let maxScrollWidth = content.scrollWidth - content.clientWidth;
	let scrollBy = content.clientWidth / 2;

	// Re-measured on resize (and whenever the track's content changes size, e.g. lazy-loaded
	// images) rather than once on `load`, so arrow state doesn't go stale.
	const remeasure = () => {
		maxScrollWidth = content.scrollWidth - content.clientWidth;
		scrollBy = content.clientWidth / 2;
		component.classList.toggle( 'has-arrows', maxScrollWidth !== 0 );
		toggleArrows();
	};

	// aria-disabled (not the disabled attribute) so the arrow stays focusable and announces its state.
	const setArrowState = ( button, isDisabled ) => {
		if ( ! button ) {
			return;
		}
		button.classList.toggle( 'disabled', isDisabled );
		button.setAttribute( 'aria-disabled', String( isDisabled ) );
	};

	const toggleArrows = () => {
		setArrowState( nextButton, content.scrollLeft >= maxScrollWidth - 10 );
		setArrowState( prevButton, content.scrollLeft <= 10 );
	};

	remeasure();

	if ( typeof window.ResizeObserver !== 'undefined' ) {
		new window.ResizeObserver( remeasure ).observe( content );
	}

	nextButton?.addEventListener( 'click', ( e ) => {
		e.preventDefault();
		content.scroll( {
			left: content.scrollLeft + scrollBy,
			behavior: 'smooth',
		} );
	} );

	prevButton?.addEventListener( 'click', ( e ) => {
		e.preventDefault();
		content.scroll( {
			left: content.scrollLeft - scrollBy,
			behavior: 'smooth',
		} );
	} );

	let mx = 0;
	let startScrollLeft = 0;

	content.addEventListener( 'mousemove', ( e ) => {
		if ( ! mx ) {
			return;
		}
		content.scrollLeft =
			startScrollLeft + mx - ( e.pageX - content.offsetLeft );
	} );

	content.addEventListener( 'mousedown', ( e ) => {
		startScrollLeft = content.scrollLeft;
		mx = e.pageX - content.offsetLeft;
		content.classList.add( 'dragging' );
	} );

	if ( hasControls ) {
		content.addEventListener( 'scroll', toggleArrows );
	}

	const stopDrag = () => {
		mx = 0;
		content.classList.remove( 'dragging' );
	};

	content.addEventListener( 'mouseup', stopDrag );
	content.addEventListener( 'mouseleave', stopDrag );
}
