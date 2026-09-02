/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = [ 'theatrum/tab' ];
const TEMPLATE = [ [ 'theatrum/tab' ], [ 'theatrum/tab' ] ];

export default function Edit( { attributes, setAttributes } ) {
	const { equalWidthTabs } = attributes;

	const blockProps = useBlockProps( {
		className: clsx( 'ct-tabs is-editor', {
			'is-equal-width': equalWidthTabs,
		} ),
	} );
	// useInnerBlocksProps (not <InnerBlocks>) keeps tab blocks as direct children instead of an
	// extra wrapper div — _mixins.scss's tab-strip CSS relies on .ct-tab being a direct child of .is-editor.
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'theatrum-blocks' ) }>
					<ToggleControl
						label={ __( 'Equal width tabs', 'theatrum-blocks' ) }
						checked={ !! equalWidthTabs }
						onChange={ ( value ) =>
							setAttributes( { equalWidthTabs: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
