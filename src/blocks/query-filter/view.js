import { store, getContext } from '@wordpress/interactivity';

const { state } = store('chance/query-filter', {
  state: {
    isOpen: false,
  },
  actions: {
    /**
     * Toggle mobile filter panel open/closed.
     */
    toggleFilters() {
      state.isOpen = !state.isOpen;
    },

    /**
     * Navigate to filtered URL when a select value changes.
     * Preserves all existing URL params and replaces only this filter's param.
     *
     * @param {Event} event - The change event from the select element.
     */
    updateFilter(event) {
      const { paramName } = getContext();
      const value = event.target.value;

      const url = new URL(window.location.href);

      if (value) {
        url.searchParams.set(paramName, value);
      } else {
        url.searchParams.delete(paramName);
      }

      // Reset pagination when filtering.
      url.searchParams.delete('paged');
      url.searchParams.delete('page');

      window.location.assign(url.toString());
    },
  },
});
