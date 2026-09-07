/**
 * Front-end behaviour for the Expanding Card block. Click (not hover — hover-only breaks on
 * touch) toggles the card's body. The click target is the whole card, not just the heading —
 * visitors expect the image and the collapsed sliver of content to be clickable too — except for
 * real interactive descendants (links, buttons, form controls) once the card is open, which need
 * to behave normally rather than also toggling the card.
 *
 * The card is seeded (edit.js's TEMPLATE) as two `core/group`s — `__header` (stays put) and
 * `__body` (what opens) — the same split `theatrum/card-scroll` uses, so a card authored today is
 * found by class rather than by position. Content saved before that split is a flat heading +
 * paragraph run with no groups at all; for that shape this falls back to the original heuristic —
 * the first heading in `__content`, and everything after it — so it keeps working unmigrated.
 *
 * Either way, the heading's text moves into a real <button> (`<h3><button>` is the WAI-ARIA
 * accordion shape, and a real button gives Enter/Space activation for free). Doing that at
 * runtime rather than in save() keeps ids out of the saved markup, so multiple instances on a page
 * never collide — the same reason theatrum/tabs assigns its ARIA here.
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

		const headerGroup = content.querySelector(
			':scope > .wp-block-theatrum-card-expanding__header'
		);
		const bodyGroup = content.querySelector(
			':scope > .wp-block-theatrum-card-expanding__body'
		);

		let heading;
		let collapse;

		if ( headerGroup && bodyGroup ) {
			heading = headerGroup.querySelector( 'h1, h2, h3, h4, h5, h6' );
			collapse = bodyGroup;
		} else {
			const children = Array.from( content.children );
			const flatHeading = children.find( ( child ) =>
				/^H[1-6]$/.test( child.tagName )
			);
			const body = flatHeading
				? children.slice( children.indexOf( flatHeading ) + 1 )
				: [];

			if ( flatHeading && body.length ) {
				heading = flatHeading;
				collapse = document.createElement( 'div' );
				heading.after( collapse );
				body.forEach( ( element ) => collapse.appendChild( element ) );
			}
		}

		// No heading, or nothing to disclose: leave the card open.
		if ( ! heading || ! collapse ) {
			return;
		}

		idSeed += 1;

		collapse.classList.add( 'wp-block-theatrum-card-expanding__collapse' );
		collapse.id = `card-expanding-collapse-${ idSeed }`;

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

		// Delegated to the card rather than just the trigger, so the image and the rest of the
		// card are clickable too. A real link/button/form control elsewhere on the card (most
		// likely inside the opened body) is left to behave normally instead of also toggling —
		// unless it IS the trigger, whose own click should still toggle.
		card.addEventListener( 'click', ( event ) => {
			const interactiveAncestor = event.target.closest(
				'a[href], button, input, select, textarea'
			);

			if ( interactiveAncestor && interactiveAncestor !== trigger ) {
				return;
			}

			toggle();
		} );

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
