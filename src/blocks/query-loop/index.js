import { registerBlockVariation } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';

const VARIATIONS = [
	{
		name: 'theatrum/production-loop',
		title: 'Production Loop',
		icon: 'awards',
		postType: 'production',
	},
	{
		name: 'theatrum/event-loop',
		title: 'Event Loop',
		icon: 'calendar-alt',
		postType: 'event',
	},
	{
		name: 'theatrum/class-loop',
		title: 'Class Loop',
		icon: 'welcome-learn-more',
		postType: 'class',
	},
	{
		name: 'theatrum/blog-loop',
		title: 'Blog Loop',
		icon: 'admin-post',
		postType: 'post',
	},
	{
		name: 'theatrum/artist-loop',
		title: 'Artist Loop',
		icon: 'art',
		postType: 'artist',
	},
	{
		name: 'theatrum/supporter-loop',
		title: 'Supporter Loop',
		icon: 'heart',
		postType: 'supporter',
	},
	{
		name: 'theatrum/credit-loop',
		title: 'Credit Loop',
		icon: 'list-view',
		postType: 'credit',
	},
	{
		name: 'theatrum/venue-loop',
		title: 'Venue Loop',
		icon: 'building',
		postType: 'venue',
	},
];

const THEATRUM_NAMESPACES = VARIATIONS.map( ( v ) => v.name );

VARIATIONS.forEach( ( { name, title, icon, postType } ) => {
	registerBlockVariation( 'core/query', {
		name,
		title,
		icon,
		attributes: {
			namespace: name,
			enhancedPagination: true,
			query: {
				postType,
				perPage: 10,
				pages: 0,
				offset: 0,
				order: 'desc',
				orderBy: 'date',
				author: '',
				search: '',
				exclude: [],
				sticky: '',
				inherit: false,
			},
		},
		// isActive array syntax (WP 6.6+): matches active variation by namespace attribute.
		isActive: [ 'namespace' ],
		scope: [ 'inserter', 'transform' ],
	} );
} );

// Inject a <style> tag via InspectorControls to hide the Post Type SelectControl
// when a Theatrum query loop variation is selected. The Query Type (inherit) toggle
// is already hidden automatically by core/query when namespace is set.
addFilter(
	'editor.BlockEdit',
	'theatrum/hide-query-post-type-control',
	createHigherOrderComponent(
		( BlockEdit ) =>
			function TheatrumQueryEdit( props ) {
				if (
					props.name !== 'core/query' ||
					! THEATRUM_NAMESPACES.includes(
						props.attributes?.namespace
					)
				) {
					return <BlockEdit { ...props } />;
				}

				return (
					<>
						<InspectorControls>
							{ /* Hide the Post Type dropdown — postType is locked by this variation. */ }
							<style>{ `
								.block-editor-block-inspector .components-select-control:has(option[value="${
									props.attributes.query?.postType ?? ''
								}"]:checked) {
									display: none;
								}
							` }</style>
						</InspectorControls>
						<BlockEdit { ...props } />
					</>
				);
			},
		'TheatrumQueryEdit'
	)
);
