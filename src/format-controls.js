/**
 * Editor-only extension bringing theatrum/carousel's Grid Gap + Arrow Styles
 * options to the is-style-ct-carousel format (core/query and core/gallery
 * styled as a carousel — see src/formats/). Follows the same
 * registerBlockType / BlockEdit / BlockListBlock / getSaveContent.extraProps
 * shape chance-ollie's ctGridColumns/ctGridSpan use to extend core blocks
 * (see wp-content/themes/chance-ollie/inc/grid-columns/js/editor.js) — this
 * codebase's only other precedent for this kind of extension.
 *
 * Attributes are namespaced `ct*` (ctArrowPosition, ctCarouselGap, ...) so
 * they read as this plugin's addition in the inspector/JSON, matching that
 * same ctGridColumns/ctGridSpan convention — even though a literal
 * collision with the native theatrum/carousel block's bare `arrowPosition`
 * etc. is impossible (attributes are scoped per block type).
 *
 * core/gallery already has native gap support (Styles > Dimensions), so it
 * doesn't get the Grid Gap control here — only core/query does, whose own
 * gap control lives one level down on its child core/post-template block.
 *
 * Server-side counterpart: inc/format-controls.php (render_block filter for
 * core/query, which is dynamic and has no saved markup to extend here).
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ArrowControls from './components/arrow-controls';
import getArrowStyleVars from './components/arrow-controls/get-arrow-style-vars';

const STYLE_SLUG = 'is-style-ct-carousel';
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

function isTargetBlock( name ) {
	return TARGET_BLOCKS.includes( name );
}

function hasCarouselStyle( attributes ) {
	return ( attributes?.className || '' ).split( /\s+/ ).includes( STYLE_SLUG );
}

function isCarouselFormatBlock( name, attributes ) {
	return isTargetBlock( name ) && hasCarouselStyle( attributes );
}

/**
 * Builds the modifier classes + inline CSS vars for a carousel-format
 * instance, shared by the BlockListBlock (canvas preview) and
 * getSaveContent.extraProps (static core/gallery) filters below.
 */
function buildFormatModifiers( name, attributes ) {
	const classes = [];
	if ( 'inside' === attributes.ctArrowPosition ) {
		classes.push( 'theatrum-arrows-inside' );
	} else if ( 'hidden' === attributes.ctArrowPosition ) {
		classes.push( 'theatrum-arrows-hidden' );
	}

	const style = getArrowStyleVars( attributes, {
		prefix: 'ct-arrow',
		attributePrefix: 'ct',
	} );

	if ( GAP_ELIGIBLE_BLOCKS.includes( name ) && attributes.ctCarouselGap ) {
		style[ '--ct-carousel-gap' ] = `${ attributes.ctCarouselGap }${
			attributes.ctCarouselGapUnit || 'px'
		}`;
	}

	Object.keys( style ).forEach( ( key ) => {
		if ( undefined === style[ key ] ) {
			delete style[ key ];
		}
	} );

	return { classes, style };
}

/* 1. Register the arrow attributes on core/query & core/gallery, and the
 * gap attributes on core/query only. */
addFilter(
	'blocks.registerBlockType',
	'theatrum-blocks/format-controls/attributes',
	( settings, name ) => {
		if ( ! isTargetBlock( name ) ) {
			return settings;
		}
		const attributes = { ...settings.attributes, ...ARROW_ATTRIBUTES };
		if ( GAP_ELIGIBLE_BLOCKS.includes( name ) ) {
			Object.assign( attributes, GAP_ATTRIBUTES );
		}
		return { ...settings, attributes };
	}
);

/* 2. Inspector panel — only when the block style is is-style-ct-carousel. */
const withFormatInspectorControls = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		if ( ! isCarouselFormatBlock( props.name, props.attributes ) ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes } = props;

		return (
			<Fragment>
				<BlockEdit { ...props } />
				{ GAP_ELIGIBLE_BLOCKS.includes( props.name ) && (
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

/* 3. Reflect classes + CSS vars on the editor canvas wrapper. Note: arrow
 * vars have no visible effect here yet — the format's arrow buttons are
 * built by frontend-only JS (src/formats/carousel.js), so there's no arrow
 * DOM in the canvas to style. Grid Gap *is* visible immediately, since
 * .wp-block-post-template already exists in the canvas and the format's own
 * CSS already reads var(--ct-carousel-gap, ...). Setting the arrow vars
 * anyway is harmless and keeps this in sync if that limitation is lifted
 * later. */
const withFormatEditorClass = createHigherOrderComponent(
	( BlockListBlock ) => ( props ) => {
		if ( ! isCarouselFormatBlock( props.name, props.attributes ) ) {
			return <BlockListBlock { ...props } />;
		}

		const { classes, style } = buildFormatModifiers(
			props.name,
			props.attributes
		);
		if ( ! classes.length && ! Object.keys( style ).length ) {
			return <BlockListBlock { ...props } />;
		}

		const nextClassName = [ props.className, ...classes ]
			.filter( Boolean )
			.join( ' ' );
		const nextWrapperProps = {
			...props.wrapperProps,
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

/* 4. Persist classes + CSS vars into saved markup for the static
 * core/gallery block (core/query is dynamic — see inc/format-controls.php
 * for its render-time equivalent). */
addFilter(
	'blocks.getSaveContent.extraProps',
	'theatrum-blocks/format-controls/save-props',
	( props, blockType, attributes ) => {
		if (
			'core/gallery' !== blockType.name ||
			! hasCarouselStyle( attributes )
		) {
			return props;
		}

		const { classes, style } = buildFormatModifiers(
			blockType.name,
			attributes
		);
		if ( ! classes.length && ! Object.keys( style ).length ) {
			return props;
		}

		return {
			...props,
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
