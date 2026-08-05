import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	InnerBlocks,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	TextControl,
	__experimentalNumberControl as NumberControl,
	PanelBody,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { seen, unseen } from '@wordpress/icons';
import './editor.scss';

export default function Edit( {
	attributes,
	setAttributes,
	isSelected,
	clientId,
} ) {
	const { dialogLabel, anchor, autoOpenDelay } = attributes;
	const blockProps = useBlockProps( {
		className: 'wp-block-theatrum-popup',
	} );

	const hasSelectedInner = useSelect(
		( select ) =>
			select( blockEditorStore ).hasSelectedInnerBlock( clientId, true ),
		[ clientId ]
	);
	const selected = isSelected || hasSelectedInner;

	// Manual override, set by the toolbar eye icon, the dialog's own close
	// button, or clicking the backdrop — lets an author force the preview
	// open or closed regardless of selection (e.g. pin it open to screenshot
	// it, or close it while still selected without deselecting the block).
	// `null` means "no override, follow selection". Reset back to `null`
	// whenever selection actually changes so the override doesn't get stuck:
	// closing it while selected only hides it until you select elsewhere and
	// come back, at which point it goes back to auto-following selection.
	const [ forcedState, setForcedState ] = useState( null );
	useEffect( () => {
		setForcedState( null );
	}, [ selected ] );

	// Real dialog styling shown while the block (or something nested inside
	// it, e.g. the WPForms embed) is selected, so the editor preview matches
	// the frontend — but collapsed otherwise so it isn't a wall of open
	// dialogs cluttering the canvas. Instances that are closed and not
	// selected stay reachable via the List View/Outline sidebar.
	const open = forcedState !== null ? forcedState : selected;

	const togglePopup = () => setForcedState( open ? false : true );
	const displayLabel =
		dialogLabel || anchor || __( 'Popup', 'theatrum-blocks' );

	return (
		<Fragment>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ open ? seen : unseen }
						label={
							open
								? __( 'Preview open', 'theatrum-blocks' )
								: __( 'Preview closed', 'theatrum-blocks' )
						}
						onClick={ togglePopup }
						isPressed={ ! open }
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
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
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
