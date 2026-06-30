/**
 * Meta block variations — registers core block variations backed by the
 * chance/post-meta Block Bindings source. Each variation appears in the
 * block inserter under the parent core block and pulls its attribute value
 * from post meta or ACF at render time.
 *
 * Also loads:
 *  - meta-binding-panel: adds the Meta Source inspector panel to bound blocks
 *  - meta-transforms: adds Transform to/from support for old chance/meta-* blocks
 */

import { registerBlockVariation } from '@wordpress/blocks';
import './utils/meta-binding-panel';
import './utils/meta-transforms';

registerBlockVariation('core/image', {
	name: 'chance/meta-image',
	title: 'Meta Image',
	description: 'Display an image from post meta or ACF',
	icon: 'format-image',
	keywords: ['meta', 'image', 'acf', 'photo'],
	attributes: {
		metadata: {
			name: 'chance/meta-image',
			bindings: {
				id: { source: 'chance/post-meta', args: { key: '' } },
			},
		},
	},
	isActive: (attrs) => attrs?.metadata?.name === 'chance/meta-image',
});

registerBlockVariation('core/button', {
	name: 'chance/meta-button',
	title: 'Meta Button',
	description: 'Button whose URL is pulled from post meta',
	icon: 'button',
	keywords: ['meta', 'button', 'link', 'acf'],
	attributes: {
		metadata: {
			name: 'chance/meta-button',
			bindings: {
				url: { source: 'chance/post-meta', args: { key: '' } },
			},
		},
	},
	isActive: (attrs) => attrs?.metadata?.name === 'chance/meta-button',
});

registerBlockVariation('core/paragraph', {
	name: 'chance/meta-field',
	title: 'Meta Field',
	description: 'Display any text value from post meta',
	icon: 'admin-generic',
	keywords: ['meta', 'field', 'text', 'acf'],
	attributes: {
		metadata: {
			name: 'chance/meta-field',
			bindings: {
				content: { source: 'chance/post-meta', args: { key: '' } },
			},
		},
	},
	isActive: (attrs) => attrs?.metadata?.name === 'chance/meta-field',
});

registerBlockVariation('core/paragraph', {
	name: 'chance/meta-date',
	title: 'Meta Date',
	description: 'Display a formatted date from post meta',
	icon: 'calendar-alt',
	keywords: ['meta', 'date', 'acf'],
	attributes: {
		metadata: {
			name: 'chance/meta-date',
			bindings: {
				content: { source: 'chance/post-meta', args: { key: '', format: 'M jS' } },
			},
		},
	},
	isActive: (attrs) => attrs?.metadata?.name === 'chance/meta-date',
});

registerBlockVariation('core/embed', {
	name: 'chance/meta-embed',
	title: 'Meta Embed',
	description: 'Embed a video from a URL stored in post meta',
	icon: 'embed-generic',
	keywords: ['meta', 'embed', 'video', 'acf'],
	attributes: {
		metadata: {
			name: 'chance/meta-embed',
			bindings: {
				url: { source: 'chance/post-meta', args: { key: '' } },
			},
		},
	},
	isActive: (attrs) => attrs?.metadata?.name === 'chance/meta-embed',
});

registerBlockVariation('core/file', {
	name: 'chance/meta-file',
	title: 'Meta File',
	description: 'File download link from post meta or ACF',
	icon: 'media-document',
	keywords: ['meta', 'file', 'download', 'acf'],
	attributes: {
		metadata: {
			name: 'chance/meta-file',
			bindings: {
				href: { source: 'chance/post-meta', args: { key: '' } },
			},
		},
	},
	isActive: (attrs) => attrs?.metadata?.name === 'chance/meta-file',
});
