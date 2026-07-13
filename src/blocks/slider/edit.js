/**
 * Slider Block - Editor
 *
 * Renders the same wrapper/arrows markup as save.js so the editor is a real
 * WYSIWYG preview; the slides themselves are `chance/slider-item` child
 * blocks edited directly in the canvas, like a Group.
 *
 * The dots aren't in save.js (no sibling-count access in a plain save()),
 * but the editor DOES have data-store access, so they're rendered for real
 * here — one per slide, reusing the same "active = selected descendant, else
 * first" rule as chance/slider-item's own edit.js.
 */

import clsx from 'clsx';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	InnerBlocks,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [ [ 'chance/slider-item' ], [ 'chance/slider-item' ] ];

function useActiveDotIndex( clientId ) {
	return useSelect(
		( select ) => {
			const {
				getSelectedBlockClientId,
				hasSelectedInnerBlock,
				getBlockOrder,
			} = select( blockEditorStore );

			const order = getBlockOrder( clientId );
			const selectedClientId = getSelectedBlockClientId();

			const activeIndex = order.findIndex(
				( childId ) =>
					childId === selectedClientId ||
					hasSelectedInnerBlock( childId, true )
			);

			return {
				activeIndex: activeIndex === -1 ? 0 : activeIndex,
				total: order.length,
			};
		},
		[ clientId ]
	);
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { autoplay, autoplaySpeed } = attributes;
	const { activeIndex, total } = useActiveDotIndex( clientId );

	const blockProps = useBlockProps( {
		// `is-ready` here (normally added by view.js after hydration) stops
		// the no-JS fallback CSS from forcing the first slide to show — the
		// editor already knows the true active slide via useSelect.
		className: clsx( 'ct-slider', 'is-ready' ),
		'data-autoplay': autoplay ? 'true' : 'false',
		'data-autoplay-speed': autoplaySpeed,
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'ct-slider-track' },
		{
			allowedBlocks: [ 'chance/slider-item' ],
			template: TEMPLATE,
			templateLock: false,
			renderAppender: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ __( 'Slider Settings', 'theatrum-blocks' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Autoplay', 'theatrum-blocks' ) }
						checked={ !! autoplay }
						onChange={ ( value ) =>
							setAttributes( { autoplay: value } )
						}
						help={ __(
							'Automatically advance to the next slide',
							'theatrum-blocks'
						) }
					/>
					{ autoplay && (
						<RangeControl
							label={ __(
								'Autoplay speed (ms)',
								'theatrum-blocks'
							) }
							value={ autoplaySpeed }
							onChange={ ( value ) =>
								setAttributes( { autoplaySpeed: value } )
							}
							min={ 1000 }
							max={ 10000 }
							step={ 500 }
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="ct-slider-wrapper">
					<ul { ...innerBlocksProps } />
					<button
						className="ct-slider-arrow ct-slider-prev"
						aria-label={ __( 'Previous', 'theatrum-blocks' ) }
					>
						❮
					</button>
					<button
						className="ct-slider-arrow ct-slider-next"
						aria-label={ __( 'Next', 'theatrum-blocks' ) }
					>
						❯
					</button>
				</div>
				<div className="ct-slider-dots">
					{ Array.from( { length: total } ).map( ( _, index ) => (
						<span
							key={ index }
							className={ clsx( 'ct-slider-dot', {
								'is-active': index === activeIndex,
							} ) }
						/>
					) ) }
				</div>
			</div>
		</Fragment>
	);
}
