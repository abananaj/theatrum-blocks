import { registerFormatType, toggleFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const FORMAT_NAME = 'theatrum/small';

const smallIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		aria-hidden="true"
		focusable="false"
	>
		<text x="2" y="17" fontSize="15" fontWeight="600" fill="currentColor">
			A
		</text>
		<text x="13" y="17" fontSize="9" fontWeight="600" fill="currentColor">
			a
		</text>
	</svg>
);

registerFormatType( FORMAT_NAME, {
	title: __( 'Small', 'theatrum-blocks' ),
	tagName: 'small',
	className: null,
	edit( { isActive, value, onChange } ) {
		return (
			<RichTextToolbarButton
				icon={ smallIcon }
				title={ __( 'Small', 'theatrum-blocks' ) }
				onClick={ () =>
					onChange( toggleFormat( value, { type: FORMAT_NAME } ) )
				}
				isActive={ isActive }
			/>
		);
	},
} );
