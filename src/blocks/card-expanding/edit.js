/**
 * Expanding Card editor. The card's text is nested blocks — real blocks the author selects and
 * edits like any others, seeded by TEMPLATE as two groups: a header (the heading view.js turns
 * into the disclosure trigger) and a body (what opens). Same split `theatrum/card-scroll` uses —
 * only the classes matter, and they're what view.js and style.scss hook the behaviour onto. The
 * image is not a nested block: it's a block attribute picked and sized from the sidebar
 * (<CardImageControls>), so its dimensions are independent of the content flow.
 *
 * Content stays fully expanded while authoring: the click-to-collapse behaviour is a front-end
 * enhancement wired by view.js, and collapsing it here would hide the very blocks this exists to
 * expose.
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { PanelBody, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import CardImageControls from '../../components/card-image';
import CardImage from '../../components/card-image/card-image';
import CardImagePlaceholder from '../../components/card-image/placeholder';
import getCardImageVars from '../../components/card-image/get-card-image-vars';
import useCardImagePreview from '../../components/card-image/use-card-image-preview';
import metadata from './block.json';
import './editor.scss';

const BASE_CLASS = 'wp-block-theatrum-card-expanding';

// Two sections: a header holding the heading view.js turns into the disclosure trigger, and a
// body that opens/closes beneath it. `metadata.name` is what labels each one in the List View;
// the classes are what view.js finds them by. `line-clamp-1` is the theme's title-overflow
// utility.
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

// The heading usually sits inside the header group now, not as a direct child of the card, so
// this has to look past the top level — same reasoning as view.js falling back for content
// saved before the header/body split.
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
	const { imageSizeSlug } = attributes;

	// The image slot previews what render.php will print — including, with "Use featured image"
	// on, the featured image of the post in context.
	const image = useCardImagePreview( attributes, context );
	const imageStyle = getCardImageVars( attributes );

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(
		{ className: `${ BASE_CLASS }__content` },
		{
			template: TEMPLATE,
			templateLock: false,
			renderAppender: InnerBlocks.ButtonBlockAppender,
		}
	);

	// view.js needs a heading to turn into the disclosure button; without one the card just
	// renders open, so say so here rather than leaving the author to find out on the front end.
	const hasHeading = useSelect(
		( select ) =>
			containsHeading( select( blockEditorStore ).getBlocks( clientId ) ),
		[ clientId ]
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
				<PanelBody title={ __( 'Expanding card', 'theatrum-blocks' ) }>
					<p>
						{ __(
							'On the front end a visitor can click anywhere on the card to reveal the body; the header stays put. Here every block stays visible so you can edit it.',
							'theatrum-blocks'
						) }
					</p>
					{ ! hasHeading && (
						<Notice status="warning" isDismissible={ false }>
							{ __(
								'No Heading block: without one there is nothing for a visitor to click, so this card will render permanently open.',
								'theatrum-blocks'
							) }
						</Notice>
					) }
				</PanelBody>
			</InspectorControls>
			<CardImageControls
				attributes={ attributes }
				setAttributes={ setAttributes }
				defaults={ DEFAULTS }
				heightHelp={ __(
					'Applies when Aspect Ratio is set to Auto.',
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
