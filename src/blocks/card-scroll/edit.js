/**
 * Scroll Reveal Card editor. The card's text is nested blocks — real blocks the author selects and
 * edits like any others, seeded by TEMPLATE as two groups: a header that fits its content and a
 * body that takes the height left over and scrolls (style.scss). They're ordinary core/group
 * blocks, so everything about them is the author's — only the classes matter, and they're what
 * style.scss hooks the layout onto. The image is not a nested block: it's a block attribute picked
 * and sized from the sidebar (<CardImageControls>), because the panel's width is what the
 * front-end reveal animates and its height is what fixes the card's.
 *
 * The editor canvas isn't a real scroll viewport, so the reveal (view.js, front end only) isn't
 * simulated here: the panel sits at its revealed width, which is also what a visitor without JS
 * sees.
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import CardImageControls, {
	ABSOLUTE_UNIT_OPTIONS,
} from '../../components/card-image';
import CardImage from '../../components/card-image/card-image';
import CardImagePlaceholder from '../../components/card-image/placeholder';
import getCardImageVars from '../../components/card-image/get-card-image-vars';
import useCardImagePreview from '../../components/card-image/use-card-image-preview';
import metadata from './block.json';
import './editor.scss';

const BASE_CLASS = 'wp-block-theatrum-card-scroll';

// Two sections, modelled on the "Card, detailed scroll + gallery" pattern: a header that stays put
// and a body that scrolls. `metadata.name` is what labels each one in the List View; the classes
// are what style.scss lays them out by. `max-line-two` is the theme's title-overflow utility.
const TEMPLATE = [
	[
		'core/group',
		{
			className: `${ BASE_CLASS }__header`,
			metadata: { name: __( 'Card header', 'theatrum-blocks' ) },
			layout: { type: 'constrained' },
		},
		[
			[
				'core/heading',
				{
					level: 3,
					className: 'max-line-two',
					placeholder: __( 'Card heading', 'theatrum-blocks' ),
				},
			],
		],
	],
	[
		'core/group',
		{
			className: `${ BASE_CLASS }__body`,
			metadata: { name: __( 'Card body', 'theatrum-blocks' ) },
			layout: { type: 'constrained' },
		},
		[
			[
				'core/paragraph',
				{
					placeholder: __( 'Description…', 'theatrum-blocks' ),
				},
			],
		],
	],
];

const DEFAULTS = Object.fromEntries(
	Object.entries( metadata.attributes ).map( ( [ key, schema ] ) => [
		key,
		schema.default,
	] )
);

export default function Edit( { attributes, setAttributes, context } ) {
	const { imageSizeSlug } = attributes;

	// The image slot previews what render.php will print — including, with "Use featured image"
	// on, the featured image of the post in context.
	const image = useCardImagePreview( attributes, context );
	const imageStyle = getCardImageVars( attributes, { aspectRatio: false } );

	const blockProps = useBlockProps();

	// The text column carries the band height too, not just the panel: that definite height is
	// what stops the column growing with its copy and lets the body section scroll. Mirrors the
	// `theatrum_card_height_style()` half of render.php.
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: `${ BASE_CLASS }__content`,
			style: {
				'--theatrum-card-image-height':
					imageStyle[ '--theatrum-card-image-height' ],
			},
		},
		{
			template: TEMPLATE,
			templateLock: false,
			renderAppender: InnerBlocks.ButtonBlockAppender,
		}
	);

	const onSelectImage = ( selected ) => {
		const sizeData =
			selected.sizes?.[ imageSizeSlug ] || selected.sizes?.full;
		setAttributes( {
			mediaId: selected.id,
			mediaUrl: sizeData?.url || selected.url,
			mediaAlt: selected.alt || '',
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Scroll reveal card', 'theatrum-blocks' ) }
				>
					<p>
						{ __(
							'On the front end the image panel grows out from the leading edge as this card scrolls onto the screen, pushing the text across with it.',
							'theatrum-blocks'
						) }
					</p>
					<p>
						{ __(
							'Height sets how tall the card is — image panel and text column both — so the card keeps its height while the reveal runs.',
							'theatrum-blocks'
						) }
					</p>
					<p>
						{ __(
							'The text column is two groups: the header fits its content and stays put, and the body takes the height left over and scrolls if it needs to.',
							'theatrum-blocks'
						) }
					</p>
				</PanelBody>
			</InspectorControls>
			<CardImageControls
				attributes={ attributes }
				setAttributes={ setAttributes }
				defaults={ DEFAULTS }
				showAspectRatio={ false }
				// No `%`: the card has no height of its own for a percentage to resolve against,
				// so one would quietly leave the card sized by its content — the opposite of the
				// fixed band the body scrolls inside.
				heightUnits={ ABSOLUTE_UNIT_OPTIONS }
				heightHelp={ __(
					'The height of the whole card — the body scrolls if its content is taller.',
					'theatrum-blocks'
				) }
			/>
			<div { ...blockProps }>
				{ image.url ? (
					<CardImage
						baseClass={ BASE_CLASS }
						url={ image.url }
						alt={ image.alt }
						style={ imageStyle }
					/>
				) : (
					<CardImagePlaceholder
						baseClass={ BASE_CLASS }
						onSelect={ onSelectImage }
						style={ imageStyle }
						notice={ image.notice }
					/>
				) }
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
