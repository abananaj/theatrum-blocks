/**
 * Slider format — shared by theatrum/slider and any core block styled `is-style-ct-slider`
 * (core/query, core/gallery). Ports example.html's showSlides/plusSlides/currentSlide (the
 * original theatrum/slider view.js this was extracted from), but toggles `.is-active` instead of
 * inline `style.display`, and builds the badge/dots/arrows from the live DOM for core blocks that don't ship them.
 */

import { __ } from '@wordpress/i18n';
import { resolveTrack } from './resolve-track';
import { fitArrows } from './fit-arrows';

function buildArrow( direction, glyph ) {
	const button = document.createElement( 'button' );
	button.type = 'button';
	button.className = `tm-slider-arrow tm-slider-${ direction }`;
	button.setAttribute(
		'aria-label',
		direction === 'prev'
			? __( 'Previous', 'theatrum-blocks' )
			: __( 'Next', 'theatrum-blocks' )
	);
	button.textContent = glyph;
	return button;
}

/**
 * @param {HTMLElement} root Root element to scan/hydrate (`.tm-slider` for
 *                           the native block, or any `is-style-ct-slider`
 *                           core block).
 */
function buildPauseButton() {
	const button = document.createElement( 'button' );
	button.type = 'button';
	button.className = 'tm-slider-pause';
	return button;
}

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

	fitArrows( root, 'tm-slider-arrows-auto-inside', [
		'tm-slider-arrows-inside',
		'tm-slider-arrows-hidden',
	] );

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
		dot.setAttribute(
			'aria-label',
			// translators: %1$d: slide number, %2$d: slide count.
			__( 'Slide %1$d of %2$d', 'theatrum-blocks' )
				.replace( '%1$d', index + 1 )
				.replace( '%2$d', slides.length )
		);
		dotsContainer.appendChild( dot );
		return dot;
	} );

	let currentIndex = 0;
	let autoplayTimer = null;
	let paused = false;
	const autoplaySpeed = parseInt( root.dataset.autoplaySpeed, 10 ) || 5000;
	const wantsAutoplay = root.dataset.autoplay === 'true' && slides.length > 1;
	// WCAG 2.3.3: an autoplaying slideshow is motion the user can't control, so it starts paused for reduced-motion users; the toggle lets them opt in.
	const reducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	// WCAG 2.2.2: a visible pause/play control for anything that auto-advances.
	let pauseButton = root.querySelector( '.tm-slider-pause' );
	if ( wantsAutoplay && ! pauseButton ) {
		pauseButton = buildPauseButton();
		dotsContainer.append( pauseButton );
	}

	const activate = ( index ) => {
		currentIndex = ( index + slides.length ) % slides.length;

		slides.forEach( ( slide, i ) => {
			slide.classList.toggle( 'is-active', i === currentIndex );
		} );
		dots.forEach( ( dot, i ) => {
			dot.classList.toggle( 'is-active', i === currentIndex );
			if ( i === currentIndex ) {
				dot.setAttribute( 'aria-current', 'true' );
			} else {
				dot.removeAttribute( 'aria-current' );
			}
		} );
	};

	const stopAutoplay = () => {
		if ( autoplayTimer ) {
			clearInterval( autoplayTimer );
			autoplayTimer = null;
		}
	};

	const startAutoplay = () => {
		stopAutoplay();
		if ( wantsAutoplay && ! paused ) {
			autoplayTimer = setInterval(
				() => activate( currentIndex + 1 ),
				autoplaySpeed
			);
		}
	};

	// Manual navigation resets the timer so the next auto-advance is a full interval away; a no-op while paused.
	const restartAutoplay = () => {
		if ( autoplayTimer ) {
			startAutoplay();
		}
	};

	const syncPauseButton = () => {
		if ( ! pauseButton ) {
			return;
		}
		pauseButton.setAttribute( 'aria-pressed', String( paused ) );
		pauseButton.setAttribute(
			'aria-label',
			paused
				? __( 'Play slideshow', 'theatrum-blocks' )
				: __( 'Pause slideshow', 'theatrum-blocks' )
		);
		pauseButton.textContent = paused ? '▶' : '❚❚';
	};

	pauseButton?.addEventListener( 'click', () => {
		paused = ! paused;
		if ( paused ) {
			stopAutoplay();
		} else {
			startAutoplay();
		}
		syncPauseButton();
	} );

	// Keyboard users tabbing through the arrows/dots shouldn't have the slide change under them.
	root.addEventListener( 'focusin', stopAutoplay );
	root.addEventListener( 'focusout', ( e ) => {
		if ( ! root.contains( e.relatedTarget ) && ! paused ) {
			startAutoplay();
		}
	} );

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

	// Announce the widget as a carousel without stepping on an author-set role.
	if ( ! root.hasAttribute( 'role' ) ) {
		root.setAttribute( 'role', 'region' );
	}
	root.setAttribute(
		'aria-roledescription',
		__( 'carousel', 'theatrum-blocks' )
	);

	root.classList.add( 'is-ready' );
	activate( 0 );

	if ( wantsAutoplay ) {
		paused = reducedMotion;
		syncPauseButton();
		startAutoplay();
	}
}
