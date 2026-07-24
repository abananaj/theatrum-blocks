// Popup Block Frontend Script
document.addEventListener( 'DOMContentLoaded', function () {
	const popupButtons = document.querySelectorAll(
		'[data-popup-toggle="true"]'
	);

	popupButtons.forEach( ( button ) => {
		const wrapper = button.closest( '.wp-block-chance-popup' );
		if ( ! wrapper ) {
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

		// Move the dialog/backdrop to a direct child of <body>. Left in place,
		// they'd inherit whatever containing block their ancestors create — any
		// ancestor with transform/filter/will-change/contain turns their
		// position: fixed into "fixed relative to that ancestor" instead of the
		// viewport, so the dialog scrolls with the page instead of staying
		// centered. Escaping to <body> makes that impossible regardless of what
		// wraps the block on a given page.
		const portal = document.createElement( 'div' );
		portal.className = 'popup-portal';
		portal.append( backdrop, popupDialog );
		document.body.append( portal );

		// Trigger open
		button.addEventListener( 'click', function ( e ) {
			e.preventDefault();
			const isExpanded = this.getAttribute( 'aria-expanded' ) === 'true';
			if ( isExpanded ) {
				closePopup( popupDialog, button, backdrop );
			} else {
				openPopup( popupDialog, button, backdrop );
			}
		} );

		// Backdrop click closes dialog
		backdrop.addEventListener( 'click', function () {
			closePopup( popupDialog, button, backdrop );
		} );

		// Close button inside header
		const closeBtn = popupDialog.querySelector(
			'[data-close-popup="true"]'
		);
		if ( closeBtn ) {
			closeBtn.addEventListener( 'click', function () {
				closePopup( popupDialog, button, backdrop );
			} );
		}

		// Escape key closes dialog
		document.addEventListener( 'keydown', function ( e ) {
			if (
				e.key === 'Escape' &&
				button.getAttribute( 'aria-expanded' ) === 'true'
			) {
				closePopup( popupDialog, button, backdrop );
				button.focus();
			}
		} );

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

	/**
	 * Open the dialog
	 * @param popupDialog
	 * @param button
	 * @param backdrop
	 */
	function openPopup( popupDialog, button, backdrop ) {
		// Show elements (remove inert)
		popupDialog.removeAttribute( 'inert' );
		backdrop.removeAttribute( 'inert' );
		button.setAttribute( 'aria-expanded', 'true' );

		// Lock scroll
		document.body.style.overflow = 'hidden';

		// Trigger CSS enter animation (double rAF ensures paint before transition)
		requestAnimationFrame( () => {
			requestAnimationFrame( () => {
				popupDialog.setAttribute( 'data-state', 'open' );
				backdrop.setAttribute( 'data-state', 'open' );
			} );
		} );

		// Move focus into dialog — skip the close button as first focus target
		const focusable = Array.from(
			popupDialog.querySelectorAll(
				'a[href], button:not([data-close-popup]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)
		);
		if ( focusable.length > 0 ) {
			setTimeout( () => focusable[ 0 ].focus(), 50 );
		} else {
			const closeBtn = popupDialog.querySelector(
				'[data-close-popup="true"]'
			);
			if ( closeBtn ) {
				setTimeout( () => closeBtn.focus(), 50 );
			}
		}
	}

	/**
	 * Close the dialog, waiting for the exit animation to complete
	 * @param popupDialog
	 * @param button
	 * @param backdrop
	 */
	function closePopup( popupDialog, button, backdrop ) {
		popupDialog.setAttribute( 'data-state', 'closed' );
		backdrop.setAttribute( 'data-state', 'closed' );
		button.setAttribute( 'aria-expanded', 'false' );

		const hide = () => {
			popupDialog.setAttribute( 'inert', '' );
			backdrop.setAttribute( 'inert', '' );
			document.body.style.overflow = '';
		};

		const duration =
			parseFloat( getComputedStyle( popupDialog ).transitionDuration ) *
			1000;
		if ( duration > 0 ) {
			popupDialog.addEventListener( 'transitionend', hide, {
				once: true,
			} );
		} else {
			hide();
		}
	}
} );
