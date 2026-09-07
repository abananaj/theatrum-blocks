/**
 * Icon Accordion — a core/accordion variation styled after the "responsive expandable cards table"
 * CodePen (.examples/responsive-expandable-cards-table-accordion.zip): a stack of full-bleed
 * coloured cards, each with an icon rail on the left, that expand in place.
 *
 * The look itself lives in `is-style-ct-accordion-icon`, registered as a real block style in
 * theatrum-blocks.php so it can also be applied to an accordion that already exists (Styles tab).
 * This variation is the convenience path: same class, plus `autoclose` (with fluid card heights,
 * several open cards make the block balloon) and a five-card starting point in palette colours.
 *
 * Departs from src/popup-trigger-variation.js in one way: that variation identifies itself with a
 * metadata.name marker, but metadata.name is also core's block-rename label, so it prints the raw
 * slug in List View and the breadcrumb. Here the style class is the marker instead — and an author
 * who removes it from the Styles tab genuinely no longer has a Icon Accordion, so falling out of
 * the variation is the right answer rather than a bug.
 */

import { registerBlockVariation } from '@wordpress/blocks';
import { stack } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import './controls';
import './style.scss';

const CUSTOM_BLOCK_COLOR = '#4499ca'; // matches src/block-color.js
const VARIATION_NAME = 'theatrum/accordion-icon';
const STYLE_CLASS = 'is-style-ct-accordion-icon'; // registered in theatrum-blocks.php

/**
 * Starting cards — titles only. Deliberately no backgroundColor: a card left unpainted takes its
 * colour from the nomenclature ramp by position (primary, secondary, tertiary, quaternary, quinary,
 * then muted-light for every card after the fifth), each with the --ct-on-* text colour computed to
 * be legible on it. So the stack is coloured on insertion, follows any Global Category applied to
 * the page, and keeps colouring itself as an author adds cards. See style.scss.
 *
 * Icons are chosen per card from the media library in the Icon panel (src/accordion-icon/
 * controls.js); there is no default set to seed here.
 */
const CARDS = [
	__( 'Tickets', 'theatrum-blocks' ),
	__( 'Schedule', 'theatrum-blocks' ),
	__( 'Getting here', 'theatrum-blocks' ),
	__( 'Groups & students', 'theatrum-blocks' ),
	__( 'Support us', 'theatrum-blocks' ),
];

const innerBlocks = CARDS.map( ( title ) => [
	'core/accordion-item',
	{},
	[
		[ 'core/accordion-heading', { title } ],
		[
			'core/accordion-panel',
			{},
			[
				[
					'core/paragraph',
					{
						placeholder: __(
							'Add the card’s content…',
							'theatrum-blocks'
						),
					},
				],
			],
		],
	],
] );

registerBlockVariation( 'core/accordion', {
	name: VARIATION_NAME,
	title: __( 'Icon Accordion', 'theatrum-blocks' ),
	description: __(
		'A stack of coloured cards with an icon rail, each expanding in place to reveal its content.',
		'theatrum-blocks'
	),
	icon: { src: stack, foreground: CUSTOM_BLOCK_COLOR },
	keywords: [ 'accordion', 'cards', 'expand', 'faq', 'stack' ],
	attributes: {
		className: STYLE_CLASS,
		autoclose: true,
		// The parent provides core/accordion-icon-position; each heading syncs its own
		// iconPosition from that context, so setting it here is enough.
		iconPosition: 'left',
	},
	innerBlocks,
	isActive: ( attrs ) =>
		!! attrs?.className?.split( ' ' ).includes( STYLE_CLASS ),
} );
