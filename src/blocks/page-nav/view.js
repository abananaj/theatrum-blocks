/**
 * Page Nav — front-end behaviour.
 *
 * For each rendered `theatrum/page-nav` container, scan the configured content
 * region for `<section id>` elements, take the first heading inside each, and
 * build a row of core-buttons-styled jump links. If nothing qualifies, the
 * container is removed so no empty nav shows.
 *
 * Enqueued via the `viewScript` property in block.json.
 */

const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6';

/**
 * Collect { id, text } pairs from `<section id>` elements that contain a heading.
 *
 * @param {Element} root Element to search within.
 * @return {Array<{id: string, text: string}>} Ordered nav items.
 */
function collectSections( root ) {
	const items = [];
	const seen = new Set();

	root.querySelectorAll( 'section[id]' ).forEach( ( section ) => {
		const id = section.id;
		if ( ! id || seen.has( id ) ) {
			return;
		}

		const heading = section.querySelector( HEADING_SELECTOR );
		if ( ! heading ) {
			// Sections without a heading are skipped entirely.
			return;
		}

		const text = heading.textContent.trim();
		if ( ! text ) {
			return;
		}

		seen.add( id );
		items.push( { id, text } );
	} );

	return items;
}

/**
 * Build a single button-styled jump link.
 *
 * @param {{id: string, text: string}} item Nav item.
 * @return {HTMLElement} The `.wp-block-button` wrapper element.
 */
function buildItem( { id, text } ) {
	const wrapper = document.createElement( 'div' );
	wrapper.className = 'wp-block-button theatrum-page-nav__item';

	const link = document.createElement( 'a' );
	link.className = 'wp-block-button__link wp-element-button';
	link.href = `#${ id }`;
	link.textContent = text;

	wrapper.appendChild( link );
	return wrapper;
}

/**
 * Populate one page-nav container, or remove it if there is nothing to link to.
 *
 * @param {HTMLElement} nav The `.theatrum-page-nav` container.
 */
function initPageNav( nav ) {
	const selector = nav.dataset.contentSelector || 'main';
	const root = document.querySelector( selector ) || document.body;
	const items = collectSections( root );

	if ( ! items.length ) {
		nav.remove();
		return;
	}

	const list = document.createElement( 'div' );
	list.className = 'wp-block-buttons theatrum-page-nav__list';
	items.forEach( ( item ) => list.appendChild( buildItem( item ) ) );

	nav.appendChild( list );
	nav.hidden = false;
}

function ready( fn ) {
	if ( document.readyState !== 'loading' ) {
		fn();
	} else {
		document.addEventListener( 'DOMContentLoaded', fn );
	}
}

ready( () => {
	document.querySelectorAll( '.theatrum-page-nav' ).forEach( initPageNav );
} );
