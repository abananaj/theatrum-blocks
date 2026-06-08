import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

// v0 — saved without class on <details>
const v0 = {
	attributes: {
		label: { type: 'string', default: 'Tab' },
		isDefault: { type: 'boolean', default: false },
	},
	save( { attributes } ) {
		const { label, isDefault } = attributes;
		return (
			<details name="tabs" open={ isDefault || undefined }>
				<summary>
					<RichText.Content tagName="span" value={ label } />
				</summary>
				<div className="tab-content">
					<InnerBlocks.Content />
				</div>
			</details>
		);
	},
};

export default [ v0 ];
