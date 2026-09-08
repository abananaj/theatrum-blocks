/**
 * Front-end behaviour for the Expand Card block, along two independent axes:
 *
 *   - Reveal Style (a wrapper class, `is-overlay` or absent) picks which of the two algorithms
 *     below wires up each card — `setUpExpandCard` (the body grows open beneath a heading that
 *     stays put) or `setUpOverlayCard` (the whole header+body panel slides up to cover the image).
 *     They share only the outer loop and an `idSeed` counter threaded between them so ids never
 *     collide across a page mixing both styles.
 *   - Activate On (`is-hover`, or absent) picks what triggers the reveal. Click mode is the default
 *     and unchanged: the card is a disclosure with a real trigger and full ARIA state. Hover mode
 *     reveals on pointer-over and on focus instead, and deliberately drops that ARIA — see
 *     `wireHoverReveal` below.
 *
 * Either way an open card also collapses when a click lands outside it, which is what the shared
 * `collapsers` registry at the bottom of this file is for.
 */

/**
 * Every wired card's "close, whatever state you are in", for the document-level outside-click
 * handler in the load listener. One shared listener over a registry rather than theatrum/popover's
 * one-listener-per-element shape, since a page of these can hold a great many cards.
 *
 * @type {Array<{card: HTMLElement, collapse: Function}>}
 */
const collapsers = [];

/**
 * Hover mode's event wiring, shared by both reveal styles: the pointer entering the card reveals
 * it, leaving hides it again, and `focusin`/`focusout` give the keyboard the same reveal — the
 * pairing theatrum/list-thumbnail already uses for its own hover effect. `relatedTarget` is where
 * focus is heading, so a move *within* the card (into a link in the opened body, say) isn't
 * treated as leaving it.
 *
 * Nothing here touches ARIA. Hover mode has no trigger to press, so there is no disclosure to
 * describe: the content stays in the accessibility tree in both states and the reveal is purely
 * visual — which is also why the callers skip `aria-expanded`/`aria-hidden` entirely rather than
 * announcing a control a visitor cannot operate.
 *
 * @param {HTMLElement} card        The card element.
 * @param {Function}    setExpanded The card's own open/close function.
 */
function wireHoverReveal( card, setExpanded ) {
	card.addEventListener( 'mouseenter', () => setExpanded( true ) );
	card.addEventListener( 'mouseleave', () => setExpanded( false ) );
	card.addEventListener( 'focusin', () => setExpanded( true ) );
	card.addEventListener( 'focusout', ( event ) => {
		if ( ! card.contains( event.relatedTarget ) ) {
			setExpanded( false );
		}
	} );
}

/**
 * Expand mode: the card's body opens beneath a heading that stays put.
 *
 * The card is seeded (edit.js's TEMPLATE) as two `core/group`s — `__header` (stays put) and
 * `__body` (what opens) — the same split `theatrum/card-scroll` uses, so a card authored today is
 * found by class rather than by position. The header doesn't have to hold a heading — the first
 * `h1`–`h6` inside it becomes the trigger when there is one, and the whole header group stands in
 * for it otherwise, so any content is enough. Content saved before the header/body split is a flat
 * heading + paragraph run with no groups at all; for that shape this falls back to the original
 * heuristic — the first heading in `__content`, and everything after it — so it keeps working
 * unmigrated (and does still require an actual heading, since there's no group boundary to lean on
 * instead).
 *
 * In click mode (the default) the trigger's contents move into a real <button> (`<h3><button>` is
 * the WAI-ARIA accordion shape, and a real button gives Enter/Space activation for free). Doing
 * that at runtime rather than in save() keeps ids out of the saved markup, so multiple instances on
 * a page never collide — the same reason theatrum/tabs assigns its ARIA here. Clicking is delegated
 * to the whole card, not just the heading — visitors expect the image and the collapsed sliver of
 * content to be clickable too — except for real interactive descendants (links, buttons, form
 * controls) once the card is open, which need to behave normally rather than also toggling.
 *
 * In hover mode none of that trigger machinery is built: there is nothing to press, so the heading
 * is left exactly as authored and the reveal comes from `wireHoverReveal` instead. Everything
 * structural — finding the header/body, tagging `__collapse` — happens either way, since that is
 * what style.scss animates.
 *
 * `.is-ready` gates the collapsed-by-default CSS (style.scss): before this script runs the whole
 * card is visible, so the no-JS fallback is a complete card rather than a clipped one.
 *
 * @param {HTMLElement} card     The card element.
 * @param {number}      idSeed   The id counter, shared with setUpOverlayCard.
 * @param {boolean}     useHover Reveal on hover/focus instead of on click.
 * @return {number} The updated id counter.
 */
