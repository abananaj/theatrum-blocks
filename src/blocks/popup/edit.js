import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import {
	TextControl,
	NumberControl,
	ToggleControl,
	PanelBody,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { seen, unseen } from '@wordpress/icons';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { dialogLabel, anchor, autoOpenDelay, autoOpenHomeOnly } = attributes;
	const blockProps = useBlockProps( { className: 'wp-block-theatrum-popup' } );
	const [ open, setOpen ] = useState( false );

	const togglePopup = () => setOpen( ! open );
	const displayLabel =
		dialogLabel || anchor || __( 'Popup', 'theatrum-blocks' );

	return (
		<Fragment>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ open ? unseen : seen }
						label={
							open
								? __( 'Preview closed', 'theatrum-blocks' )
								: __( 'Preview open', 'theatrum-blocks' )
						}
						onClick={ togglePopup }
						isPressed={ open }
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Popup Settings', 'theatrum-blocks' ) }>
					<TextControl
						label={ __( 'Dialog Label', 'theatrum-blocks' ) }
						value={ dialogLabel || '' }
						onChange={ ( value ) =>
							setAttributes( { dialogLabel: value } )
						}
						help={ __(
							'Read by screen readers when the dialog opens. Falls back to the HTML Anchor (set in Advanced) if left blank.',
							'theatrum-blocks'
						) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Automatic Opening', 'theatrum-blocks' ) }
					initialOpen={ false }
				>
					<NumberControl
						label={ __(
							'Auto-open after (seconds)',
							'theatrum-blocks'
						) }
						value={ autoOpenDelay || 0 }
						min={ 0 }
						step={ 1 }
						onChange={ ( value ) =>
							setAttributes( {
								autoOpenDelay: Number( value ) || 0,
							} )
						}
						help={ __(
							'0 disables auto-open. Otherwise the popup opens itself after this delay, once per browser session.',
							'theatrum-blocks'
						) }
						__next40pxDefaultSize
					/>
					<ToggleControl
						label={ __(
							'Only auto-open on the front page',
							'theatrum-blocks'
						) }
						checked={ !! autoOpenHomeOnly }
						onChange={ ( value ) =>
							setAttributes( { autoOpenHomeOnly: value } )
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ ! open && (
					<div className="popup-editor-placeholder">
						{ __( 'Popup:', 'theatrum-blocks' ) } { displayLabel }
					</div>
				) }

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
					aria-label={ displayLabel }
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
