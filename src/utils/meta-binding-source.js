/**
 * Registers the theatrum/post-meta block bindings source client-side. inc/block-bindings.php registers the same source on the PHP side for rendering, but without a matching JS registration WP core's native "Attributes" panel shows "Source not registered" and silently substitutes the source's label for the real value — broken editor preview.
 *
 * getValues() only resolves a value when the key is REST-exposed (register_post_meta show_in_rest, or ACF's REST support) via the edited entity record's `meta`; unexposed keys just fall back to the block's own attributes, same as before this source existed. The PHP callback is always authoritative at render time regardless of what resolves here.
 */

import { registerBlockBindingsSource } from '@wordpress/blocks';
import { store as coreStore } from '@wordpress/core-data';

registerBlockBindingsSource( 'theatrum/post-meta', {
	label: 'Post Meta',
	usesContext: [ 'postId', 'postType' ],
	getValues( { select, context, bindings } ) {
		const { postId, postType } = context ?? {};
		const values = {};

		if ( ! postId || ! postType ) {
			return values;
		}

		const record = select( coreStore ).getEditedEntityRecord(
			'postType',
			postType,
			postId
		);
		const meta = record?.meta ?? {};

		for ( const [ attr, binding ] of Object.entries( bindings ) ) {
			const key = binding?.args?.key;
			const value = key ? meta[ key ] : undefined;
			if ( value !== undefined && value !== null && value !== '' ) {
				values[ attr ] = value;
			}
		}

		return values;
	},
	canUserEditValue: () => false,
} );
