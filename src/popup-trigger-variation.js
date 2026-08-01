/**
 * Popup Trigger — registers a core/button variation that opens a theatrum/popup
 * block elsewhere on the page, linked via the popup's HTML Anchor.
 *
 * Decouples the trigger from the popup: any number of these buttons, placed
 * anywhere, can point at the same popup by anchor id. The button's `url`
 * attribute holds the ordinary `#anchor` link; the `popup-trigger-button`
 * class on the variation's default attributes is what the frontend view.js
 * (src/blocks/popup/view.js) and the theme's button styles key off of, since
 * the trigger no longer lives inside `.wp-block-theatrum-popup`.
 *
 * Phase 1 only: the target anchor is set via core/button's normal URL field
 * (type `#anchor`, matching the popup's HTML Anchor in Advanced). A friendlier
 * "pick a popup" inspector panel (utils/popup-trigger-panel.js) is planned
 * as a follow-up but not wired in yet.
 */

import { registerBlockVariation } from '@wordpress/blocks';
import { link } from '@wordpress/icons';

const TRIGGER_COLOR = '#0B7285';

registerBlockVariation( 'core/button', {
	name: 'theatrum/popup-trigger',
	title: 'Popup Trigger',
	description:
		'A button that opens a Popup block elsewhere on the page, linked via its HTML Anchor.',
	icon: { src: link, foreground: TRIGGER_COLOR },
	keywords: [ 'popup', 'dialog', 'modal', 'trigger', 'anchor' ],
	attributes: {
		className: 'popup-trigger-button',
		url: '#',
		metadata: {
			name: 'theatrum/popup-trigger',
		},
	},
	isActive: ( attrs ) => attrs?.metadata?.name === 'theatrum/popup-trigger',
} );
