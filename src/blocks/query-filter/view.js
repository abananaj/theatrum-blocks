import { store, getContext } from '@wordpress/interactivity';
import { actions as routerActions } from '@wordpress/interactivity-router';

const { state } = store( 'theatrum/query-filter', {
	state: {
		isOpen: false,
	},
	actions: {
		/**
		 * Toggle mobile filter panel open/closed.
		 */
		toggleFilters() {
			state.isOpen = ! state.isOpen;
		},

		/**
		 * Navigate to filtered URL on select change, preserving other URL params — uses the
		 * Interactivity Router so the matching core/query block (enhancedPagination) updates
		 * client-side instead of a full reload.
		 *
		 * @param {Event} event - The change event from the select element.
		 */
		async updateFilter( event ) {
			const { paramName } = getContext();
			const value = event.target.value;

			const url = new URL( window.location.href );

			if ( value ) {
				url.searchParams.set( paramName, value );
			} else {
				url.searchParams.delete( paramName );
			}

			// Reset pagination when filtering.
			url.searchParams.delete( 'paged' );
			url.searchParams.delete( 'page' );

			await routerActions.navigate( url.toString() );
		},
	},
} );