function setUpExpandCard( card, idSeed, useHover ) {
	const content = card.querySelector(
		'.wp-block-theatrum-card-expand__content'
	);

	if ( ! content ) {
		return idSeed;
	}

	const headerGroup = content.querySelector(
		':scope > .wp-block-theatrum-card-expand__header'
	);
	const bodyGroup = content.querySelector(
		':scope > .wp-block-theatrum-card-expand__body'
	);

	// What becomes the trigger: a heading when there is one, or (inside the header/body shape)
	// the whole header group when there isn't — never just "the heading" once a header can hold
	// anything.
	let triggerSource;
	let collapse;

	if ( headerGroup && bodyGroup ) {
		triggerSource =
			headerGroup.querySelector( 'h1, h2, h3, h4, h5, h6' ) ||
			headerGroup;
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
			triggerSource = flatHeading;
			collapse = document.createElement( 'div' );
			triggerSource.after( collapse );
			body.forEach( ( element ) => collapse.appendChild( element ) );
		}
	}

	// No header content (or, for the flat legacy shape, no heading), or nothing to disclose:
	// leave the card open.
	if ( ! triggerSource || ! collapse ) {
		return idSeed;
	}

	collapse.classList.add( 'wp-block-theatrum-card-expand__collapse' );

	// Click mode only: everything from here to the end of the branch exists to make the heading a
	// real, announced disclosure control. Hover mode has no control, so it mints no id either.
	let trigger = null;
	let hasInteractiveContent = null;

	if ( ! useHover ) {
		idSeed += 1;
		collapse.id = `card-expand-collapse-${ idSeed }`;

		triggerSource.classList.add( 'wp-block-theatrum-card-expand__heading' );

		// Content that already contains a link (or any other control) can't have its contents moved
		// into a <button> — nesting interactive elements is invalid and breaks both. Those fall back
		// to the div[role="button"] treatment theatrum/tabs uses, which needs its keyboard activation
		// wired by hand.
		hasInteractiveContent = triggerSource.querySelector(
			'a[href], button, input, select, textarea'
		);

		if ( hasInteractiveContent ) {
			trigger = triggerSource;
			trigger.setAttribute( 'role', 'button' );
			trigger.setAttribute( 'tabindex', '0' );
		} else {
			trigger = document.createElement( 'button' );
			trigger.type = 'button';
			trigger.className = 'wp-block-theatrum-card-expand__trigger';
			while ( triggerSource.firstChild ) {
				trigger.appendChild( triggerSource.firstChild );
			}
			triggerSource.appendChild( trigger );
		}

		trigger.setAttribute( 'aria-controls', collapse.id );
		trigger.setAttribute( 'aria-expanded', 'false' );
	}

	// Explicitly stated rather than toggled, since hovering out and the outside-click handler both
	// need "closed, whatever you were".
	const setExpanded = ( isExpanded ) => {
		card.classList.toggle( 'is-expanded', isExpanded );
		collapse.style.height = isExpanded
			? `${ collapse.scrollHeight }px`
			: '';

		if ( trigger ) {
			trigger.setAttribute(
				'aria-expanded',
				isExpanded ? 'true' : 'false'
			);
		}
	};

	const toggle = () =>
		setExpanded( ! card.classList.contains( 'is-expanded' ) );

	if ( useHover ) {
		wireHoverReveal( card, setExpanded );
	} else {
		// Delegated to the card rather than just the trigger, so the image and the rest of the card
		// are clickable too. A real link/button/form control elsewhere on the card (most likely
		// inside the opened body) is left to behave normally instead of also toggling — unless it IS
		// the trigger, whose own click should still toggle.
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
	}

	collapsers.push( { card, collapse: () => setExpanded( false ) } );

	card.classList.add( 'is-ready' );

	return idSeed;
}

/**
 * Overlay mode: the content panel — header and body together — slides up over the image. Collapsed,
 * the panel is parked with only its header showing below the image, so the card reads the same as
 * an Expand one until it's opened.
 *
 * In click mode the whole card is the click target, matching Expand mode's convention, except for
 * real interactive descendants (links, buttons, form controls) inside the opened body, which need
 * to behave normally rather than also toggling. Because the header travels with the body instead of
 * staying put, it can't become a real `<button>` the way Expand mode's heading does — the whole
 * `__frame` becomes the accessible control instead (`role="button"`, keyboard-activatable), and its
 * `aria-label` borrows the header's text so a screen reader announces the card by its title.
 * `__body` is `aria-hidden` while collapsed, so the part that's below the fold stays out of reading
 * order until it's open; the header, on show in both states, never is.
 *
 * In hover mode the frame is left as a plain element — no role, no tabindex, no `aria-expanded`,
 * and no `aria-hidden` on the body — because there is no control to press and the reveal is only
 * visual. The header measurement below still runs, since that is what parks the panel at all.
 *
 * `.is-ready` gates the fixed-frame/overlay CSS (style.scss): before this script runs, the image
 * sits at its natural height with the content following normally below it, so the no-JS fallback
 * is a complete card rather than one with unreachable content.
 *
 * @param {HTMLElement} card     The card element.
 * @param {number}      idSeed   The id counter, shared with setUpExpandCard.
 * @param {boolean}     useHover Reveal on hover/focus instead of on click.
 * @return {number} The updated id counter.
 */
