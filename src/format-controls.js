/**
 * Editor-only extension bringing the native theatrum/carousel and
 * theatrum/slider blocks' options to the is-style-ct-carousel and
 * is-style-ct-slider formats (core/query and core/gallery styled as a
 * carousel/slider — see src/formats/). Follows the same registerBlockType /
 * BlockEdit / BlockListBlock / getSaveContent.extraProps shape
 * chance-ollie's ctGridColumns/ctGridSpan use to extend core blocks (see
 * wp-content/themes/chance-ollie/inc/grid-columns/js/editor.js) — this
 * codebase's only other precedent for this kind of extension.
 *
 * Attributes are namespaced `ct*` (ctArrowPosition, ctCarouselGap, ...) so
 * they read as this plugin's addition in the inspector/JSON, matching that
 * same ctGridColumns/ctGridSpan convention — even though a literal
 * collision with the native blocks' bare `arrowPosition` etc. is impossible
 * (attributes are scoped per block type).
 *
 * The arrow attributes (ctArrowPosition/ctArrowBackground/ctArrowColor/
 * ctArrowBackgroundColor/ctArrowSize/ctArrowSizeUnit) are shared by BOTH
 * formats rather than duplicated per-format — is-style-ct-carousel and
 * is-style-ct-slider are mutually exclusive on a given block, so one block
 * only ever has one of them active, and reusing the same attributes means a
 * value set while styled as one carries over if the style is later switched
 * to the other. Which format is actually active determines which CSS
 * custom-property prefix / modifier class names get emitted (carousel:
 * --ct-arrow-*, .theatrum-arrows-*; slider: --tm-arrow-*,
 * .tm-slider-arrows-*), and only carousel gets a Grid Gap control (no
 * per-item gap concept for a one-slide-visible-at-a-time slider) while only
 * slider gets Autoplay controls (core/query/core/gallery have no existing
 * autoplay mechanism at all today — src/formats/slider.js reads
 * root.dataset.autoplay, which nothing currently sets for either format).
 *
 * core/gallery already has native gap support (Styles > Dimensions), so
 * Grid Gap is carousel-only AND core/query-only here — its own gap control
 * lives one level down on its child core/post-template block.
 *
 * Server-side counterpart: inc/format-controls.php (render_block filter for
 * core/query, which is dynamic and has no saved markup to extend here).
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	SelectControl,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ArrowControls from './components/arrow-controls';
import getArrowStyleVars from './components/arrow-controls/get-arrow-style-vars';

const CAROUSEL_STYLE_SLUG = 'is-style-ct-carousel';
const SLIDER_STYLE_SLUG = 'is-style-ct-slider';
const TARGET_BLOCKS = ( window.theatrumFormatControls || {} ).blocks || [
	'core/query',
	'core/gallery',
];
const GAP_ELIGIBLE_BLOCKS = [ 'core/query' ];

const UNIT_OPTIONS = [
	{ label: 'px', value: 'px' },
	{ label: '%', value: '%' },
	{ label: 'em', value: 'em' },
	{ label: 'rem', value: 'rem' },
];

const ARROW_ATTRIBUTES = {
	ctArrowPosition: {
		type: 'string',
		default: 'outside',
		enum: [ 'outside', 'inside', 'hidden' ],
	},
	ctArrowBackground: { type: 'boolean', default: true },
	ctArrowColor: { type: 'string', default: '' },
	ctArrowBackgroundColor: { type: 'string', default: '' },
	ctArrowSize: { type: 'string', default: '' },
	ctArrowSizeUnit: {
		type: 'string',
		default: 'px',
		enum: [ 'px', '%', 'em', 'rem' ],
	},
};

const GAP_ATTRIBUTES = {
	ctCarouselGap: { type: 'string', default: '' },
	ctCarouselGapUnit: {
		type: 'string',
		default: 'px',
		enum: [ 'px', '%', 'em', 'rem' ],
	},
};

const AUTOPLAY_ATTRIBUTES = {
	ctAutoplay: { type: 'boolean', default: false },
	ctAutoplaySpeed: {
		type: 'number',
		default: 5000,
		minimum: 100,
		maximum: 10000,
	},
};

function isTargetBlock( name ) {
	return TARGET_BLOCKS.includes( name );
}

function hasStyle( attributes, slug ) {
	return ( attributes?.className || '' ).split( /\s+/ ).includes( slug );
}

function isCarouselFormatBlock( name, attributes ) {
	return isTargetBlock( name ) && hasStyle( attributes, CAROUSEL_STYLE_SLUG );
}

function isSliderFormatBlock( name, attributes ) {
	return isTargetBlock( name ) && hasStyle( attributes, SLIDER_STYLE_SLUG );
}

function isArrowFormatBlock( name, attributes ) {
	return (
		isCarouselFormatBlock( name, attributes ) ||
		isSliderFormatBlock( name, attributes )
	);
}

/**
 * Builds the modifier classes + inline CSS vars for a carousel- or
 * slider-format instance, shared by the BlockListBlock (canvas preview) and
 * getSaveContent.extraProps (static core/gallery) filters below.
 */
