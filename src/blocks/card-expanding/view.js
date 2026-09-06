/**
 * Front-end behavior for the Expanding Card block. Click (not hover — hover-only breaks on
 * touch) toggles the description via a real <button>, which gives Enter/Space activation for
 * free (unlike theatrum/tabs' div[role="button"], needed there only because its trigger has to
 * hold a heading). IDs/ARIA are assigned here rather than baked into save() so multiple
 * instances on one page never collide, matching the theatrum/tabs idiom.
 *
 * `.is-ready` gates the collapsed-by-default CSS (style.scss) so a description is fully visible
 * before this script runs — the no-JS fallback shows the whole card, not a clipped one.
 */
window.addEventListener( 'load', () => {
	const cards = document.querySelectorAll(
		'.wp-block-theatrum-card-expanding'
	);
	let idSeed = 0;

	cards.forEach( ( card ) => {
		const trigger = card.querySelector(
			'.wp-block-theatrum-card-expanding__trigger'
		);
		const description = card.querySelector(
			'.wp-block-theatrum-card-expanding__description'
		);

		if ( ! trigger || ! description ) {
			return;
		}

		idSeed += 1;
		if ( ! description.id ) {
			description.id = `card-expanding-description-${ idSeed }`;
		}
		trigger.setAttribute( 'aria-controls', description.id );
		trigger.setAttribute( 'aria-expanded', 'false' );

		trigger.addEventListener( 'click', () => {
			const isExpanded = card.classList.toggle( 'is-expanded' );
			trigger.setAttribute(
				'aria-expanded',
				isExpanded ? 'true' : 'false'
			);
			description.style.height = isExpanded
				? `${ description.scrollHeight }px`
				: '';
		} );

		card.classList.add( 'is-ready' );
	} );
} );
