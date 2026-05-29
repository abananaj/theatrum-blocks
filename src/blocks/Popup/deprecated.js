import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * v1: Static save before block was converted to server-side rendering.
 * Popup content was rendered inline with a hidden div toggled by JS.
 */
const v1 = {
	save( { attributes } ) {
		const { buttonText } = attributes;
		return (
			<div { ...useBlockProps.save() }>
				<button
					className="popup-toggle-button"
					data-popup-toggle="true"
					aria-expanded="false"
				>
					{ buttonText }
				</button>
				<div
					className="popup-content-hidden"
					data-popup-content="true"
					style={ { display: 'none', marginTop: '12px' } }
				>
					<div className="wp-block-group popup-inner-content">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
};

export default [ v1 ];
