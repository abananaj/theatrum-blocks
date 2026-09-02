/**
 * Popup Trigger — registers a core/button variation that opens a theatrum/popup block elsewhere on the page, linked via the popup's HTML Anchor. Decouples trigger from popup (any number of buttons can point at one popup by anchor id); the `popup-trigger-button` class is what frontend view.js and theme button styles key off of, since the trigger no longer lives inside `.wp-block-theatrum-popup`.
 *
 * Phase 1 only: target anchor is set via core/button's normal URL field. A friendlier "pick a popup" panel (utils/popup-trigger-panel.js) is planned but not wired in yet.
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
