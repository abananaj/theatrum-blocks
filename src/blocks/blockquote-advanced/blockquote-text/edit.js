import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = [ 'core/paragraph' ];

const TEMPLATE = [
	[
		'core/paragraph',
		{
			placeholder: __(
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				'theatrum-blocks'
			),
		},
	],
];

export default function Edit( { attributes, setAttributes } ) {
	const { citeUrl } = attributes;

	const blockProps = useBlockProps( {
		className: 'theatrum-blockquote-text',
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		templateLock: false,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Citation URL', 'theatrum-blocks' ) }>
					<TextControl
						label={ __( 'Source URL', 'theatrum-blocks' ) }
						help={ __(
							'Optional. Sets the blockquote’s cite attribute — not displayed, used by browsers/assistive tech to reference the source.',
							'theatrum-blocks'
						) }
						type="url"
						value={ citeUrl }
						onChange={ ( value ) =>
							setAttributes( { citeUrl: value } )
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>
			<blockquote { ...innerBlocksProps } cite={ citeUrl || undefined } />
		</>
	);
}
