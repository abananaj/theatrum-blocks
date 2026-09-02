/**
 * Colors every Theatrum custom block's icon for visual distinction in the inserter/list view/toolbar (mirroring the theatrum/bind-* variations' BIND_COLOR purple, src/meta-variations.js). Meta blocks get the red-orange accent; everything else gets blue.
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
