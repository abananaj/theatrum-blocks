// Popup Block Frontend Script
document.addEventListener( 'DOMContentLoaded', function () {
	// Popups by anchor id, so any trigger anywhere on the page can look one up
	// by the id in its `href="#id"` — the trigger button no longer needs to
	// be a DOM descendant of the popup.
	const popups = new Map();

	// How many popups are currently open, so closing one doesn't clear the
	// body scroll lock while another is still open.
	let openCount = 0;

	// Pass A: find every popup, portal its dialog/backdrop to <body>, and
	// register it by id.
	document
		.querySelectorAll( '.wp-block-theatrum-popup' )
		.forEach( ( wrapper ) => {
			const id = wrapper.id;
			if ( ! id ) {
				return;
			}

			const popupDialog = wrapper.querySelector(
				'[data-popup-content="true"]'
			);
			const backdrop = wrapper.querySelector(
				'[data-popup-backdrop="true"]'
			);
			if ( ! popupDialog || ! backdrop ) {
				return;
			}

			// Move the dialog/backdrop to a direct child of <body>. Left in
			// place, they'd inherit whatever containing block their
			// ancestors create — any ancestor with transform/filter/
			// will-change/contain turns their position: fixed into "fixed
			// relative to that ancestor" instead of the viewport, so the
			// dialog scrolls with the page instead of staying centered.
			// Escaping to <body> makes that impossible regardless of what
			// wraps the block on a given page.
			const portal = document.createElement( 'div' );
			portal.className = 'popup-portal';
			portal.append( backdrop, popupDialog );
			document.body.append( portal );

			const popup = {
				dialog: popupDialog,
				backdrop,
				triggers: [],
				lastOpener: null,
			};
			popups.set( id, popup );

			// Auto-open: render.php only emits this attribute when a delay
			// is configured and (if restricted) we're on the front page.
			const autoOpenDelay = parseFloat( wrapper.dataset.autoOpenDelay );
			if ( autoOpenDelay > 0 ) {
				const sessionKey = `theatrum-popup-autoopen-${ id }`;
				let alreadyShown = false;
				try {
					alreadyShown = !! sessionStorage.getItem( sessionKey );
				} catch {
					// sessionStorage unavailable (e.g. some private browsing
					// modes) — fall back to allowing the auto-open.
				}

				if ( ! alreadyShown ) {
					setTimeout( () => {
						try {
							sessionStorage.setItem( sessionKey, '1' );
						} catch {
							// Ignore — worst case it can auto-open again.
						}
						if (
							popupDialog.getAttribute( 'data-state' ) !== 'open'
						) {
							openPopup( popup, null );
						}
					}, autoOpenDelay * 1000 );
				}
			}

			// Backdrop click closes the dialog
			backdrop.addEventListener( 'click', function () {
				closePopup( popup );
			} );

			// Close button inside header
			const closeBtn = popupDialog.querySelector(
				'[data-close-popup="true"]'
			);
			if ( closeBtn ) {
				closeBtn.addEventListener( 'click', function () {
					closePopup( popup );
				} );
			}

			// Trap focus inside open dialog
			popupDialog.addEventListener( 'keydown', function ( e ) {
				if ( e.key !== 'Tab' ) {
					return;
				}
				const focusable = Array.from(
					popupDialog.querySelectorAll(
						'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
					)
				).filter( ( el ) => ! el.closest( '[hidden]' ) );

				if ( focusable.length === 0 ) {
					return;
				}
				const first = focusable[ 0 ];
				const last = focusable[ focusable.length - 1 ];

				if ( e.shiftKey ) {
					if ( document.activeElement === first ) {
						e.preventDefault();
						last.focus();
					}
				} else if ( document.activeElement === last ) {
					e.preventDefault();
					first.focus();
				}
			} );
		} );

	// Pass B: wire up every trigger button. A trigger is any Popup Trigger
	// variation link (`.popup-trigger-button > .wp-block-button__link` /
	// `.popup-trigger-button > .wp-element-button`, depending on which class
	// core's global styles land the button on) whose href hash matches a
	// popup registered above.
	document
		.querySelectorAll(
			'.popup-trigger-button > .wp-block-button__link, .popup-trigger-button > .wp-element-button'
		)
		.forEach( ( trigger ) => {
			const href = trigger.getAttribute( 'href' ) || '';
			if ( ! href.startsWith( '#' ) || href.length < 2 ) {
				return;
			}
			const targetId = href.slice( 1 );
			const popup = popups.get( targetId );
			if ( ! popup ) {
				// Explicit no-op: the button points at an id that isn't a
				// registered popup (typo, deleted popup, or a plain anchor
				// link that isn't meant to open anything).
				return;
			}

			popup.triggers.push( trigger );
			trigger.setAttribute( 'aria-expanded', 'false' );
			trigger.setAttribute( 'aria-haspopup', 'dialog' );

			trigger.addEventListener( 'click', function ( e ) {
				// Without this, the browser's native #anchor handling would
				// scroll to the popup's original, now-empty wrapper div,
				// which still owns that id even after its dialog/backdrop
				// have been portalled away.
				e.preventDefault();
				const isExpanded =
					this.getAttribute( 'aria-expanded' ) === 'true';
				if ( isExpanded ) {
					closePopup( popup );
				} else {
					openPopup( popup, this );
				}
			} );
		} );

	// Escape key closes whichever popup(s) are currently open.
	document.addEventListener( 'keydown', function ( e ) {
		if ( e.key !== 'Escape' ) {
			return;
		}
		popups.forEach( ( popup ) => {
			if ( popup.dialog.getAttribute( 'data-state' ) === 'open' ) {
				const opener = popup.lastOpener;
				closePopup( popup );
				if ( opener ) {
					opener.focus();
				}
			}
		} );
	} );

	/**
	 * Open a popup's dialog
	 * @param {Object}  popup   Registry entry from the `popups` map
	 * @param {Element} trigger The specific trigger element that was clicked
	 */
	function openPopup( popup, trigger ) {
		const { dialog, backdrop, triggers } = popup;
		popup.lastOpener = trigger;

		// Show elements (remove inert)
		dialog.removeAttribute( 'inert' );
		backdrop.removeAttribute( 'inert' );
		triggers.forEach( ( t ) => t.setAttribute( 'aria-expanded', 'true' ) );

		// Lock scroll (only when the first popup opens)
		openCount += 1;
		if ( openCount === 1 ) {
			document.body.style.overflow = 'hidden';
		}

		// Trigger CSS enter animation (double rAF ensures paint before transition)
		requestAnimationFrame( () => {
			requestAnimationFrame( () => {
				dialog.setAttribute( 'data-state', 'open' );
				backdrop.setAttribute( 'data-state', 'open' );
			} );
		} );

		// Move focus into dialog — skip the close button as first focus target
		const focusable = Array.from(
			dialog.querySelectorAll(
				'a[href], button:not([data-close-popup]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)
		);
		if ( focusable.length > 0 ) {
			setTimeout( () => focusable[ 0 ].focus(), 50 );
		} else {
			const closeBtn = dialog.querySelector(
				'[data-close-popup="true"]'
			);
			if ( closeBtn ) {
				setTimeout( () => closeBtn.focus(), 50 );
			}
		}
	}

	/**
	 * Close a popup's dialog, waiting for the exit animation to complete
	 * @param {Object} popup Registry entry from the `popups` map
	 */
	function closePopup( popup ) {
		const { dialog, backdrop, triggers } = popup;

		if ( dialog.getAttribute( 'data-state' ) !== 'open' ) {
			return;
		}

		dialog.setAttribute( 'data-state', 'closed' );
		backdrop.setAttribute( 'data-state', 'closed' );
		triggers.forEach( ( t ) => t.setAttribute( 'aria-expanded', 'false' ) );

		const hide = () => {
			dialog.setAttribute( 'inert', '' );
			backdrop.setAttribute( 'inert', '' );
			openCount = Math.max( 0, openCount - 1 );
			if ( openCount === 0 ) {
				document.body.style.overflow = '';
			}
		};

		const duration =
			parseFloat( getComputedStyle( dialog ).transitionDuration ) * 1000;
		if ( duration > 0 ) {
			dialog.addEventListener( 'transitionend', hide, { once: true } );
		} else {
			hide();
		}
	}
} );
