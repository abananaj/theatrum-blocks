/**
 * Slider format — shared by theatrum/slider (native block) and any core block
 * styled `is-style-ct-slider` (core/query, core/gallery).
 *
 * Ports example.html's showSlides/plusSlides/currentSlide (see the original
 * theatrum/slider view.js this was extracted from), but toggles a `.is-active`
 * class instead of inline `style.display`, and builds the numbertext badge,
 * dot navigation, and (for core blocks, which don't ship them in markup)
 * the arrow buttons and dots container from the live DOM.
 */

import { resolveTrack } from './resolve-track';

function buildArrow( direction, glyph ) {
	const button = document.createElement( 'button' );
	button.type = 'button';
	button.className = `ct-slider-arrow ct-slider-${ direction }`;
	button.setAttribute(
		'aria-label',
		direction === 'prev' ? 'Previous' : 'Next'
	);
	button.textContent = glyph;
	return button;
}

/**
 * @param {HTMLElement} root Root element to scan/hydrate (`.ct-slider` for
 *                           the native block, or any `is-style-ct-slider`
 *                           core block).
 */
export function initSlider( root ) {
	const track =
		root.querySelector( '.ct-slider-track' ) ?? resolveTrack( root );
	const slides = track ? Array.from( track.children ) : [];

	if ( ! slides.length ) {
		return;
	}

	// A "1 / 5" badge belongs on native slider slides, not stamped onto
	// arbitrary post cards or gallery images.
	const isNativeSlider = root.classList.contains( 'ct-slider' );

	let prevButton = root.querySelector( '.ct-slider-prev' );
	let nextButton = root.querySelector( '.ct-slider-next' );
	let dotsContainer = root.querySelector( '.ct-slider-dots' );

	if ( ! prevButton && ! nextButton ) {
		prevButton = buildArrow( 'prev', '❮' );
		nextButton = buildArrow( 'next', '❯' );
		root.prepend( prevButton );
		root.append( nextButton );
	}

	if ( ! dotsContainer ) {
		dotsContainer = document.createElement( 'div' );
		dotsContainer.className = 'ct-slider-dots';
		root.append( dotsContainer );
	}

	if ( isNativeSlider ) {
		slides.forEach( ( slide, index ) => {
			if (
				slide.querySelector( ':scope > .theatrum-slider-slide__number' )
			) {
				return;
			}
			const badge = document.createElement( 'div' );
			badge.className = 'theatrum-slider-slide__number';
			badge.textContent = `${ index + 1 } / ${ slides.length }`;
			slide.prepend( badge );
		} );
	}

	// Dot navigation, one per slide.
	const dots = slides.map( ( slide, index ) => {
		const dot = document.createElement( 'span' );
		dot.className = 'theatrum-slider-dot';
		dot.setAttribute( 'role', 'button' );
		dot.setAttribute( 'tabindex', '0' );
		dot.setAttribute( 'aria-label', `${ index + 1 }` );
		dotsContainer.appendChild( dot );
		return dot;
	} );

	let currentIndex = 0;
	let autoplayTimer = null;

	const activate = ( index ) => {
		currentIndex = ( index + slides.length ) % slides.length;

		slides.forEach( ( slide, i ) => {
			slide.classList.toggle( 'is-active', i === currentIndex );
		} );
		dots.forEach( ( dot, i ) => {
			dot.classList.toggle( 'is-active', i === currentIndex );
		} );
	};

	const restartAutoplay = () => {
		if ( ! autoplayTimer ) {
			return;
		}
		clearInterval( autoplayTimer );
		autoplayTimer = setInterval(
			() => activate( currentIndex + 1 ),
			parseInt( root.dataset.autoplaySpeed, 10 ) || 5000
		);
	};

	prevButton?.addEventListener( 'click', ( e ) => {
		e.preventDefault();
		activate( currentIndex - 1 );
		restartAutoplay();
	} );

	nextButton?.addEventListener( 'click', ( e ) => {
		e.preventDefault();
		activate( currentIndex + 1 );
		restartAutoplay();
	} );

	dots.forEach( ( dot, index ) => {
		const goToDot = () => {
			activate( index );
			restartAutoplay();
		};
		dot.addEventListener( 'click', goToDot );
		dot.addEventListener( 'keydown', ( e ) => {
			if ( e.key === 'Enter' || e.key === ' ' ) {
				e.preventDefault();
				goToDot();
			}
		} );
	} );

	root.classList.add( 'is-ready' );
	activate( 0 );

	if ( root.dataset.autoplay === 'true' && slides.length > 1 ) {
		autoplayTimer = setInterval(
			() => activate( currentIndex + 1 ),
			parseInt( root.dataset.autoplaySpeed, 10 ) || 5000
		);
	}
}
