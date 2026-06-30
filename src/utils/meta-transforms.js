import { addFilter } from '@wordpress/hooks';
import { createBlock } from '@wordpress/blocks';

// Maps each core block to the old chance/* block(s) it can receive as transforms.
const TRANSFORMS = {
	'core/image': [
		{
			fromBlock: 'chance/meta-image',
			transform: (attrs) => ({
				metadata: {
					name: 'chance/meta-image',
					bindings: {
						id: { source: 'chance/post-meta', args: { key: attrs.keyInput || '' } },
					},
				},
			}),
		},
	],
	'core/button': [
		{
			fromBlock: 'chance/meta-button',
			transform: (attrs) => ({
				text: attrs.buttonText || 'Learn More',
				metadata: {
					name: 'chance/meta-button',
					bindings: {
						url: { source: 'chance/post-meta', args: { key: attrs.keyInput || '' } },
					},
				},
			}),
		},
	],
	'core/paragraph': [
		{
			fromBlock: 'chance/meta-field',
			transform: (attrs) => ({
				metadata: {
					name: 'chance/meta-field',
					bindings: {
						content: { source: 'chance/post-meta', args: { key: attrs.keyInput || '' } },
					},
				},
			}),
		},
		{
			fromBlock: 'chance/meta-date',
			transform: (attrs) => {
				const format = attrs.dateFormat === 'custom'
					? (attrs.customFormat || 'Y-m-d')
					: (attrs.dateFormat || 'M jS');
				return {
					metadata: {
						name: 'chance/meta-date',
						bindings: {
							content: {
								source: 'chance/post-meta',
								args: { key: attrs.keyInput || '', format },
							},
						},
					},
				};
			},
		},
	],
	'core/embed': [
		{
			fromBlock: 'chance/meta-embed',
			transform: (attrs) => ({
				metadata: {
					name: 'chance/meta-embed',
					bindings: {
						url: { source: 'chance/post-meta', args: { key: attrs.keyInput || '' } },
					},
				},
			}),
		},
	],
	'core/file': [
		{
			fromBlock: 'chance/meta-file',
			transform: (attrs) => ({
				downloadButtonText: attrs.linkText || 'Download File',
				metadata: {
					name: 'chance/meta-file',
					bindings: {
						href: { source: 'chance/post-meta', args: { key: attrs.keyInput || '' } },
					},
				},
			}),
		},
	],
};

addFilter('blocks.registerBlockType', 'chance/add-meta-transforms', (settings, name) => {
	const entries = TRANSFORMS[name];
	if (! entries) return settings;

	const newFromTransforms = entries.map(({ fromBlock, transform }) => ({
		type: 'block',
		blocks: [fromBlock],
		transform: (attrs) => createBlock(name, transform(attrs)),
	}));

	return {
		...settings,
		transforms: {
			...(settings.transforms ?? {}),
			from: [...(settings.transforms?.from ?? []), ...newFromTransforms],
		},
	};
});
