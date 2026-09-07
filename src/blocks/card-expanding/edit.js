/**
 * Expanding Card editor. The card's text is nested blocks — heading and body are real blocks the
 * author selects and edits like any others, seeded by TEMPLATE. The image is not: it's a block
 * attribute picked and sized from the sidebar (<CardImageControls>), so its dimensions are
 * independent of the content flow and the front-end reveal can size it.
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

// The first heading is the toggle and everything after it is what opens (view.js).
// `line-clamp-1` is the theme's title-overflow utility.
const TEMPLATE = [
	[
		'core/heading',
		{
			level: 3,
			className: 'line-clamp-1',
			placeholder: __( 'Card title', 'theatrum-blocks' ),
		},
	],
	[
		'core/paragraph',
		{
			placeholder: __(
				'Description shown when the card opens…',
				'theatrum-blocks'
			),
		},
	],
];

const DEFAULTS = Object.fromEntries(
	Object.entries( metadata.attributes ).map( ( [ key, schema ] ) => [
		key,
		schema.default,
	] )
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
			select( blockEditorStore )
				.getBlocks( clientId )
				.some( ( block ) => block.name === 'core/heading' ),
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
							'On the front end the heading becomes the button that opens this card, and everything below it stays collapsed until a visitor clicks. Here every block stays visible so you can edit it.',
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
