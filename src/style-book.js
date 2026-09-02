/**
 * Style Book tab ordering: positions the "theatrum" category (registered server-side via block_categories_all) immediately before "widgets" in the tab bar built from getCategories().
 *
 * @see packages/editor/src/components/style-book/categories.ts (Gutenberg)
 */

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';
import { getCategories, setCategories } from '@wordpress/blocks';

domReady( () => {
	const categories = getCategories();

	// Nothing to do if our category isn't registered yet or already in order.
	const theatrumIndex = categories.findIndex(
		( { slug } ) => slug === 'theatrum'
	);
	const widgetsIndex = categories.findIndex(
		( { slug } ) => slug === 'widgets'
	);

	if ( theatrumIndex === -1 || widgetsIndex === -1 ) {
		return;
	}

	// Already in the correct position (theatrum immediately before widgets).
	if ( theatrumIndex === widgetsIndex - 1 ) {
		return;
	}

	// Remove theatrum from its current position and splice it before widgets.
	const reordered = [ ...categories ];
	const [ theatrumCategory ] = reordered.splice( theatrumIndex, 1 );

	// Recalculate widgets index after the splice.
	const newWidgetsIndex = reordered.findIndex(
		( { slug } ) => slug === 'widgets'
	);
	reordered.splice( newWidgetsIndex, 0, theatrumCategory );

	setCategories( reordered );
} );
