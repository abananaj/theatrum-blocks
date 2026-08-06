/**
 * Colors every Theatrum custom block's icon so custom blocks are
 * visually distinguishable in the inserter, list view, and block toolbar —
 * mirroring how the theatrum/bind-* meta variations show purple via BIND_COLOR
 * (see src/meta-variations.js). Meta blocks (category: "metablock") get the
 * theme's red-orange accent; all other custom blocks get blue.
 */

import { addFilter } from '@wordpress/hooks';
import { normalizeIconObject } from '@wordpress/blocks';

const CUSTOM_BLOCK_COLOR = '#4499ca';
const META_BLOCK_COLOR = '#2f00db'; // theme.json preset color "red-orange"

function colorizeCustomBlockIcon( settings, name ) {
	if ( ! name?.startsWith( 'theatrum/' ) ) {
		return settings;
	}

	const icon = normalizeIconObject( settings.icon );
	const color =
		settings.category === 'metablock'
			? META_BLOCK_COLOR
			: CUSTOM_BLOCK_COLOR;

	return {
		...settings,
		icon: {
			...icon,
			foreground: icon.foreground || color,
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'theatrum-blocks/block-color',
	colorizeCustomBlockIcon
);
