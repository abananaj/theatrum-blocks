import {
	useBlockProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import './editor.scss';

/**
 * Strip HTML tags from a RichText value, the same way view.js relies on
 * `heading.textContent` to get plain text from rendered markup.
 *
 * @param {string} html RichText HTML content.
 * @return {string} Plain text.
 */
function stripHTML( html ) {
	const div = document.createElement( 'div' );
	div.innerHTML = html;
	return div.textContent || '';
}

/**
 * Mirror of view.js's `collectSections()`, but reading Group blocks with
 * HTML element "section" + an anchor from the block-editor store instead of
 * scanning rendered DOM. Keeps editor preview and front end in sync.
 *
 * @param {Function} select `wp.data.select`.
 * @return {Array<{id: string, text: string}>} Ordered nav items.
 */
function collectSectionItems( select ) {
	const {
		getBlockName,
		getBlockAttributes,
		getBlocksByName,
		getClientIdsOfDescendants,
		getClientIdsWithDescendants,
	} = select( blockEditorStore );

	const [ postContentClientId ] = getBlocksByName( 'core/post-content' );
	const scopedClientIds = postContentClientId
		? getClientIdsOfDescendants( [ postContentClientId ] )
		: getClientIdsWithDescendants();

	const items = [];
	const seen = new Set();

	scopedClientIds.forEach( ( clientId ) => {
		if ( getBlockName( clientId ) !== 'core/group' ) {
			return;
		}

		const { tagName, anchor } = getBlockAttributes( clientId );
		if ( tagName !== 'section' || ! anchor || seen.has( anchor ) ) {
			return;
		}

		const headingClientId = getClientIdsOfDescendants( [ clientId ] ).find(
			( id ) => getBlockName( id ) === 'core/heading'
		);
		if ( ! headingClientId ) {
			return;
		}

		const text = stripHTML(
			getBlockAttributes( headingClientId ).content || ''
		).trim();
		if ( ! text ) {
			return;
		}

		seen.add( anchor );
		items.push( { id: anchor, text } );
	} );

	return items;
}

export default function Edit( { attributes, setAttributes } ) {
	const { navLabel, contentSelector } = attributes;

	const items = useSelect( ( select ) => collectSectionItems( select ), [] );

	const blockProps = useBlockProps( {
		className: 'theatrum-page-nav theatrum-page-nav--editor',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Page Nav Settings', 'theatrum-blocks' ) }
				>
					<TextControl
						label={ __( 'Navigation label', 'theatrum-blocks' ) }
						help={ __(
							'Accessible label for the navigation landmark.',
							'theatrum-blocks'
						) }
						value={ navLabel }
						onChange={ ( value ) =>
							setAttributes( { navLabel: value } )
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label={ __( 'Content selector', 'theatrum-blocks' ) }
						help={ __(
							'CSS selector for the region scanned for <section id> elements on the front end. Defaults to "main". The editor preview always scans the whole post content.',
							'theatrum-blocks'
						) }
						value={ contentSelector }
						onChange={ ( value ) =>
							setAttributes( { contentSelector: value } )
						}
						placeholder="main"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>
			<nav { ...blockProps } aria-label={ navLabel }>
				{ items.length ? (
					<div className="wp-block-buttons theatrum-page-nav__list">
						{ items.map( ( item ) => (
							<div
								key={ item.id }
								className="wp-block-button theatrum-page-nav__item"
							>
								<a
									className="wp-block-button__link wp-element-button"
									href={ `#${ item.id }` }
									onClick={ ( event ) =>
										event.preventDefault()
									}
								>
									{ item.text }
								</a>
							</div>
						) ) }
					</div>
				) : (
					<span className="theatrum-page-nav__placeholder">
						{ __(
							'Page Nav — links to on-page sections appear here on the front end. Add a Group with HTML element “<section>” and an HTML Anchor to generate a link.',
							'theatrum-blocks'
						) }
					</span>
				) }
			</nav>
		</>
	);
}
