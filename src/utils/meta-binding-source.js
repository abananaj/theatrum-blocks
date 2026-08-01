/**
 * Registers the theatrum/post-meta block bindings source client-side.
 *
 * inc/block-bindings.php registers this same source name on the PHP side
 * (get_value_callback) so front-end rendering works, but WordPress core's
 * editor UI (the native "Attributes" panel added to every bindable block)
 * looks the source up in the client-side block bindings registry — without
 * a matching JS registration it shows the source as "Source not registered"
 * (disabled, unusable) and, worse, silently substitutes the source's label
 * string in for the real attribute value once one resolves, which broke the
 * editor preview for bound blocks.
 *
 * getValues() only returns a value when it can find one via the edited
 * entity record's `meta` (i.e. the key was registered with
 * `register_post_meta( ..., [ 'show_in_rest' => true ] )` or exposed by ACF's
 * REST support). Keys that aren't REST-exposed simply resolve to nothing
 * here — the block falls back to its own attributes, same as before this
 * source existed — while still getting a live preview for the common case.
 * The real, authoritative value always comes from the PHP callback at
 * render time regardless of what resolves here.
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
