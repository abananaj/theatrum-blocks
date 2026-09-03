/**
 * Front-end behavior for the Tabs block.
 *
 * Desktop: headers in a row, click swaps the visible panel (CSS flex `order`, style.scss).
 * Mobile: same markup reads as a vertical accordion. One click handler drives both since
 * only one tab/panel is ever active.
 */
window.addEventListener( 'load', () => {
	const groups = document.querySelectorAll( '.ct-tabs' );
	let tabIdSeed = 0;

	for ( const group of groups ) {
		const items = Array.from(
			group.querySelectorAll( ':scope > .ct-tab' )
		);

		const parts = items
			.map( ( item ) => ( {
				header: item.querySelector( '.ct-tab__header' ),
				panel: item.querySelector( '.ct-tab__panel' ),
			} ) )
			.filter( ( part ) => part.header && part.panel );

		if ( ! parts.length ) {
			continue;
		}
		tabIdSeed += 1;

		const activate = ( index ) => {
			parts.forEach( ( part, i ) => {
				const isActive = i === index;
				part.header.classList.toggle( 'is-active', isActive );
				part.header.setAttribute(
					'aria-expanded',
					isActive ? 'true' : 'false'
				);
				part.panel.classList.toggle( 'is-active', isActive );
			} );
		};

		parts.forEach( ( part, i ) => {
			// Header ↔ panel wiring so AT can announce what each toggle controls.
			if ( ! part.panel.id ) {
				part.panel.id = `ct-tab-panel-${ tabIdSeed }-${ i }`;
			}
			if ( ! part.header.id ) {
				part.header.id = `ct-tab-header-${ tabIdSeed }-${ i }`;
			}
			part.header.setAttribute( 'aria-controls', part.panel.id );
			part.panel.setAttribute( 'aria-labelledby', part.header.id );
			part.header.setAttribute( 'aria-expanded', 'false' );
			part.header.addEventListener( 'click', () => activate( i ) );

			// Header is a `div[role="button"]` (can't contain headings like a <button>), so
			// Enter/Space activation must be wired manually — not automatic like a real <button>.
			part.header.addEventListener( 'keydown', ( event ) => {
				if ( event.key === 'Enter' || event.key === ' ' ) {
					event.preventDefault();
					activate( i );
				}
			} );
		} );

		// Hand control to JS: the CSS "first panel open" fallback stops once .is-ready is set.
		group.classList.add( 'is-ready' );
		activate( 0 );
	}
} );
