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
	const { buttonText, popupTitle, isOpen } = attributes;
	const blockProps = useBlockProps( { className: 'wp-block-chance-popup' } );
	const [ open, setOpen ] = useState( isOpen );
	const title = popupTitle || buttonText;

	const togglePopup = () => {
		setOpen( ! open );
		setAttributes( { isOpen: ! open } );
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
					<TextControl
						label={ __( 'Dialog Title', 'theatrum-blocks' ) }
						help={ __(
							'Heading shown inside the dialog. Defaults to button text if empty.',
							'theatrum-blocks'
						) }
						value={ popupTitle || '' }
						onChange={ ( value ) =>
							setAttributes( { popupTitle: value } )
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
				/>
				<div
					className="popup-dialog"
					role="dialog"
					aria-modal="true"
					aria-label={ title }
					data-state={ open ? 'open' : 'closed' }
					hidden={ ! open }
				>
					<div className="popup-dialog-header">
						<h2 className="popup-dialog-title">{ title }</h2>
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
