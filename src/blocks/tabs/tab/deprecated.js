/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	RichText,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';

/**
 * v1: `title` (RichText) + freeform InnerBlocks panel, flattened inside `.ct-tab`. Superseded by
 * theatrum/tab-heading + theatrum/tab-content; `migrate` rewraps old content (e.g. post 58462).
 */
const v1 = {
	attributes: {
		title: {
			type: 'string',
			default: '',
		},
	},
	supports: {
		html: false,
		reusable: false,
		anchor: true,
		spacing: {
			padding: true,
			blockGap: true,
		},
		color: {
			text: true,
			background: true,
		},
		typography: {
			fontSize: true,
			fontFamily: true,
			fontStyle: true,
			fontWeight: true,
			lineHeight: true,
		},
	},
	save( { attributes } ) {
		const { title } = attributes;
		const blockProps = useBlockProps.save( { className: 'ct-tab' } );
		const panelProps = useInnerBlocksProps.save( {
			className: 'ct-tab__panel',
			role: 'region',
		} );

		return (
			<div { ...blockProps }>
				<button type="button" className="ct-tab__header">
					<RichText.Content tagName="span" value={ title } />
				</button>
				<div { ...panelProps } />
			</div>
		);
	},
	migrate( attributes, innerBlocks ) {
		const { title } = attributes;

		const headingBlock = createBlock( 'theatrum/tab-heading', {}, [
			createBlock( 'core/heading', { level: 3, content: title } ),
		] );
		const contentBlock = createBlock(
			'theatrum/tab-content',
			{},
			innerBlocks
		);

		return [ {}, [ headingBlock, contentBlock ] ];
	},
};

export default [ v1 ];
