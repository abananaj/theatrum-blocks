/**
 * Colors every Theatrum/Chance custom block's icon blue so custom blocks are
 * visually distinguishable in the inserter, list view, and block toolbar —
 * mirroring how the chance/bind-* meta variations show purple via BIND_COLOR
 * (see src/meta-variations.js).
 */

import { addFilter } from '@wordpress/hooks';
import { normalizeIconObject } from '@wordpress/blocks';

const CUSTOM_BLOCK_COLOR = '#448CCA';

function colorizeCustomBlockIcon( settings, name ) {
	if ( ! name?.startsWith( 'chance/' ) && ! name?.startsWith( 'theatrum/' ) ) {
		return settings;
	}

	const icon = normalizeIconObject( settings.icon );

	return {
		...settings,
		icon: {
			...icon,
			foreground: icon.foreground || CUSTOM_BLOCK_COLOR,
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'theatrum-blocks/block-color',
	colorizeCustomBlockIcon
);
