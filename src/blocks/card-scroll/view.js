/**
 * Front-end behavior for the Scroll Reveal Card block. The image panel grows into view once the
 * card crosses the middle of the viewport, matching this project's global animation-trigger
 * convention (STYLING-SEPT-2026.md T3-11: viewport 50%).
 *
 * Deliberately NOT theatrum-animation's GSAP/ScrollTrigger engine: that plugin's registry is a
 * fixed set of generic entrance presets bound to any block via the inspector, not a slot for a
 * bespoke width-grow tween, and editing it would mean editing a different plugin's submodule.
 * A single native IntersectionObserver is also lighter than a second ScrollTrigger instance
 * running on the same page — no GSAP dependency needed for this effect at all.
 *
 * One-shot only (no reverse-on-scroll-up, unlike the source pen) to match the site's entrance
 * convention, and the observer disconnects each card once revealed.
 */
window.addEventListener( 'load', () => {
	const cards = document.querySelectorAll( '.wp-block-theatrum-card-scroll' );

	if ( ! cards.length ) {
		return;
	}

	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	// Reduced motion: show the final state immediately — no scroll-linked change at all.
	if ( prefersReducedMotion || ! ( 'IntersectionObserver' in window ) ) {
		cards.forEach( ( card ) => card.classList.add( 'is-revealed' ) );
		return;
	}

	const observer = new IntersectionObserver(
		( entries, obs ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					entry.target.classList.add( 'is-revealed' );
					obs.unobserve( entry.target );
				}
			} );
		},
		{ rootMargin: '0px 0px -50% 0px' }
	);

	// `.is-js` is what collapses the image (style.scss) — until this runs, the no-JS
	// fallback is the image already at its full, revealed width.
	cards.forEach( ( card ) => {
		card.classList.add( 'is-js' );
		observer.observe( card );
	} );
} );
