/**
 * WordPress dependencies
 */
import {
	BlockControls,
	BlockIcon,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Placeholder,
	ToggleControl,
	SelectControl,
	ToolbarButton,
	ToolbarGroup,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { renderToString } from '@wordpress/element';
import { __, isRTL } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { store as noticeStore } from '@wordpress/notices';
import {
	tableOfContents as icon,
	formatListBullets,
	formatListBulletsRTL,
	formatListNumbered,
	formatListNumberedRTL,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import TableOfContentsList from './list';
import { linearToNestedHeadingList } from './utils';
import { useObserveHeadings } from './hooks';
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

/** @typedef {import('./utils').HeadingData} HeadingData */

/**
 * Table of Contents block edit component.
 *
 * @param {Object}                       props                                   The props.
 * @param {Object}                       props.attributes                        The block attributes.
 * @param {HeadingData[]}                props.attributes.headings               The list of data for each heading in the post.
 * @param {boolean}                      props.attributes.onlyIncludeCurrentPage Whether to only include headings from the current page (if the post is paginated).
 * @param {number|undefined}             props.attributes.maxLevel               The maximum heading level to include, or null to include all levels.
 * @param {boolean}                      props.attributes.ordered                Whether to display as an ordered list (true) or unordered list (false).
 * @param {string}                       props.clientId                          The client id.
 * @param {(attributes: Object) => void} props.setAttributes                     The set attributes function.
 *
 * @return {Component} The component.
 */
export default function TableOfContentsEdit( {
	attributes: {
		headings = [],
		onlyIncludeCurrentPage,
		maxLevel,
		ordered = true,
	},
	clientId,
	setAttributes,
} ) {
	useObserveHeadings( clientId );

	const blockProps = useBlockProps();
	const instanceId = useInstanceId(
		TableOfContentsEdit,
		'table-of-contents'
	);

	// If a user clicks to a link prevent redirection and show a warning.
	const { createWarningNotice } = useDispatch( noticeStore );
	const showRedirectionPreventedNotice = ( event ) => {
		event.preventDefault();
		createWarningNotice(
			__( 'Links are disabled in the editor.', 'theatrum-blocks' ),
			{
				id: `block-library/core/table-of-contents/redirection-prevented/${ instanceId }`,
				type: 'snackbar',
			}
		);
	};

	const canInsertList = useSelect(
		( select ) => {
			const { getBlockRootClientId, canInsertBlockType } =
				select( blockEditorStore );
			const rootClientId = getBlockRootClientId( clientId );

			return canInsertBlockType( 'core/list', rootClientId );
		},
		[ clientId ]
	);

	const { replaceBlocks } = useDispatch( blockEditorStore );
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const headingTree = linearToNestedHeadingList( headings );

	const toolbarControls = (
		<BlockControls>
			<ToolbarGroup>
				<ToolbarButton
					icon={ isRTL() ? formatListBulletsRTL : formatListBullets }
					title={ __( 'Unordered', 'theatrum-blocks' ) }
					description={ __(
						'Convert to unordered list',
						'theatrum-blocks'
					) }
					onClick={ () => setAttributes( { ordered: false } ) }
					isActive={ ordered === false }
				/>
				<ToolbarButton
					icon={
						isRTL() ? formatListNumberedRTL : formatListNumbered
					}
					title={ __( 'Ordered', 'theatrum-blocks' ) }
					description={ __(
						'Convert to ordered list',
						'theatrum-blocks'
					) }
					onClick={ () => setAttributes( { ordered: true } ) }
					isActive={ ordered === true }
				/>
			</ToolbarGroup>
			{ canInsertList && (
				<ToolbarGroup>
					<ToolbarButton
						onClick={ () =>
							replaceBlocks(
								clientId,
								createBlock( 'core/list', {
									ordered,
									values: renderToString(
										<TableOfContentsList
											nestedHeadingList={ headingTree }
											ordered={ ordered }
										/>
									),
								} )
							)
						}
					>
						{ __( 'Convert to static list', 'theatrum-blocks' ) }
					</ToolbarButton>
				</ToolbarGroup>
			) }
		</BlockControls>
	);

	const inspectorControls = (
		<InspectorControls>
			<ToolsPanel
				label={ __( 'Settings', 'theatrum-blocks' ) }
				resetAll={ () => {
					setAttributes( {
						onlyIncludeCurrentPage: false,
						maxLevel: undefined,
						ordered: true,
					} );
				} }
				dropdownMenuProps={ dropdownMenuProps }
			>
				<ToolsPanelItem
					hasValue={ () => !! onlyIncludeCurrentPage }
					label={ __(
						'Only include current page',
						'theatrum-blocks'
					) }
					onDeselect={ () =>
						setAttributes( { onlyIncludeCurrentPage: false } )
					}
					isShownByDefault
				>
					<ToggleControl
						label={ __(
							'Only include current page',
							'theatrum-blocks'
						) }
						checked={ onlyIncludeCurrentPage }
						onChange={ ( value ) =>
							setAttributes( { onlyIncludeCurrentPage: value } )
						}
						help={
							onlyIncludeCurrentPage
								? __(
										'Only including headings from the current page (if the post is paginated).',
										'theatrum-blocks'
								  )
								: __(
										'Include headings from all pages (if the post is paginated).',
										'theatrum-blocks'
								  )
						}
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={ () => !! maxLevel }
					label={ __( 'Limit heading levels', 'theatrum-blocks' ) }
					onDeselect={ () =>
						setAttributes( { maxLevel: undefined } )
					}
					isShownByDefault
				>
					<SelectControl
						__next40pxDefaultSize
						label={ __(
							'Include headings down to level',
							'theatrum-blocks'
						) }
						value={ maxLevel || '' }
						options={ [
							{
								value: '',
								label: __( 'All levels', 'theatrum-blocks' ),
							},
							{
								value: '1',
								label: __( 'Heading 1', 'theatrum-blocks' ),
							},
							{
								value: '2',
								label: __( 'Heading 2', 'theatrum-blocks' ),
							},
							{
								value: '3',
								label: __( 'Heading 3', 'theatrum-blocks' ),
							},
							{
								value: '4',
								label: __( 'Heading 4', 'theatrum-blocks' ),
							},
							{
								value: '5',
								label: __( 'Heading 5', 'theatrum-blocks' ),
							},
							{
								value: '6',
								label: __( 'Heading 6', 'theatrum-blocks' ),
							},
						] }
						onChange={ ( value ) =>
							setAttributes( {
								maxLevel: value ? parseInt( value ) : undefined,
							} )
						}
						help={
							! maxLevel
								? __(
										'Including all heading levels in the table of contents.',
										'theatrum-blocks'
								  )
								: __(
										'Only include headings up to and including this level.',
										'theatrum-blocks'
								  )
						}
					/>
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);

	// If there are no headings (or the only one is empty): toolbar controls are intentionally
	// omitted since "Convert to static list" is useless in the placeholder state.
	if ( headings.length === 0 ) {
		return (
			<>
				<div { ...blockProps }>
					<Placeholder
						icon={ <BlockIcon icon={ icon } /> }
						label={ __( 'Table of Contents', 'theatrum-blocks' ) }
						instructions={ __(
							'Start adding Heading blocks to create a table of contents. Headings with HTML anchors will be linked here.',
							'theatrum-blocks'
						) }
					/>
				</div>
				{ inspectorControls }
			</>
		);
	}

	const ListTag = ordered ? 'ol' : 'ul';

	return (
		<>
			<nav { ...blockProps }>
				<ListTag>
					<TableOfContentsList
						nestedHeadingList={ headingTree }
						disableLinkActivation
						onClick={ showRedirectionPreventedNotice }
						ordered={ ordered }
					/>
				</ListTag>
			</nav>
			{ toolbarControls }
			{ inspectorControls }
		</>
	);
}
