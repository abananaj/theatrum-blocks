/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * Editor view for the Breadcrumbs block.
 *
 * The real trail is built server-side (render.php); here we show a
 * representative preview so the "arrow trail" styling is visible while editing,
 * and expose the same toggles the front end honors.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @return {Element} The editor element.
 */
export default function BreadcrumbsEdit( { attributes, setAttributes } ) {
	const { showHomeItem, showCurrentItem, prefersTaxonomy, showOnHomePage } =
		attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'theatrum-blocks' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __(
							'Show home breadcrumb',
							'theatrum-blocks'
						) }
						checked={ showHomeItem }
						onChange={ ( value ) =>
							setAttributes( { showHomeItem: value } )
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __(
							'Show current breadcrumb',
							'theatrum-blocks'
						) }
						checked={ showCurrentItem }
						onChange={ ( value ) =>
							setAttributes( { showCurrentItem: value } )
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __(
							'Prefer taxonomy terms',
							'theatrum-blocks'
						) }
						help={ __(
							'For a hierarchical post type with taxonomies, follow the taxonomy term hierarchy instead of the post hierarchy.',
							'theatrum-blocks'
						) }
						checked={ prefersTaxonomy }
						onChange={ ( value ) =>
							setAttributes( { prefersTaxonomy: value } )
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Show on homepage', 'theatrum-blocks' ) }
						help={ __(
							'Display the breadcrumb trail even when this block appears on the homepage.',
							'theatrum-blocks'
						) }
						checked={ showOnHomePage }
						onChange={ ( value ) =>
							setAttributes( { showOnHomePage: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<nav
				{ ...blockProps }
				aria-label={ __( 'Breadcrumbs', 'theatrum-blocks' ) }
			>
				<ol>
					{ showHomeItem && (
						<li>
							<a href="#breadcrumbs-preview-home" onClick={ ( event ) => event.preventDefault() }>
								{ __( 'Home', 'theatrum-blocks' ) }
							</a>
						</li>
					) }
					<li>
						<a href="#breadcrumbs-preview-ancestor" onClick={ ( event ) => event.preventDefault() }>
							{ __( 'Ancestor', 'theatrum-blocks' ) }
						</a>
					</li>
					<li>
						<a href="#breadcrumbs-preview-parent" onClick={ ( event ) => event.preventDefault() }>
							{ __( 'Parent', 'theatrum-blocks' ) }
						</a>
					</li>
					{ showCurrentItem && (
						<li>
							<span aria-current="page">
								{ __( 'Current', 'theatrum-blocks' ) }
							</span>
						</li>
					) }
				</ol>
			</nav>
		</>
	);
}
