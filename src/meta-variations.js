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
 * Only core/image, core/button, and core/paragraph are registered here —
 * WordPress core's block bindings system only recognizes a fixed allowlist
 * of block/attribute pairs (see get_block_bindings_supported_attributes()
 * in wp-includes/block-bindings.php), which does not include core/embed or
 * core/file. Bindings on those two are silently ignored everywhere (editor
 * and front end), so chance/bind-embed and chance/bind-file variations were
 * removed rather than shipped broken — use the chance/meta-embed and
 * chance/meta-file custom blocks instead, which don't have this limitation.
 *
 * Also loads:
 *  - meta-binding-source: registers the chance/post-meta source client-side
 *    (getValues) so WP core's native "Attributes" panel can resolve it
 *    instead of showing "Source not registered"
 *  - meta-binding-panel: adds the Meta Source inspector panel to bound blocks
 *  - meta-transforms: adds Transform to/from support for chance/meta-* blocks
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
				id: { source: 'chance/post-meta', args: { key: '' } },
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
				url: { source: 'chance/post-meta', args: { key: '' } },
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
				content: { source: 'chance/post-meta', args: { key: '' } },
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
					source: 'chance/post-meta',
					args: { key: '', format: 'M jS' },
				},
			},
		},
	},
	isActive: ( attrs ) => attrs?.metadata?.name === 'theatrum/bind-date',
} );
