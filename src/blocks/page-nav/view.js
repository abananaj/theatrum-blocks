/**
 * Page Nav — front-end behaviour.
 *
 * For each rendered `theatrum/page-nav` container, scan the configured content
 * region for two kinds of jump targets, in document order:
 *
 * - `<section id>` elements, using the first heading inside each. Sections
 *   nested inside a query loop's post content are skipped — that markup
 *   belongs to the individual post's own body (e.g. a promo/bio block) and
 *   isn't the section the loop item should be filed under.
 * - Query loop cards (`.wp-block-post-template` items), using the card's
 *   `.wp-block-post-title` so each looped post gets one nav entry named
 *   after its title rather than whatever heading happens to appear first
 *   inside it.
 *
 * If nothing qualifies, the container is removed so no empty nav shows.
 *
 * Enqueued via the `viewScript` property in block.json.
 */

const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6';
const POST_TITLE_SELECTOR = '.wp-block-post-title';

/**
 * Slugify arbitrary text into an id-safe string.
 *
 * @param {string} text Source text.
 * @return {string} Slug, never empty.
 */
function slugify( text ) {
	return (
		text
			.toLowerCase()
			.trim()
			.replace( /[^a-z0-9]+/g, '-' )
			.replace( /^-+|-+$/g, '' ) || 'item'
	);
}

/**
 * Get (and assign, if missing) a stable id for a nav-target element.
 *
 * @param {Element} el   Element to identify.
 * @param {string}  text Label text, used to derive a slug if `el` has no id.
 * @param {Set}     seen Ids already claimed in this pass.
 * @return {string} The element's id.
 */
function resolveId( el, text, seen ) {
	let id = el.id;
	if ( ! id ) {
		const base = slugify( text );
		id = base;
		let suffix = 1;
		while ( seen.has( id ) || document.getElementById( id ) ) {
			id = `${ base }-${ suffix++ }`;
		}
		el.id = id;
	}
	return id;
}

/**
 * Collect { id, text } nav items from sections and query loop cards, in
 * document order.
 *
 * @param {Element} root Element to search within.
 * @return {Array<{id: string, text: string}>} Ordered nav items.
 */
function collectSections( root ) {
	const candidates = [];

	root.querySelectorAll( 'section[id]' ).forEach( ( section ) => {
		if ( section.closest( '.wp-block-post-template' ) ) {
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

		candidates.push( { el: section, text } );
	} );

	root.querySelectorAll( '.wp-block-post-template > *' ).forEach( ( card ) => {
		const titleEl = card.querySelector( POST_TITLE_SELECTOR );
		if ( ! titleEl ) {
			return;
		}

		const text = titleEl.textContent.trim();
		if ( ! text ) {
			return;
		}

		candidates.push( { el: card, text } );
	} );

	candidates.sort( ( a, b ) => {
		const position = a.el.compareDocumentPosition( b.el );
		return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
	} );

	const seen = new Set();
	const items = [];

	candidates.forEach( ( { el, text } ) => {
		const id = resolveId( el, text, seen );
		if ( seen.has( id ) ) {
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
