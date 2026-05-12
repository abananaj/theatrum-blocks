/**
 * Frontend interaction script for media-popover block.
 * Handles hover interactions and touch support for mobile.
 */

document.addEventListener( 'DOMContentLoaded', function() {
	const triggers = document.querySelectorAll( '.media-popover-trigger' );

	triggers.forEach( ( trigger ) => {
		const content = trigger.querySelector( '.media-popover-content' );

		if ( ! content ) {
			return;
		}

		// Handle touch events on mobile
		trigger.addEventListener( 'click', function( e ) {
			if ( e.target.tagName === 'A' ) {
				return; // Allow links to work normally
			}

			e.preventDefault();
			e.stopPropagation();

			const isVisible = content.style.opacity === '1';

			if ( ! isVisible ) {
				content.style.opacity = '1';
				content.style.visibility = 'visible';
				content.style.pointerEvents = 'auto';
			}
		} );

		// Close when clicking outside
		document.addEventListener( 'click', function( e ) {
			if ( ! trigger.contains( e.target ) ) {
				content.style.opacity = '0';
				content.style.visibility = 'hidden';
				content.style.pointerEvents = 'none';
			}
		} );
	} );
} );
