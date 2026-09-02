/**
 * Front-end behavior for the Popover block. Desktop uses CSS :hover on .ct-popover__trigger to reveal .ct-popover__content (see style.scss) with no JS; this script adds tap/click support for touch devices and closes on outside click.
 */
document.addEventListener( 'DOMContentLoaded', function () {
	const popovers = document.querySelectorAll( '.ct-popover' );

	popovers.forEach( ( popover ) => {
		const trigger = popover.querySelector(
			':scope > .ct-popover__trigger'
		);
		const content = popover.querySelector(
			':scope > .ct-popover__content'
		);

		if ( ! trigger || ! content ) {
			return;
		}

		trigger.addEventListener( 'click', function ( e ) {
			if ( e.target.closest( 'a' ) ) {
				return; // Allow links inside the trigger to work normally.
			}

			e.preventDefault();
			popover.classList.toggle( 'is-open' );
		} );

		document.addEventListener( 'click', function ( e ) {
			if ( ! popover.contains( e.target ) ) {
				popover.classList.remove( 'is-open' );
			}
		} );
	} );
} );
