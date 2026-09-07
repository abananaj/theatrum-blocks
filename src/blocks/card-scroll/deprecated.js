/**
 * Three earlier shapes, newest first.
 *
 * v3 rendered entirely from saved markup. It was dropped when the image gained a "use the
 * post's featured image" option: a featured image resolves per post — each queried post in a
 * Query Loop — which saved HTML can't express, so the block now renders server-side and saves
 * only its nested blocks. Nothing but the markup changed, so there's no `migrate`.
 *
 * v2 held the image as a nested `core/image` block. It was dropped because an image inside the
 * content flow can't be given a width, height or object fit of its own without fighting
 * core/image's controls — the picture is now a block attribute sized from the sidebar, and
 * `migrate` lifts the nested image's id/url/alt back out into those attributes.
 *
 * v1 held image *and* text as fixed attributes, with no way to nest or reorder anything;
 * `migrate` turns its title/description into the core blocks they should always have been.
 *
 * Each `save` must stay a byte-for-byte match of the output that version shipped, or the parser
 * won't recognise that content and the migration never runs.
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	RichText,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import getCardImageVars from '../../components/card-image/get-card-image-vars';
import metadata from './block.json';

const SUPPORTS = {
	html: false,
	anchor: true,
	spacing: { margin: true, padding: true },
	color: {
		text: true,
		background: true,
		gradients: true,
		__experimentalDefaultControls: { background: false, text: false },
	},
};

// Image geometry the two old shapes never had — without these the migrated block would carry
// undefined sizing attributes and the Inspector would open on empty fields.
const IMAGE_DEFAULTS = {
	imageSizeSlug: metadata.attributes.imageSizeSlug.default,
	imageWidth: metadata.attributes.imageWidth.default,
	imageWidthUnit: metadata.attributes.imageWidthUnit.default,
	imageHeight: metadata.attributes.imageHeight.default,
	imageHeightUnit: metadata.attributes.imageHeightUnit.default,
	imageObjectFit: metadata.attributes.imageObjectFit.default,
};

const v3 = {
	attributes: metadata.attributes,
	supports: SUPPORTS,
	save( { attributes } ) {
		const { mediaUrl, mediaAlt } = attributes;
		const blockProps = useBlockProps.save( {
			style: getCardImageVars( attributes, { aspectRatio: false } ),
		} );
		const innerBlocksProps = useInnerBlocksProps.save( {
			className: 'wp-block-theatrum-card-scroll__content',
		} );

		return (
			<div { ...blockProps }>
				{ mediaUrl && (
					<div className="wp-block-theatrum-card-scroll__image">
						<img src={ mediaUrl } alt={ mediaAlt || '' } />
					</div>
				) }
				<div { ...innerBlocksProps } />
			</div>
		);
	},
};

const v2 = {
	attributes: {},
	supports: SUPPORTS,
	save() {
		const blockProps = useBlockProps.save();
		const innerBlocksProps = useInnerBlocksProps.save( blockProps );

		return <div { ...innerBlocksProps } />;
	},
	migrate( attributes, innerBlocks ) {
		const [ first, ...rest ] = innerBlocks;

		if ( first?.name !== 'core/image' ) {
			return [ { ...attributes, ...IMAGE_DEFAULTS }, innerBlocks ];
		}

		return [
			{
				...attributes,
				...IMAGE_DEFAULTS,
				mediaId: first.attributes.id || 0,
				mediaUrl: first.attributes.url || '',
				mediaAlt: first.attributes.alt || '',
			},
			rest,
		];
	},
};

const v1 = {
	attributes: {
		mediaId: { type: 'number', default: 0 },
		mediaUrl: { type: 'string', default: '' },
		mediaAlt: { type: 'string', default: '' },
		title: {
			type: 'rich-text',
			source: 'rich-text',
			selector: '.wp-block-theatrum-card-scroll__title',
			default: '',
		},
		description: {
			type: 'rich-text',
			source: 'rich-text',
			selector: '.wp-block-theatrum-card-scroll__description',
			default: '',
		},
	},
	supports: SUPPORTS,
	save( { attributes } ) {
		const { mediaUrl, mediaAlt, title, description } = attributes;
		const blockProps = useBlockProps.save();

		return (
			<div { ...blockProps }>
				<div className="wp-block-theatrum-card-scroll__image">
					{ mediaUrl && <img src={ mediaUrl } alt={ mediaAlt } /> }
				</div>
				<div className="wp-block-theatrum-card-scroll__info">
					<RichText.Content
						tagName="h3"
						className="wp-block-theatrum-card-scroll__title max-line-two"
						value={ title }
					/>
					<RichText.Content
						tagName="p"
						className="wp-block-theatrum-card-scroll__description"
						value={ description }
					/>
				</div>
			</div>
		);
	},
	migrate( attributes ) {
		const { title, description, ...rest } = attributes;
		const innerBlocks = [];

		if ( title ) {
			innerBlocks.push(
				createBlock( 'core/heading', {
					level: 3,
					className: 'max-line-two',
					content: title,
				} )
			);
		}

		if ( description ) {
			innerBlocks.push(
				createBlock( 'core/paragraph', { content: description } )
			);
		}

		return [ { ...rest, ...IMAGE_DEFAULTS }, innerBlocks ];
	},
};

export default [ v3, v2, v1 ];