function buildFormatModifiers( name, attributes ) {
	const classes = [];
	let style = {};

	if ( isCarouselFormatBlock( name, attributes ) ) {
		if ( 'inside' === attributes.ctArrowPosition ) {
			classes.push( 'theatrum-arrows-inside' );
		} else if ( 'hidden' === attributes.ctArrowPosition ) {
			classes.push( 'theatrum-arrows-hidden' );
		}
		style = getArrowStyleVars( attributes, {
			prefix: 'ct-arrow',
			attributePrefix: 'ct',
		} );
		if ( GAP_ELIGIBLE_BLOCKS.includes( name ) && attributes.ctCarouselGap ) {
			style[ '--ct-carousel-gap' ] = `${ attributes.ctCarouselGap }${
				attributes.ctCarouselGapUnit || 'px'
			}`;
		}
	} else if ( isSliderFormatBlock( name, attributes ) ) {
		if ( 'inside' === attributes.ctArrowPosition ) {
			classes.push( 'tm-slider-arrows-inside' );
		} else if ( 'hidden' === attributes.ctArrowPosition ) {
			classes.push( 'tm-slider-arrows-hidden' );
		}
		style = getArrowStyleVars( attributes, {
			prefix: 'tm-arrow',
			attributePrefix: 'ct',
		} );
	}

	Object.keys( style ).forEach( ( key ) => {
		if ( undefined === style[ key ] ) {
			delete style[ key ];
		}
	} );

	return { classes, style };
}

/**
 * Builds the data-autoplay/data-autoplay-speed attributes
 * src/formats/slider.js reads off the format root, for a slider-format
 * instance.
 */
function buildAutoplayAttributes( attributes ) {
	return {
		'data-autoplay': attributes.ctAutoplay ? 'true' : 'false',
		'data-autoplay-speed': String( attributes.ctAutoplaySpeed ?? 5000 ),
	};
}

/* 1. Register the shared arrow attributes on core/query & core/gallery, the
 * gap attributes on core/query only, and the autoplay attributes on
 * core/query & core/gallery. */
addFilter(
	'blocks.registerBlockType',
	'theatrum-blocks/format-controls/attributes',
	( settings, name ) => {
		if ( ! isTargetBlock( name ) ) {
			return settings;
		}
		const attributes = {
			...settings.attributes,
			...ARROW_ATTRIBUTES,
			...AUTOPLAY_ATTRIBUTES,
		};
		if ( GAP_ELIGIBLE_BLOCKS.includes( name ) ) {
			Object.assign( attributes, GAP_ATTRIBUTES );
		}
		return { ...settings, attributes };
	}
);

/* 2. Inspector panels — shown based on which format style is active. */
const withFormatInspectorControls = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		if ( ! isArrowFormatBlock( props.name, props.attributes ) ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes } = props;
		const isCarousel = isCarouselFormatBlock( props.name, attributes );
		const isSlider = isSliderFormatBlock( props.name, attributes );

		return (
			<Fragment>
				<BlockEdit { ...props } />
				{ isCarousel && GAP_ELIGIBLE_BLOCKS.includes( props.name ) && (
					<InspectorControls>
						<PanelBody
							title={ __( 'Carousel Layout', 'theatrum-blocks' ) }
							initialOpen={ false }
						>
							<div style={ { display: 'flex', gap: '8px' } }>
								<TextControl
									label={ __( 'Grid Gap', 'theatrum-blocks' ) }
									value={ attributes.ctCarouselGap }
									onChange={ ( value ) =>
										setAttributes( { ctCarouselGap: value } )
									}
									type="number"
									min="0"
									help={ __(
										'Space between cards. Leave empty for the default.',
										'theatrum-blocks'
									) }
									__nextHasNoMarginBottom
									__next40pxDefaultSize
									style={ { flex: 1 } }
								/>
								<SelectControl
									label={ __( 'Unit', 'theatrum-blocks' ) }
									value={ attributes.ctCarouselGapUnit }
									options={ UNIT_OPTIONS }
									onChange={ ( value ) =>
										setAttributes( {
											ctCarouselGapUnit: value,
										} )
									}
									__nextHasNoMarginBottom
									style={ { width: '80px' } }
								/>
							</div>
						</PanelBody>
					</InspectorControls>
				) }
				{ isSlider && (
					<InspectorControls>
						<PanelBody
							title={ __( 'Slider Settings', 'theatrum-blocks' ) }
							initialOpen={ false }
						>
							<ToggleControl
								label={ __( 'Autoplay', 'theatrum-blocks' ) }
								checked={ !! attributes.ctAutoplay }
								onChange={ ( value ) =>
									setAttributes( { ctAutoplay: value } )
								}
								help={ __(
									'Automatically advance to the next slide',
									'theatrum-blocks'
								) }
							/>
							{ attributes.ctAutoplay && (
								<RangeControl
									label={ __(
										'Autoplay speed (ms)',
										'theatrum-blocks'
									) }
									value={ attributes.ctAutoplaySpeed }
									onChange={ ( value ) =>
										setAttributes( {
											ctAutoplaySpeed: value,
										} )
									}
									min={ 100 }
									max={ 10000 }
									step={ 100 }
								/>
							) }
						</PanelBody>
					</InspectorControls>
				) }
				<ArrowControls
					attributes={ attributes }
					setAttributes={ setAttributes }
					positions={ [ 'outside', 'inside', 'hidden' ] }
					attributePrefix="ct"
				/>
			</Fragment>
		);
	},
	'withFormatInspectorControls'
);
addFilter(
	'editor.BlockEdit',
	'theatrum-blocks/format-controls/inspector',
	withFormatInspectorControls
);

