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
	SelectControl,
	__experimentalNumberControl as NumberControl,
	PanelBody,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { seen, unseen } from '@wordpress/icons';
import classnames from 'classnames';
import './editor.scss';

const POSITION_OPTIONS = [
	{ label: __( 'Center', 'theatrum-blocks' ), value: 'center' },
	{ label: __( 'Top', 'theatrum-blocks' ), value: 'top' },
	{ label: __( 'Right', 'theatrum-blocks' ), value: 'right' },
	{ label: __( 'Bottom', 'theatrum-blocks' ), value: 'bottom' },
	{ label: __( 'Left', 'theatrum-blocks' ), value: 'left' },
];

const SIZE_OPTIONS = [
	{ label: __( 'Small', 'theatrum-blocks' ), value: 'small' },
	{ label: __( 'Medium', 'theatrum-blocks' ), value: 'medium' },
	{ label: __( 'Large', 'theatrum-blocks' ), value: 'large' },
	{ label: __( 'Full', 'theatrum-blocks' ), value: 'full' },
];

export default function Edit( {
	attributes,
	setAttributes,
	isSelected,
	clientId,
} ) {
	const {
		dialogLabel,
		anchor,
		autoOpenDelay,
		position = 'center',
		size = 'medium',
	} = attributes;
	const blockProps = useBlockProps( {
		className: 'wp-block-theatrum-popup',
	} );

	const hasSelectedInner = useSelect(
		( select ) =>
			select( blockEditorStore ).hasSelectedInnerBlock( clientId, true ),
		[ clientId ]
	);
	const selected = isSelected || hasSelectedInner;

	// Manual override (toolbar eye icon, dialog close button, or backdrop click) lets an author force the preview open/closed regardless of selection (e.g. pin it open to screenshot, or close it without deselecting). `null` = "follow selection".
	// Reset to `null` on selection change so the override doesn't get stuck — closing while selected only hides until you reselect elsewhere and come back.
	const [ forcedState, setForcedState ] = useState( null );
	useEffect( () => {
		setForcedState( null );
	}, [ selected ] );

	// Shows real dialog styling while the block (or nested content, e.g. WPForms) is selected, matching the frontend; collapsed otherwise so it's not a wall of open dialogs. Closed, unselected instances stay reachable via List View/Outline.
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
					<SelectControl
						label={ __( 'Position', 'theatrum-blocks' ) }
						value={ position }
						options={ POSITION_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { position: value } )
						}
						help={ __(
							'Center opens as a modal dialog; the other options slide in as an offcanvas panel from that edge.',
							'theatrum-blocks'
						) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label={ __( 'Size', 'theatrum-blocks' ) }
						value={ size }
						options={ SIZE_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { size: value } )
						}
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
					className={ classnames(
						'popup-dialog',
						`is-position-${ position }`,
						`is-size-${ size }`
					) }
					role="dialog"
					aria-modal="true"
					aria-label={ displayLabel }
					data-state={ open ? 'open' : 'closed' }
					hidden={ ! open }
					style={ { pointerEvents: open ? 'auto' : 'none' } }
				>
					{ /* Button lives inside .popup-dialog-content so the editor DOM matches render.php's. */ }
					<div className="popup-dialog-content">
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
						<InnerBlocks />
					</div>
				</div>
			</div>
		</Fragment>
	);
}
