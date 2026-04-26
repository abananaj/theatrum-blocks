import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import { TextControl, Button, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { buttonText, isOpen } = attributes;
	const blockProps = useBlockProps({ className: 'wp-block-chance-popup' });
	const [open, setOpen] = useState(isOpen);

	const togglePopup = () => {
		setOpen(!open);
		setAttributes({ isOpen: !open });
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Popup Settings', 'chance-ollie')}>
					<TextControl
						label={__('Button Text', 'chance-ollie')}
						value={buttonText || ''}
						onChange={(value) => setAttributes({ buttonText: value })}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<Button
					variant="primary"
					onClick={togglePopup}
					className="popup-toggle-button"
				>
					{buttonText}
				</Button>
				{open && (
					<div
						className="popup-backdrop"
						onClick={togglePopup}
						data-popup-backdrop="true"
					/>
				)}
				<div
					className={open ? 'popup-content-visible' : 'popup-content-hidden'}
					style={{ display: open ? 'block' : 'none', marginTop: '12px' }}
				>
					<div className="wp-block-group popup-inner-content">
						<InnerBlocks />
					</div>
				</div>
			</div>
		</Fragment>
	);
}