/* 3. Reflect classes + CSS vars (and, for slider, the data-autoplay*
 * attributes) on the editor canvas wrapper. Note: arrow vars have no
 * visible effect here yet — the formats' arrow buttons are built by
 * frontend-only JS (src/formats/carousel.js, src/formats/slider.js), so
 * there's no arrow DOM in the canvas to style. Carousel Grid Gap *is*
 * visible immediately, since .wp-block-post-template already exists in the
 * canvas and the format's own CSS already reads var(--ct-carousel-gap,
 * ...). Setting the other vars/attributes anyway is harmless and keeps
 * this in sync if the arrow-DOM limitation is lifted later. */
const withFormatEditorClass = createHigherOrderComponent(
	( BlockListBlock ) => ( props ) => {
		const isCarousel = isCarouselFormatBlock( props.name, props.attributes );
		const isSlider = isSliderFormatBlock( props.name, props.attributes );
		if ( ! isCarousel && ! isSlider ) {
			return <BlockListBlock { ...props } />;
		}

		const { classes, style } = buildFormatModifiers(
			props.name,
			props.attributes
		);
		const extraWrapperProps = isSlider
			? buildAutoplayAttributes( props.attributes )
			: {};

		if (
			! classes.length &&
			! Object.keys( style ).length &&
			! Object.keys( extraWrapperProps ).length
		) {
			return <BlockListBlock { ...props } />;
		}

		const nextClassName = [ props.className, ...classes ]
			.filter( Boolean )
			.join( ' ' );
		const nextWrapperProps = {
			...props.wrapperProps,
			...extraWrapperProps,
			style: { ...props.wrapperProps?.style, ...style },
		};

		return (
			<BlockListBlock
				{ ...props }
				className={ nextClassName }
				wrapperProps={ nextWrapperProps }
			/>
		);
	},
	'withFormatEditorClass'
);
addFilter(
	'editor.BlockListBlock',
	'theatrum-blocks/format-controls/editor-class',
	withFormatEditorClass
);

/* 4. Persist classes + CSS vars + (for slider) data-autoplay* into saved
 * markup for the static core/gallery block (core/query is dynamic — see
 * inc/format-controls.php for its render-time equivalent). */
addFilter(
	'blocks.getSaveContent.extraProps',
	'theatrum-blocks/format-controls/save-props',
	( props, blockType, attributes ) => {
		const isCarousel = isCarouselFormatBlock( blockType.name, attributes );
		const isSlider = isSliderFormatBlock( blockType.name, attributes );
		if (
			'core/gallery' !== blockType.name ||
			( ! isCarousel && ! isSlider )
		) {
			return props;
		}

		const { classes, style } = buildFormatModifiers(
			blockType.name,
			attributes
		);
		const extraProps = isSlider ? buildAutoplayAttributes( attributes ) : {};

		if (
			! classes.length &&
			! Object.keys( style ).length &&
			! Object.keys( extraProps ).length
		) {
			return props;
		}

		return {
			...props,
			...extraProps,
			className: [ props.className, ...classes ]
				.filter( Boolean )
				.join( ' ' ),
			// props.style is a plain object here (only serialized to a
			// string attribute at final render) — merge as an object, never
			// string-concatenate (that silently produces the literal text
			// "[object Object]" and destroys other styles the user set).
			style: { ...props.style, ...style },
		};
	}
);
