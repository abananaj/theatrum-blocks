// Shrink-wraps each quote card to its longest rendered line: CSS fit-content stops at the max-width once text wraps, leaving a gap on the right.

const CARD = '.wp-block-theatrum-production-quotes .wp-block-quote';

function fitCard( card ) {
	card.style.width = '';
	const box = card.getBoundingClientRect();
	if ( ! box.width ) {
		return; // hidden (inactive tab); the ResizeObserver refits it once shown
	}

	const range = document.createRange();
	let right = 0;
	card.querySelectorAll( 'p' ).forEach( ( p ) => {
		range.selectNodeContents( p );
		for ( const rect of range.getClientRects() ) {
			right = Math.max( right, rect.right );
		}
	} );
	if ( ! right ) {
		return;
	}

	const style = getComputedStyle( card );
	const width =
		right -
		box.left +
		parseFloat( style.paddingRight ) +
		parseFloat( style.borderRightWidth );
	card.style.width = `${ Math.ceil( width ) }px`;
}

function fitAll( root = document ) {
	root.querySelectorAll( CARD ).forEach( fitCard );
}

function init() {
	const blocks = document.querySelectorAll(
		'.wp-block-theatrum-production-quotes'
	);
	if ( ! blocks.length ) {
		return;
	}

	fitAll();
	document.fonts?.ready.then( () => fitAll() );

	// Block width changes (resize, a tab panel becoming visible) are the only things that move the line breaks.
	const widths = new WeakMap();
	const observer = new ResizeObserver( ( entries ) => {
		entries.forEach( ( { target, contentRect } ) => {
			if ( widths.get( target ) === contentRect.width ) {
				return;
			}
			widths.set( target, contentRect.width );
			fitAll( target );
		} );
	} );
	blocks.forEach( ( block ) => observer.observe( block ) );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