function setUpOverlayCard( card, idSeed, useHover ) {
	const frame = card.querySelector(
		':scope > .wp-block-theatrum-card-expand__frame'
	);

	if ( ! frame ) {
		return idSeed;
	}

	const content = frame.querySelector(
		':scope > .wp-block-theatrum-card-expand__content'
	);

	if ( ! content ) {
		return idSeed;
	}

	const headerGroup = content.querySelector(
		':scope > .wp-block-theatrum-card-expand__header'
	);
	const bodyGroup = content.querySelector(
		':scope > .wp-block-theatrum-card-expand__body'
	);
	const label = headerGroup ? headerGroup.textContent.trim() : '';

	// How far up the panel is parked while collapsed, and how much room the frame keeps under the
	// image for it (style.scss). Measured rather than guessed: the header is whatever blocks the
	// author put there, at whatever the card's width makes them wrap to. Re-measured on resize,
	// since a heading that rewraps changes the strip's height — observing the header itself rather
	// than the window also catches a late web font or an image loading inside it.
	if ( headerGroup ) {
		const syncHeaderHeight = () =>
			card.style.setProperty(
				'--theatrum-card-expand-header-height',
				`${ headerGroup.offsetHeight }px`
			);

		syncHeaderHeight();

		if ( window.ResizeObserver ) {
			new window.ResizeObserver( syncHeaderHeight ).observe(
				headerGroup
			);
		} else {
			window.addEventListener( 'resize', syncHeaderHeight );
		}
	}

	// What's actually disclosed is the body: the header shows in both states, so it must stay out
	// of any `aria-hidden`. Without a body group there's nothing holding the panel up either — the
	// whole of it is below the fold while collapsed, so the panel itself is the region; and with a
	// header but no body there is nothing hidden to mark at all.
	const panel = bodyGroup || ( headerGroup ? null : content );

	// Click mode only — hover mode has no control to describe, so the frame stays a plain element.
	if ( ! useHover ) {
		frame.setAttribute( 'role', 'button' );
		frame.setAttribute( 'tabindex', '0' );
		frame.setAttribute( 'aria-expanded', 'false' );

		if ( panel ) {
			idSeed += 1;
			panel.id = `card-expand-panel-${ idSeed }`;
			panel.setAttribute( 'aria-hidden', 'true' );
			frame.setAttribute( 'aria-controls', panel.id );
		}

		if ( label ) {
			frame.setAttribute( 'aria-label', label );
		}
	}

	// Explicitly stated rather than toggled, since hovering out and the outside-click handler both
	// need "closed, whatever you were".
	const setExpanded = ( isExpanded ) => {
		card.classList.toggle( 'is-expanded', isExpanded );

		if ( useHover ) {
			return;
		}

		frame.setAttribute( 'aria-expanded', isExpanded ? 'true' : 'false' );

		if ( panel ) {
			panel.setAttribute( 'aria-hidden', isExpanded ? 'false' : 'true' );
		}
	};

	if ( useHover ) {
		wireHoverReveal( card, setExpanded );
	} else {
		// Delegated to the card, not just the frame, so the whole card is clickable. A real
		// link/button/form control — most likely inside the opened body — is left to behave normally
		// instead of also toggling. Unlike Expand mode, the trigger (`frame`) is never itself a real
		// `<button>`, so it never matches this selector and needs no exception.
		card.addEventListener( 'click', ( event ) => {
			if (
				event.target.closest(
					'a[href], button, input, select, textarea'
				)
			) {
				return;
			}

			setExpanded( ! card.classList.contains( 'is-expanded' ) );
		} );

		frame.addEventListener( 'keydown', ( event ) => {
			if ( event.key === 'Enter' || event.key === ' ' ) {
				event.preventDefault();
				setExpanded( ! card.classList.contains( 'is-expanded' ) );
			}
		} );
	}

	collapsers.push( { card, collapse: () => setExpanded( false ) } );

	card.classList.add( 'is-ready' );

	return idSeed;
}

window.addEventListener( 'load', () => {
	const cards = document.querySelectorAll( '.wp-block-theatrum-card-expand' );
	let idSeed = 0;

	cards.forEach( ( card ) => {
		// Hover is only wired where a pointer can actually hover. A touch device gets click mode
		// instead, so the body never becomes unreachable there; a tap on a linked image still
		// follows the link, since click mode already leaves real controls alone.
		const useHover =
			card.classList.contains( 'is-hover' ) &&
			window.matchMedia( '(hover: hover)' ).matches;

		idSeed = card.classList.contains( 'is-overlay' )
			? setUpOverlayCard( card, idSeed, useHover )
			: setUpExpandCard( card, idSeed, useHover );
	} );

	if ( ! collapsers.length ) {
		return;
	}

	// A click inside a card reaches that card's own handler first and this one second, so the card
	// clicked keeps whatever state it just took while every other open card closes — one card open
	// at a time, and a click on the page around them closes the lot.
	document.addEventListener( 'click', ( event ) => {
		collapsers.forEach( ( { card, collapse } ) => {
			if ( ! card.contains( event.target ) ) {
				collapse();
			}
		} );
	} );
} );
