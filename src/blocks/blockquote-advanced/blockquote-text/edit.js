import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { quoteText, citeUrl } = attributes;

	const blockProps = useBlockProps( {
		className: 'theatrum-blockquote-text',
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
			<RichText
				identifier="quoteText"
				tagName="blockquote"
				multiline="p"
				{ ...blockProps }
				cite={ citeUrl || undefined }
				value={ quoteText }
				onChange={ ( value ) => setAttributes( { quoteText: value } ) }
				placeholder={ __(
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
					'theatrum-blocks'
				) }
			/>
		</>
	);
}
