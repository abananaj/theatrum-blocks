/**
 * Front-end behavior for the Slider block.
 *
 * Ports example.html's showSlides/plusSlides/currentSlide, but toggles a
 * `.is-active` class (matching production-tabs/view.js's convention)
 * instead of inline `style.display`, and builds the numbertext badge + dot
 * navigation from the live DOM (slide count) instead of hardcoding them,
 * since the number of chance/slider-item children is up to the editor.
 */
window.addEventListener( 'load', () => {
	const sliders = document.querySelectorAll( '.ct-slider' );

	for ( const slider of sliders ) {
		const slides = Array.from(
			slider.querySelectorAll(
				':scope > .ct-slider-wrapper > .ct-slider-track > .ct-slider-slide'
			)
		);

		if ( ! slides.length ) {
			continue;
		}

		const prevButton = slider.querySelector( '.ct-slider-prev' );
		const nextButton = slider.querySelector( '.ct-slider-next' );
		const dotsContainer = slider.querySelector( '.ct-slider-dots' );

		// Numbertext badges, one per slide.
		slides.forEach( ( slide, index ) => {
			if ( slide.querySelector( ':scope > .ct-slider-slide__number' ) ) {
				return;
			}
			const badge = document.createElement( 'div' );
			badge.className = 'ct-slider-slide__number';
			badge.textContent = `${ index + 1 } / ${ slides.length }`;
			slide.prepend( badge );
		} );

		// Dot navigation, one per slide.
		const dots = slides.map( ( slide, index ) => {
			const dot = document.createElement( 'span' );
			dot.className = 'ct-slider-dot';
			dot.setAttribute( 'role', 'button' );
			dot.setAttribute( 'tabindex', '0' );
			dot.setAttribute( 'aria-label', `${ index + 1 }` );
			dotsContainer?.appendChild( dot );
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
				parseInt( slider.dataset.autoplaySpeed, 10 ) || 5000
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

		slider.classList.add( 'is-ready' );
		activate( 0 );

		if ( slider.dataset.autoplay === 'true' && slides.length > 1 ) {
			autoplayTimer = setInterval(
				() => activate( currentIndex + 1 ),
				parseInt( slider.dataset.autoplaySpeed, 10 ) || 5000
			);
		}
	}
} );
