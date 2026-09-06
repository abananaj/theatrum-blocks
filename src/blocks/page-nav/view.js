/**
 * Page Nav — front-end behaviour. Scans the content region for opt-in jump targets (must have an
 * HTML Anchor): `<section id>` elements (first heading as text, skips ones inside a Query Loop
 * card) and anchored Query Loop cards (post title as text, skips ones inside a section) — either
 * kind also skips inactive Tabs panels. Removes itself if nothing qualifies. Enqueued as viewScript.
 *
 * Also runs a scroll-spy: an IntersectionObserver marks the link for whichever target is currently
 * under the sticky-header offset with `aria-current="true"`, so style.scss can style from that
 * attribute instead of a separately-tracked class.
 */

const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6';
const POST_TITLE_SELECTOR = '.wp-block-post-title';
const QUERY_LOOP_CARD_SELECTOR =
	'.wp-block-query[id] .wp-block-post-template > *';
const TAB_PANEL_SELECTOR = '.wp-block-theatrum-tab-content';
const SECTION_SELECTOR = 'section[id]';

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
 * Collect { id, text } nav items from sections and query loop cards, in document order.
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

		if ( section.closest( TAB_PANEL_SELECTOR ) ) {
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

	root.querySelectorAll( QUERY_LOOP_CARD_SELECTOR ).forEach( ( card ) => {
		if ( card.closest( TAB_PANEL_SELECTOR ) ) {
			return;
		}

		if ( card.closest( SECTION_SELECTOR ) ) {
			return;
		}

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
 * Mark exactly one link as the current section; semantics and styling both read this attribute.
 *
 * @param {Map<string, HTMLElement>} linksById All jump links, keyed by target id.
 * @param {string}                   activeId  Id of the link to mark current.
 */
function setActiveLink( linksById, activeId ) {
	linksById.forEach( ( link, id ) => {
		if ( id === activeId ) {
			link.setAttribute( 'aria-current', 'true' );
		} else {
			link.removeAttribute( 'aria-current' );
		}
	} );
}

/**
 * Scroll-spy: watches each target and keeps the nearest-above-the-fold one marked current.
 *
 * The activation line reuses each target's own `scroll-margin-top` (style.scss sets it from
 * `--theatrum-page-nav-offset`, the same property anchor clicks already scroll against), so the
 * highlighted link always matches where a click on it would actually land — no separate constant
 * to keep in sync with the sticky header's height.
 *
 * @param {Array<{id: string, text: string}>} items     Nav items, in document order.
 * @param {Map<string, HTMLElement>}          linksById Jump links, keyed by target id.
 */
function initScrollSpy( items, linksById ) {
	if ( ! ( 'IntersectionObserver' in window ) ) {
		return;
	}

	const targets = items
		.map( ( item ) => document.getElementById( item.id ) )
		.filter( Boolean );

	if ( ! targets.length ) {
		return;
	}

	const offset =
		parseFloat( getComputedStyle( targets[ 0 ] ).scrollMarginTop ) || 0;
	const visible = new Set();
	let activeId = items[ 0 ].id;

	setActiveLink( linksById, activeId );

	const observer = new IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					visible.add( entry.target.id );
				} else {
					visible.delete( entry.target.id );
				}
			} );

			if ( ! visible.size ) {
				return;
			}

			// Document-order items, filtered to what's currently in the band: the last one is the
			// section the reader has most recently scrolled to.
			const next = items
				.map( ( item ) => item.id )
				.filter( ( id ) => visible.has( id ) )
				.pop();

			if ( next && next !== activeId ) {
				activeId = next;
				setActiveLink( linksById, activeId );
			}
		},
		{
			// A thin band starting just below the sticky header and ending well before the
			// viewport's bottom, so a target counts as "current" once its top has passed the
			// header rather than as soon as any sliver of it appears.
			rootMargin: `-${ offset }px 0px -60% 0px`,
		}
	);

	targets.forEach( ( target ) => observer.observe( target ) );
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
	const linksById = new Map();

	items.forEach( ( item ) => {
		const wrapper = buildItem( item );
		list.appendChild( wrapper );
		linksById.set( item.id, wrapper.querySelector( 'a' ) );
	} );

	nav.appendChild( list );
	nav.hidden = false;

	initScrollSpy( items, linksById );
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
