/**
 * Carousel Block - Editor
 *
 * Renders the same wrapper/controls markup as render.php so the editor is a
 * real WYSIWYG preview; the cards themselves are `theatrum/carousel-item`
 * child blocks edited directly in the canvas, like a Group.
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

const ARROW_POSITION_OPTIONS = [
	{ label: __( 'Outside', 'theatrum-blocks' ), value: 'outside' },
	{ label: __( 'Inside', 'theatrum-blocks' ), value: 'inside' },
	{ label: __( 'Hidden', 'theatrum-blocks' ), value: 'hidden' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { cardWidth, cardWidthUnit, arrowPosition, showScrollbar } =
		attributes;
	const blockProps = useBlockProps( {
		className: classnames( {
			'theatrum-arrows-inside': arrowPosition === 'inside',
			'theatrum-arrows-hidden': arrowPosition === 'hidden',
			'theatrum-scrollbar-visible': showScrollbar,
		} ),
	} );

	const contentStyle = cardWidth
		? { '--ct-carousel-card-width': `${ cardWidth }${ cardWidthUnit }` }
		: undefined;

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'theatrum-carousel-content', style: contentStyle },
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
					<SelectControl
						label={ __( 'Arrow Position', 'theatrum-blocks' ) }
						value={ arrowPosition }
						options={ ARROW_POSITION_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { arrowPosition: value } )
						}
						__nextHasNoMarginBottom
					/>
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
