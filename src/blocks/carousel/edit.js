/**
 * Carousel Block - Editor. Renders the same wrapper/controls markup as render.php for a WYSIWYG preview; cards are `theatrum/carousel-item` child blocks edited directly in the canvas, like a Group.
 */

import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	TextControl,
	SelectControl,
	ToggleControl,
	PanelBody,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import ArrowControls from '../../components/arrow-controls';
import getArrowStyleVars from '../../components/arrow-controls/get-arrow-style-vars';
import './editor.scss';

const TEMPLATE = [
	[ 'theatrum/carousel-item' ],
	[ 'theatrum/carousel-item' ],
	[ 'theatrum/carousel-item' ],
];

const UNIT_OPTIONS = [
	{ label: 'px', value: 'px' },
	{ label: '%', value: '%' },
	{ label: 'em', value: 'em' },
	{ label: 'rem', value: 'rem' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		cardWidth,
		cardWidthUnit,
		gap,
		gapUnit,
		arrowPosition,
		showScrollbar,
	} = attributes;
	const blockProps = useBlockProps( {
		className: classnames( {
			'theatrum-arrows-inside': arrowPosition === 'inside',
			'theatrum-arrows-hidden': arrowPosition === 'hidden',
			'theatrum-scrollbar-visible': showScrollbar,
		} ),
		style: getArrowStyleVars( attributes, { prefix: 'ct-arrow' } ),
	} );

	const contentStyle = {
		...( cardWidth
			? { '--ct-carousel-card-width': `${ cardWidth }${ cardWidthUnit }` }
			: {} ),
		...( gap ? { '--ct-carousel-gap': `${ gap }${ gapUnit }` } : {} ),
	};

	const innerBlocksProps = useInnerBlocksProps(
		{
			// ct-scrollbar mirrors render.php: consumes the theme's scrollbar mixin (W-02) once the
			// scrollbar is actually shown.
			className: classnames( 'theatrum-carousel-content', {
				'ct-scrollbar': showScrollbar,
			} ),
			style: Object.keys( contentStyle ).length
				? contentStyle
				: undefined,
		},
		{
			allowedBlocks: [ 'theatrum/carousel-item' ],
			template: TEMPLATE,
			templateLock: false,
			orientation: 'horizontal',
			renderAppender: InnerBlocks.ButtonBlockAppender,
			__experimentalAppenderTagName: 'li',
		}
	);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ __( 'Carousel Settings', 'theatrum-blocks' ) }
					initialOpen={ true }
				>
					<div style={ { display: 'flex', gap: '8px' } }>
						<TextControl
							label={ __( 'Card Width', 'theatrum-blocks' ) }
							value={ cardWidth }
							onChange={ ( value ) =>
								setAttributes( { cardWidth: value } )
							}
							type="number"
							min="0"
							help={ __(
								'Leave empty for cards to size to their content.',
								'theatrum-blocks'
							) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							style={ { flex: 1 } }
						/>
						<SelectControl
							label={ __( 'Unit', 'theatrum-blocks' ) }
							value={ cardWidthUnit }
							options={ UNIT_OPTIONS }
							onChange={ ( value ) =>
								setAttributes( { cardWidthUnit: value } )
							}
							__nextHasNoMarginBottom
							style={ { width: '80px' } }
						/>
					</div>
					<div style={ { display: 'flex', gap: '8px' } }>
						<TextControl
							label={ __( 'Grid Gap', 'theatrum-blocks' ) }
							value={ gap }
							onChange={ ( value ) =>
								setAttributes( { gap: value } )
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
							value={ gapUnit }
							options={ UNIT_OPTIONS }
							onChange={ ( value ) =>
								setAttributes( { gapUnit: value } )
							}
							__nextHasNoMarginBottom
							style={ { width: '80px' } }
						/>
					</div>
					<ToggleControl
						label={ __( 'Show scrollbar', 'theatrum-blocks' ) }
						checked={ showScrollbar }
						onChange={ ( value ) =>
							setAttributes( { showScrollbar: value } )
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<ArrowControls
				attributes={ attributes }
				setAttributes={ setAttributes }
				positions={ [ 'outside', 'inside', 'hidden' ] }
			/>

			<div { ...blockProps }>
				<div className="theatrum-carousel-wrapper">
					<button
						className="theatrum-carousel-arrow disabled theatrum-arrow-prev"
						aria-label={ __( 'Previous', 'theatrum-blocks' ) }
					/>
					<ul { ...innerBlocksProps } />
					<button
						className="theatrum-carousel-arrow theatrum-arrow-next"
						aria-label={ __( 'Next', 'theatrum-blocks' ) }
					/>
				</div>
			</div>
		</Fragment>
	);
}
