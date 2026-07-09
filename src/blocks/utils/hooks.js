/**
 * WordPress dependencies
 */
import { useViewportMatch } from '@wordpress/compose';

/**
 * Positions a block's ToolsPanel dropdown menu to the left of the sidebar
 * instead of the default (which can clip against the sidebar edge) — matches
 * the layout WordPress core's own blocks use for the same component, on
 * viewports wide enough for it to make sense.
 */
export function useToolsPanelDropdownMenuProps() {
	const isMobile = useViewportMatch( 'medium', '<' );
	return ! isMobile
		? {
				popoverProps: {
					placement: 'left-start',
					offset: 259,
				},
		  }
		: {};
}
