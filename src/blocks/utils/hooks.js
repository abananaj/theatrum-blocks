/**
 * WordPress dependencies
 */
import { useViewportMatch } from '@wordpress/compose';

/**
 * Positions a block's ToolsPanel dropdown left of the sidebar (default can clip against its edge),
 * matching WordPress core's own blocks, on viewports wide enough for it to make sense.
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
