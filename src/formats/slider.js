/**
 * Slider format — shared by theatrum/slider and any core block styled `is-style-ct-slider`
 * (core/query, core/gallery). Ports example.html's showSlides/plusSlides/currentSlide (the
 * original theatrum/slider view.js this was extracted from), but toggles `.is-active` instead of
 * inline `style.display`, and builds the badge/dots/arrows from the live DOM for core blocks that don't ship them.
 */

import { resolveTrack } from './resolve-track';

function buildArrow( direction, glyph ) {
	const button = document.createElement( 'button' );
	button.type = 'button';
	button.className = `tm-slider-arrow tm-slider-${ direction }`;
	button.setAttribute(
		'aria-label',
		direction === 'prev' ? 'Previous' : 'Next'
	);
	button.textContent = glyph;
	return button;
}

/**
 * @param {HTMLElement} root Root element to scan/hydrate (`.tm-slider` for
 *                           the native block, or any `is-style-ct-slider`
 *                           core block).
 */
export function initSlider( root ) {
	const track =
		root.querySelector( '.tm-slider-track' ) ?? resolveTrack( root );
	const slides = track ? Array.from( track.children ) : [];

	if ( ! slides.length ) {
		return;
	}

	// `loading="eager"` (inc/slider-eager-images.php) fetches every slide's image right away, but
	// fetching and decoding are separate costs: Chromium defers decoding an off-screen
	// (display:none) image until revealed, even after full download, causing a flash on first
	// show. Force every slide's image(s) to decode immediately, before any are shown.
	slides.forEach( ( slide ) => {
		slide.querySelectorAll( 'img' ).forEach( ( img ) => {
			if ( typeof img.decode === 'function' ) {
				img.decode().catch( () => {} );
			}
		} );
	} );

	// A "1 / 5" badge belongs on native slider slides, not stamped onto arbitrary post cards or gallery images.
	const isNativeSlider = root.classList.contains( 'tm-slider' );

	let prevButton = root.querySelector( '.tm-slider-prev' );
	let nextButton = root.querySelector( '.tm-slider-next' );
	let dotsContainer = root.querySelector( '.tm-slider-dots' );

	if ( ! prevButton && ! nextButton ) {
		prevButton = buildArrow( 'prev', '❮' );
		nextButton = buildArrow( 'next', '❯' );
		root.prepend( prevButton );
		root.append( nextButton );
	}

	if ( ! dotsContainer ) {
		dotsContainer = document.createElement( 'div' );
		dotsContainer.className = 'tm-slider-dots';
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
