/**
 * Editor-only extension bringing theatrum/carousel's and theatrum/slider's options to the is-style-ct-carousel/is-style-ct-slider formats (core/query & core/gallery styled as a carousel/slider — see src/formats/), following the same registerBlockType/BlockEdit/BlockListBlock/getSaveContent.extraProps shape as chance-ollie's ctGridColumns/ctGridSpan. Attributes are namespaced `ct*` for the same reason.
 *
 * Arrow attributes are shared by both formats (mutually exclusive per block, so a value set under one style carries over if switched to the other); which format is active picks the CSS var prefix/modifier classes, and only carousel gets Grid Gap (core/query-only — core/gallery has native gap support) while only slider gets Autoplay (neither format has any autoplay mechanism otherwise).
 *
 * Server-side counterpart: inc/format-controls.php (render_block filter for core/query, which has no saved markup to extend here).
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
 * Builds the modifier classes + inline CSS vars for a carousel-/slider-format instance, shared by the BlockListBlock and getSaveContent.extraProps filters below.
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
 * Builds the data-autoplay/data-autoplay-speed attributes src/formats/slider.js reads off the format root, for a slider-format instance.
 */
function buildAutoplayAttributes( attributes ) {
	return {
		'data-autoplay': attributes.ctAutoplay ? 'true' : 'false',
		'data-autoplay-speed': String( attributes.ctAutoplaySpeed ?? 5000 ),
	};
}

/* 1. Register shared arrow attributes on core/query & core/gallery, gap attributes on core/query only, autoplay attributes on both. */
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

/* 3. Reflect classes + CSS vars (+ data-autoplay* for slider) on the editor canvas wrapper. Arrow vars have no visible effect yet — the arrow buttons are built by frontend-only JS (src/formats/carousel.js, slider.js), so there's no arrow DOM in the canvas. Carousel Grid Gap IS visible immediately (canvas already has .wp-block-post-template + the var). Setting the rest anyway is harmless and future-proofs the arrow-DOM limitation being lifted later. */
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

/* 4. Persist classes + CSS vars + (for slider) data-autoplay* into saved markup for static core/gallery (core/query is dynamic — see inc/format-controls.php for its render-time equivalent). */
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
			// props.style is a plain object here — merge as an object, never string-concatenate (silently produces literal "[object Object]" and destroys other user-set styles).
			style: { ...props.style, ...style },
		};
	}
);
