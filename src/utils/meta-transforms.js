import { addFilter } from '@wordpress/hooks';
import { createBlock } from '@wordpress/blocks';

// Maps each core block to the old theatrum/* block(s) it can receive as transforms.
const TRANSFORMS = {
	'core/image': [
		{
			fromBlock: 'theatrum/meta-image',
			transform: ( attrs ) => ( {
				metadata: {
					name: 'theatrum/bind-image',
					bindings: {
						id: {
							source: 'theatrum/post-meta',
							args: { key: attrs.keyInput || '' },
						},
					},
				},
			} ),
		},
	],
	'core/button': [
		{
			fromBlock: 'theatrum/meta-button',
			transform: ( attrs ) => ( {
				text: attrs.buttonText || 'Learn More',
				metadata: {
					name: 'theatrum/bind-button',
					bindings: {
						url: {
							source: 'theatrum/post-meta',
							args: { key: attrs.keyInput || '' },
						},
					},
				},
			} ),
		},
	],
	'core/paragraph': [
		{
			fromBlock: 'theatrum/meta-field',
			transform: ( attrs ) => ( {
				metadata: {
					name: 'theatrum/bind-field',
					bindings: {
						content: {
							source: 'theatrum/post-meta',
							args: { key: attrs.keyInput || '' },
						},
					},
				},
			} ),
		},
		{
			fromBlock: 'theatrum/meta-date',
			transform: ( attrs ) => {
				const format =
					attrs.dateFormat === 'custom'
						? attrs.customFormat || 'Y-m-d'
						: attrs.dateFormat || 'M jS';
				return {
					metadata: {
						name: 'theatrum/bind-date',
						bindings: {
							content: {
								source: 'theatrum/post-meta',
								args: { key: attrs.keyInput || '', format },
							},
						},
					},
				};
			},
		},
	],
};

addFilter(
	'blocks.registerBlockType',
	'theatrum/add-meta-transforms',
	( settings, name ) => {
		const entries = TRANSFORMS[ name ];
		if ( ! entries ) {
			return settings;
		}

		const newFromTransforms = entries.map(
			( { fromBlock, transform } ) => ( {
				type: 'block',
				blocks: [ fromBlock ],
				transform: ( attrs ) => createBlock( name, transform( attrs ) ),
			} )
		);

		return {
			...settings,
			transforms: {
				...( settings.transforms ?? {} ),
				from: [
					...( settings.transforms?.from ?? [] ),
					...newFromTransforms,
				],
			},
		};
	}
);
