window.addEventListener( 'load', () => {
	const COMPONENT_SELECTOR = '.ct-carousel-wrapper';
	const CONTROLS_SELECTOR = '.ct-carousel-controls';
	const CONTENT_SELECTOR = '.ct-carousel-content';

	for ( const component of document.querySelectorAll( COMPONENT_SELECTOR ) ) {
		const content = component.querySelector( CONTENT_SELECTOR );
		const nextButton = component.querySelector( '.arrow-next' );
		const prevButton = component.querySelector( '.arrow-prev' );
		const hasControls =
			component.querySelector( CONTROLS_SELECTOR ) !== null;

		const maxScrollWidth = content.scrollWidth - content.clientWidth;
		const scrollBy = content.clientWidth / 2;

		if ( maxScrollWidth !== 0 ) {
			component.classList.add( 'has-arrows' );
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

		const toggleArrows = () => {
			nextButton?.classList.toggle(
				'disabled',
				content.scrollLeft >= maxScrollWidth - 10
			);
			prevButton?.classList.toggle(
				'disabled',
				content.scrollLeft <= 10
			);
		};

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
} );
