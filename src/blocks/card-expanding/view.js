/**
 * Front-end behaviour for the Expanding Card block. Click (not hover — hover-only breaks on
 * touch) toggles everything below the card's heading.
 *
 * The card saves as its image plus a bare list of nested blocks, so the disclosure structure is
 * assembled here:
 * the heading's text moves into a real <button> (`<h3><button>` is the WAI-ARIA accordion shape,
 * and a real button gives Enter/Space activation for free), and the blocks after it are wrapped in
 * one element that can actually be height-animated. Doing it at runtime rather than in save() also
 * keeps ids out of the saved markup, so multiple instances on a page never collide — the same
 * reason theatrum/tabs assigns its ARIA here.
 *
 * `.is-ready` gates the collapsed-by-default CSS (style.scss): before this script runs the whole
 * card is visible, so the no-JS fallback is a complete card rather than a clipped one.
 */
window.addEventListener( 'load', () => {
	const cards = document.querySelectorAll(
		'.wp-block-theatrum-card-expanding'
	);
	let idSeed = 0;

	cards.forEach( ( card ) => {
		const content = card.querySelector(
			'.wp-block-theatrum-card-expanding__content'
		);

		if ( ! content ) {
			return;
		}

		const children = Array.from( content.children );
		const heading = children.find( ( child ) =>
			/^H[1-6]$/.test( child.tagName )
		);

		// No heading, or nothing below it: there's nothing to disclose, so leave the card open.
		if ( ! heading ) {
			return;
		}

		const body = children.slice( children.indexOf( heading ) + 1 );

		if ( ! body.length ) {
			return;
		}

		idSeed += 1;

		const collapse = document.createElement( 'div' );
		collapse.className = 'wp-block-theatrum-card-expanding__collapse';
		collapse.id = `card-expanding-collapse-${ idSeed }`;
		heading.after( collapse );
		body.forEach( ( element ) => collapse.appendChild( element ) );

		heading.classList.add( 'wp-block-theatrum-card-expanding__heading' );

		// A heading that already contains a link (or any other control) can't have its contents
		// moved into a <button> — nesting interactive elements is invalid and breaks both. Those
		// headings fall back to the div[role="button"] treatment theatrum/tabs uses, which needs
		// its keyboard activation wired by hand.
		const hasInteractiveContent = heading.querySelector(
			'a[href], button, input, select, textarea'
		);
		let trigger;

		if ( hasInteractiveContent ) {
			trigger = heading;
			trigger.setAttribute( 'role', 'button' );
			trigger.setAttribute( 'tabindex', '0' );
		} else {
			trigger = document.createElement( 'button' );
			trigger.type = 'button';
			trigger.className = 'wp-block-theatrum-card-expanding__trigger';
			while ( heading.firstChild ) {
				trigger.appendChild( heading.firstChild );
			}
			heading.appendChild( trigger );
		}

		trigger.setAttribute( 'aria-controls', collapse.id );
		trigger.setAttribute( 'aria-expanded', 'false' );

		const toggle = () => {
			const isExpanded = card.classList.toggle( 'is-expanded' );
			trigger.setAttribute(
				'aria-expanded',
				isExpanded ? 'true' : 'false'
			);
			collapse.style.height = isExpanded
				? `${ collapse.scrollHeight }px`
				: '';
		};

		trigger.addEventListener( 'click', toggle );

		if ( hasInteractiveContent ) {
			trigger.addEventListener( 'keydown', ( event ) => {
				if ( event.key === 'Enter' || event.key === ' ' ) {
					event.preventDefault();
					toggle();
				}
			} );
		}

		card.classList.add( 'is-ready' );
	} );
} );
