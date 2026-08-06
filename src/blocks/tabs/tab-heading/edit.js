/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import getColorStyle from './color-style';

const ALLOWED_BLOCKS = [ 'core/paragraph', 'core/heading' ];
const TEMPLATE = [ [ 'core/heading', { level: 3 } ] ];

export default function Edit( { attributes, setAttributes } ) {
	const {
		normalTextColor,
		normalBackgroundColor,
		hoverTextColor,
		hoverBackgroundColor,
		activeTextColor,
		activeBackgroundColor,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'ct-tab__header',
		style: getColorStyle( attributes ),
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		templateInsertUpdatesSelection: false,
		// Explicit (not just inherited from theatrum/tab) so this stays locked
		// to a single label even if the parent's lock ever changes.
		templateLock: 'all',
	} );

	return (
		<>
			{ /* group="filter" is a plain slot (same bare rendering as the
			old default group — no two-column grid wrapper the way
			group="color" applies) that happens to sit right before
			Typography in the Styles tab's slot order, which is what puts
			this panel above Typography. */ }
			<InspectorControls group="filter">
				<PanelColorSettings
					title={ __( 'Normal Colors', 'theatrum-blocks' ) }
					initialOpen={ false }
					colorSettings={ [
						{
							value: normalTextColor,
							onChange: ( value ) =>
								setAttributes( { normalTextColor: value } ),
							label: __( 'Text', 'theatrum-blocks' ),
						},
						{
							value: normalBackgroundColor,
							onChange: ( value ) =>
								setAttributes( {
									normalBackgroundColor: value,
								} ),
							label: __( 'Background', 'theatrum-blocks' ),
						},
					] }
				/>
				<PanelColorSettings
					title={ __( 'Hover Colors', 'theatrum-blocks' ) }
					initialOpen={ false }
					colorSettings={ [
						{
							value: hoverTextColor,
							onChange: ( value ) =>
								setAttributes( { hoverTextColor: value } ),
							label: __( 'Text', 'theatrum-blocks' ),
						},
						{
							value: hoverBackgroundColor,
							onChange: ( value ) =>
								setAttributes( {
									hoverBackgroundColor: value,
								} ),
							label: __( 'Background', 'theatrum-blocks' ),
						},
					] }
				/>
				<PanelColorSettings
					title={ __( 'Active Colors', 'theatrum-blocks' ) }
					initialOpen={ false }
					colorSettings={ [
						{
							value: activeTextColor,
							onChange: ( value ) =>
								setAttributes( { activeTextColor: value } ),
							label: __( 'Text', 'theatrum-blocks' ),
						},
						{
							value: activeBackgroundColor,
							onChange: ( value ) =>
								setAttributes( {
									activeBackgroundColor: value,
								} ),
							label: __( 'Background', 'theatrum-blocks' ),
						},
					] }
				/>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
