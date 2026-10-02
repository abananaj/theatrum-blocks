/**
 * "Link to current post" for core/button: binds `url` to the theatrum/post-link source (PHP side in inc/block-bindings.php), with an optional #anchor arg. Resolves per-post inside Query Loops via postId context.
 */

import { registerBlockBindingsSource } from '@wordpress/blocks';
import { store as coreStore } from '@wordpress/core-data';
import { addFilter } from '@wordpress/hooks';
import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	Button,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';

const SOURCE = 'theatrum/post-link';

// Mirrors theatrum_sanitize_anchor() in PHP: drop leading #, keep id-safe chars only.
export const sanitizeAnchor = ( value = '' ) =>
	String( value )
		.replace( /^#+/, '' )
		.replace( /[^A-Za-z0-9_\-:.]/g, '' );

registerBlockBindingsSource( {
	name: SOURCE,
	label: 'Current Post Link',
	usesContext: [ 'postId', 'postType' ],
	getValues( { select, context, bindings } ) {
		const { postId, postType } = context ?? {};
		const values = {};
		const link =
			postId && postType
				? select( coreStore ).getEntityRecord(
						'postType',
						postType,
						postId
				  )?.link
				: '';

		for ( const [ attr, binding ] of Object.entries( bindings ) ) {
			const anchor = sanitizeAnchor( binding?.args?.anchor );
			const url = ( link || '' ) + ( anchor ? `#${ anchor }` : '' );
			if ( url ) {
				values[ attr ] = url;
			}
		}

		return values;
	},
	canUserEditValue: () => false,
} );

const withPostLinkPanel = createHigherOrderComponent( ( BlockEdit ) => {
	return function WithPostLinkPanel( props ) {
		const { name, attributes, setAttributes, isSelected } = props;
		const isButton = name === 'core/button';
		const urlBinding = attributes?.metadata?.bindings?.url;
		const isLinked = urlBinding?.source === SOURCE;

		// Anchors set on blocks in the document being edited, offered as quick picks.
		const anchors = useSelect(
			( select ) => {
				if ( ! isButton || ! isSelected || ! isLinked ) {
					return [];
				}
				const { getClientIdsWithDescendants, getBlockAttributes } =
					select( blockEditorStore );
				const found = getClientIdsWithDescendants()
					.map( ( id ) => getBlockAttributes( id )?.anchor )
					.filter( Boolean );
				return [ ...new Set( found ) ];
			},
			[ isButton, isSelected, isLinked ]
		);

		// Hide when url is bound to another source (e.g. Button (Meta Bound)) to avoid clobbering it.
		if ( ! isButton || ! isSelected || ( urlBinding && ! isLinked ) ) {
			return <BlockEdit { ...props } />;
		}

		const anchor = urlBinding?.args?.anchor ?? '';

		const setBinding = ( binding ) => {
			const { url, ...otherBindings } =
				attributes.metadata?.bindings ?? {};
			const bindings = binding
				? { ...otherBindings, url: binding }
				: otherBindings;
			const { bindings: _old, ...metadata } = attributes.metadata ?? {};
			setAttributes( {
				metadata: Object.keys( bindings ).length
					? { ...metadata, bindings }
					: metadata,
			} );
		};

		const setAnchor = ( val ) =>
			setBinding( {
				source: SOURCE,
				args: { anchor: sanitizeAnchor( val ) },
			} );

		return (
			<Fragment>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody title="Link to Post" initialOpen={ isLinked }>
						<ToggleControl
							label="Link to current post"
							help="Uses the permalink of the current post (or each post inside a Query Loop)."
							checked={ isLinked }
							onChange={ ( on ) =>
								setBinding(
									on
										? {
												source: SOURCE,
												args: { anchor: '' },
										  }
										: null
								)
							}
							__nextHasNoMarginBottom
						/>
						{ isLinked && (
							<TextControl
								label="Anchor"
								value={ anchor }
								onChange={ setAnchor }
								placeholder="e.g., tickets"
								help="Optional. Matches a block's HTML anchor (Advanced panel), without the #."
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						) }
						{ isLinked && anchors.length > 0 && (
							<div
								style={ {
									display: 'flex',
									flexWrap: 'wrap',
									gap: 4,
									marginTop: 8,
								} }
							>
								{ anchors.map( ( a ) => (
									<Button
										key={ a }
										size="small"
										variant={
											a === anchor
												? 'primary'
												: 'secondary'
										}
										onClick={ () => setAnchor( a ) }
									>
										#{ a }
									</Button>
								) ) }
							</div>
						) }
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withPostLinkPanel' );

addFilter( 'editor.BlockEdit', 'theatrum/post-link-panel', withPostLinkPanel );
