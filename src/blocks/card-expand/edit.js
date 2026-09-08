/**
 * Expand Card editor. The card's text is nested blocks — real blocks the author selects and
 * edits like any others, seeded by TEMPLATE as two groups: a header (what view.js turns into the
 * disclosure trigger — a heading if there is one, otherwise the header's content generally) and a
 * body (what opens/reveals). Same split `theatrum/card-scroll` uses — only the classes matter, and
 * they're what view.js and style.scss hook the behaviour onto. The image is not a nested block:
 * it's a block attribute picked and sized from the sidebar (<CardImageControls>), so its
 * dimensions are independent of the content flow.
 *
 * Reveal Style (`revealStyle`) picks which of two mechanics view.js/style.scss wire up on the
 * front end:
 *   - "expand" (default): the body opens beneath a heading that stays put, out of the page's flow
 *     so the card keeps its closed footprint and nothing below it moves.
 *   - "overlay": the whole header+body panel slides up to cover an edge-to-edge image — the
 *     image's Width control has nothing to do here, so it's hidden.
 *
 * Activate On (`activateOn`) is the independent second axis — what triggers that reveal: a click
 * (default) or hovering the card. Hover mode has no control to click, which is why it alone offers
 * `linkImageToPost`: the link is both the card's own call to action and the tab stop a keyboard
 * visitor reveals the card from.
 *
 * Content stays fully expanded/visible while authoring however it's set: the reveal is a front-end
 * enhancement wired by view.js, and hiding it here would hide the very blocks this exists to
 * expose. The same goes for the front-end-only markup render.php adds — overlay mode's `__frame`
 * wrapper and hover mode's image link — which the canvas never draws.
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import {
	PanelBody,
	Notice,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
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

const BASE_CLASS = 'wp-block-theatrum-card-expand';

const REVEAL_STYLE_OPTIONS = [
	{ label: __( 'Expand', 'theatrum-blocks' ), value: 'expand' },
	{ label: __( 'Overlay', 'theatrum-blocks' ), value: 'overlay' },
];

const ACTIVATE_ON_OPTIONS = [
	{ label: __( 'Click', 'theatrum-blocks' ), value: 'click' },
	{ label: __( 'Hover', 'theatrum-blocks' ), value: 'hover' },
];

// Two sections: a header (view.js turns its heading, or failing that its whole content, into the
// disclosure trigger), and a body that opens/reveals with it. `metadata.name` is what labels each
// one in the List View; the classes are what view.js finds them by. `line-clamp-1` is the theme's
// title-overflow utility.
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
					className: 'line-clamp-1',
					placeholder: __( 'Card title', 'theatrum-blocks' ),
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
					placeholder: __(
						'Description shown when the card opens…',
						'theatrum-blocks'
					),
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

// A heading isn't required inside the header group — view.js falls back to the whole group when
// there isn't one, so any block in there is enough. Only content saved before the header/body
// split (a flat run with no groups at all) still needs an actual heading, since that's the only
// boundary Expand mode's fallback heuristic has to find.
const findGroupByClassName = ( blocks, className ) => {
	for ( const block of blocks ) {
		if (
			( block.attributes?.className || '' )
				.split( ' ' )
				.includes( className )
		) {
			return block;
		}
		const found = findGroupByClassName(
			block.innerBlocks || [],
			className
		);
		if ( found ) {
			return found;
		}
	}
	return null;
};

const containsHeading = ( blocks ) =>
	blocks.some(
		( block ) =>
			block.name === 'core/heading' ||
			containsHeading( block.innerBlocks || [] )
	);

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	context,
} ) {
	const { imageSizeSlug, revealStyle, activateOn, linkImageToPost } =
		attributes;
	const isOverlay = revealStyle === 'overlay';
	const isHover = activateOn === 'hover';

	// The image slot previews what render.php will print — including, with "Use featured image"
	// on, the featured image of the post in context.
	const image = useCardImagePreview( attributes, context );
	const imageStyle = getCardImageVars( attributes );

	const blockProps = useBlockProps( {
		className:
			[ isOverlay && 'is-overlay', isHover && 'is-hover' ]
				.filter( Boolean )
				.join( ' ' ) || undefined,
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: `${ BASE_CLASS }__content` },
		{
			template: TEMPLATE,
			templateLock: false,
			renderAppender: InnerBlocks.ButtonBlockAppender,
		}
	);

	// An empty header is a problem in every combination, though for different reasons: click mode
	// needs something to turn into the disclosure trigger (or, in overlay mode, its accessible
	// label), and hover mode needs something to show before the card opens. A heading if the header
	// holds one, otherwise the header group's content generally, or (for a card saved before the
	// header/body split) a heading somewhere in the flat content — say so here rather than leaving
	// the author to find out on the front end.
	const hasTrigger = useSelect(
		( select ) => {
			const blocks = select( blockEditorStore ).getBlocks( clientId );
			const header = findGroupByClassName(
				blocks,
				`${ BASE_CLASS }__header`
			);

			return header
				? header.innerBlocks.length > 0
				: containsHeading( blocks );
		},
		[ clientId ]
	);

	let emptyHeaderNotice;
	if ( isHover ) {
		emptyHeaderNotice = __(
			'Empty Card header: put something inside it — it is the only part of the card a visitor sees before it opens.',
			'theatrum-blocks'
		);
	} else if ( isOverlay ) {
		emptyHeaderNotice = __(
			'Empty Card header: put something inside it — it is the only part of the panel a visitor sees before the card is opened, and it names the card for screen readers.',
			'theatrum-blocks'
		);
	} else {
		emptyHeaderNotice = __(
			'Empty Card header: put something inside it for a visitor to click — without that, this card will render permanently open.',
			'theatrum-blocks'
		);
	}

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
				<PanelBody title={ __( 'Expand card', 'theatrum-blocks' ) }>
					<SelectControl
						label={ __( 'Reveal Style', 'theatrum-blocks' ) }
						value={ revealStyle }
						options={ REVEAL_STYLE_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { revealStyle: value } )
						}
					/>
					{ isOverlay ? (
						<>
							<p>
								{ __(
									'On the front end the card looks like an Expand one until it opens: the image, with the header below it. Opening it slides the header and body up over the image as one panel, resting on the card’s bottom edge. Here every block stays visible so you can edit it.',
									'theatrum-blocks'
								) }
							</p>
							<p>
								{ __(
									'The body scrolls on its own if the panel would otherwise reach past the top of the card — the header always stays put directly above it.',
									'theatrum-blocks'
								) }
							</p>
						</>
					) : (
						<p>
							{ __(
								'On the front end the body opens beneath the header, which stays put. The card keeps the size it has closed and the body hangs over whatever is below it, so opening one never shifts the rest of the page. Here every block stays visible so you can edit it.',
								'theatrum-blocks'
							) }
						</p>
					) }
					<SelectControl
						label={ __( 'Activate On', 'theatrum-blocks' ) }
						value={ activateOn }
						options={ ACTIVATE_ON_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { activateOn: value } )
						}
					/>
					{ isHover ? (
						<>
							<p>
								{ __(
									'The card opens while a visitor hovers over it — or tabs into it — and closes again as soon as they move away. Touch screens have no hover, so there the card falls back to opening on tap.',
									'theatrum-blocks'
								) }
							</p>
							<ToggleControl
								label={ __(
									'Link the image to the post',
									'theatrum-blocks'
								) }
								help={ __(
									'Links the image to the post this card is rendering — each queried post in turn inside a Query Loop. With no click needed to open the card, this is also how someone using a keyboard reaches it: tabbing to the link opens the card.',
									'theatrum-blocks'
								) }
								checked={ !! linkImageToPost }
								onChange={ ( value ) =>
									setAttributes( { linkImageToPost: value } )
								}
							/>
						</>
					) : (
						<p>
							{ __(
								'A visitor clicks anywhere on the card to open it. Clicking it again — or clicking anywhere outside it — closes it.',
								'theatrum-blocks'
							) }
						</p>
					) }
					{ ! hasTrigger && (
						<Notice status="warning" isDismissible={ false }>
							{ emptyHeaderNotice }
						</Notice>
					) }
				</PanelBody>
			</InspectorControls>
			<CardImageControls
				attributes={ attributes }
				setAttributes={ setAttributes }
				defaults={ DEFAULTS }
				showWidth={ ! isOverlay }
				heightUnits={ isOverlay ? ABSOLUTE_UNIT_OPTIONS : undefined }
				heightHelp={
					isOverlay
						? __(
								'The height of the image; the card adds the header beneath it. The body scrolls if the panel has more to show than that.',
								'theatrum-blocks'
						  )
						: __(
								'Applies when Aspect Ratio is set to Auto.',
								'theatrum-blocks'
						  )
				}
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
