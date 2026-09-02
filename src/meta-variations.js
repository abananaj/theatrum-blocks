/**
 * Registers core block variations backed by the theatrum/post-meta Block Bindings source — optional alternates to the theatrum/meta-* custom blocks (not a replacement/migration path) for when a core block's own styling/features are worth trading the custom block's dedicated UI for.
 *
 * Only core/image, core/button, and core/paragraph are registered — WP core's block bindings only recognize a fixed allowlist of block/attribute pairs that excludes core/embed and core/file, so bind-embed/bind-file variations were removed rather than shipped silently broken; use theatrum/meta-embed and theatrum/meta-file instead.
 *
 * Also loads meta-binding-source (client-side source registration, else the core Attributes panel shows "Source not registered"), meta-binding-panel (Meta Source inspector panel), and meta-transforms (Transform to/from support).
 */

import { registerBlockVariation } from '@wordpress/blocks';
import { image, button, paragraph } from '@wordpress/icons';
import './utils/meta-binding-source';
import './utils/meta-binding-panel';
import './utils/meta-transforms';

const BIND_COLOR = '#8B5CF6';

registerBlockVariation( 'core/image', {
	name: 'theatrum/bind-image',
	title: 'Image (Meta Bound)',
	description: 'Display an image from post meta or ACF',
	icon: { src: image, foreground: BIND_COLOR },
	keywords: [ 'meta', 'image', 'acf', 'photo', 'bind' ],
	attributes: {
		metadata: {
			name: 'theatrum/bind-image',
			bindings: {
				id: { source: 'theatrum/post-meta', args: { key: '' } },
			},
		},
	},
	isActive: ( attrs ) => attrs?.metadata?.name === 'theatrum/bind-image',
} );

registerBlockVariation( 'core/button', {
	name: 'theatrum/bind-button',
	title: 'Button (Meta Bound)',
	description: 'Button whose URL is pulled from post meta',
	icon: { src: button, foreground: BIND_COLOR },
	keywords: [ 'meta', 'button', 'link', 'acf', 'bind' ],
	attributes: {
		metadata: {
			name: 'theatrum/bind-button',
			bindings: {
				url: { source: 'theatrum/post-meta', args: { key: '' } },
			},
		},
	},
	isActive: ( attrs ) => attrs?.metadata?.name === 'theatrum/bind-button',
} );

registerBlockVariation( 'core/paragraph', {
	name: 'theatrum/bind-field',
	title: 'Paragraph (Meta Bound)',
	description: 'Display any text value from post meta',
	icon: { src: paragraph, foreground: BIND_COLOR },
	keywords: [ 'meta', 'field', 'text', 'acf', 'bind' ],
	attributes: {
		metadata: {
			name: 'theatrum/bind-field',
			bindings: {
				content: { source: 'theatrum/post-meta', args: { key: '' } },
			},
		},
	},
	isActive: ( attrs ) => attrs?.metadata?.name === 'theatrum/bind-field',
} );

registerBlockVariation( 'core/paragraph', {
	name: 'theatrum/bind-date',
	title: 'Date (Meta Bound)',
	description: 'Display a formatted date from post meta',
	icon: { src: paragraph, foreground: BIND_COLOR },
	keywords: [ 'meta', 'date', 'acf', 'bind' ],
	attributes: {
		metadata: {
			name: 'theatrum/bind-date',
			bindings: {
				content: {
					source: 'theatrum/post-meta',
					args: { key: '', format: 'M jS' },
				},
			},
		},
	},
	isActive: ( attrs ) => attrs?.metadata?.name === 'theatrum/bind-date',
} );
