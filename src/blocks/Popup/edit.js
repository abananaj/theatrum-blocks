import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import { TextControl, Button, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { buttonText } = attributes;
	const blockProps = useBlockProps( { className: 'wp-block-chance-popup' } );
	const [ open, setOpen ] = useState( false );

	const togglePopup = () => {
		setOpen( ! open );
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Popup Settings', 'theatrum-blocks' ) }>
					<TextControl
						label={ __( 'Button Text', 'theatrum-blocks' ) }
						value={ buttonText || '' }
						onChange={ ( value ) =>
							setAttributes( { buttonText: value } )
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<Button
					variant="primary"
					onClick={ togglePopup }
					className="popup-toggle-button wp-element-button wp-block-button__link"
				>
					{ buttonText }
				</Button>

				<div
					className="popup-backdrop"
					onClick={ togglePopup }
					aria-hidden="true"
					data-state={ open ? 'open' : 'closed' }
					hidden={ ! open }
					style={ { pointerEvents: open ? 'auto' : 'none' } }
				/>
				<div
					className="popup-dialog"
					role="dialog"
					aria-modal="true"
					aria-label={ buttonText }
					data-state={ open ? 'open' : 'closed' }
					hidden={ ! open }
					style={ { pointerEvents: open ? 'auto' : 'none' } }
				>
					<div className="popup-dialog-header">
						<button
							className="popup-close-button"
							onClick={ togglePopup }
							aria-label={ __(
								'Close dialog',
								'theatrum-blocks'
							) }
							type="button"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								aria-hidden="true"
								focusable="false"
								fill="none"
							>
								<path
									d="M12 4L4 12M4 4l8 8"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</div>
					<div className="popup-dialog-content">
						<InnerBlocks />
					</div>
				</div>
			</div>
		</Fragment>
	);
}
