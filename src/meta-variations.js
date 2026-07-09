/**
 * Meta block variations — registers core block variations backed by the
 * chance/post-meta Block Bindings source. Each variation appears in the
 * block inserter under the parent core block and pulls its attribute value
 * from post meta or ACF at render time.
 *
 * These are optional alternates to the chance/meta-* custom blocks, useful
 * when a core block's own styling/features (e.g. core/button's width and
 * style controls) are worth trading the custom block's dedicated UI for.
 * They are not a replacement or migration path — the custom blocks remain
 * the primary, supported way to bind meta.
 *
 * Also loads:
 *  - meta-binding-panel: adds the Meta Source inspector panel to bound blocks
 *  - meta-transforms: adds Transform to/from support for chance/meta-* blocks
 */

import { registerBlockVariation } from '@wordpress/blocks';
import { image, button, paragraph, file } from '@wordpress/icons';
import './utils/meta-binding-panel';
import './utils/meta-transforms';

const BIND_COLOR = '#8B5CF6';

registerBlockVariation( 'core/image', {
	name: 'chance/bind-image',
	title: 'Image (Meta Bound)',
	description: 'Display an image from post meta or ACF',
	icon: { src: image, foreground: BIND_COLOR },
	keywords: [ 'meta', 'image', 'acf', 'photo', 'bind' ],
	attributes: {
		metadata: {
			name: 'chance/bind-image',
			bindings: {
				id: { source: 'chance/post-meta', args: { key: '' } },
			},
		},
	},
	isActive: ( attrs ) => attrs?.metadata?.name === 'chance/bind-image',
} );

registerBlockVariation( 'core/button', {
	name: 'chance/bind-button',
	title: 'Button (Meta Bound)',
	description: 'Button whose URL is pulled from post meta',
	icon: { src: button, foreground: BIND_COLOR },
	keywords: [ 'meta', 'button', 'link', 'acf', 'bind' ],
	attributes: {
		metadata: {
			name: 'chance/bind-button',
			bindings: {
				url: { source: 'chance/post-meta', args: { key: '' } },
			},
		},
	},
	isActive: ( attrs ) => attrs?.metadata?.name === 'chance/bind-button',
} );

registerBlockVariation( 'core/paragraph', {
	name: 'chance/bind-field',
	title: 'Paragraph (Meta Bound)',
	description: 'Display any text value from post meta',
	icon: { src: paragraph, foreground: BIND_COLOR },
	keywords: [ 'meta', 'field', 'text', 'acf', 'bind' ],
	attributes: {
		metadata: {
			name: 'chance/bind-field',
			bindings: {
				content: { source: 'chance/post-meta', args: { key: '' } },
			},
		},
	},
	isActive: ( attrs ) => attrs?.metadata?.name === 'chance/bind-field',
} );

registerBlockVariation( 'core/paragraph', {
	name: 'chance/bind-date',
	title: 'Date (Meta Bound)',
	description: 'Display a formatted date from post meta',
	icon: { src: paragraph, foreground: BIND_COLOR },
	keywords: [ 'meta', 'date', 'acf', 'bind' ],
	attributes: {
		metadata: {
			name: 'chance/bind-date',
			bindings: {
				content: {
					source: 'chance/post-meta',
					args: { key: '', format: 'M jS' },
				},
			},
		},
	},
	isActive: ( attrs ) => attrs?.metadata?.name === 'chance/bind-date',
} );

registerBlockVariation( 'core/embed', {
	name: 'chance/bind-embed',
	title: 'Embed (Meta Bound)',
	description: 'Embed a video from a URL stored in post meta',
	icon: { src: 'embed-generic', foreground: BIND_COLOR },
	keywords: [ 'meta', 'embed', 'video', 'acf', 'bind' ],
	attributes: {
		metadata: {
			name: 'chance/bind-embed',
			bindings: {
				url: { source: 'chance/post-meta', args: { key: '' } },
			},
		},
	},
	isActive: ( attrs ) => attrs?.metadata?.name === 'chance/bind-embed',
} );

registerBlockVariation( 'core/file', {
	name: 'chance/bind-file',
	title: 'File (Meta Bound)',
	description: 'File download link from post meta or ACF',
	icon: { src: file, foreground: BIND_COLOR },
	keywords: [ 'meta', 'file', 'download', 'acf', 'bind' ],
	attributes: {
		metadata: {
			name: 'chance/bind-file',
			bindings: {
				href: { source: 'chance/post-meta', args: { key: '' } },
			},
		},
	},
	isActive: ( attrs ) => attrs?.metadata?.name === 'chance/bind-file',
} );
