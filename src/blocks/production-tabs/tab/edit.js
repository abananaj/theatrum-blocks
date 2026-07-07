/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	RichText,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [['core/paragraph']];

export default function Edit({ attributes, setAttributes }) {
	const { title } = attributes;
	const blockProps = useBlockProps({ className: 'ct-tab' });

	const panelProps = useInnerBlocksProps(
		{ className: 'ct-tab__panel' },
		{ template: TEMPLATE }
	);

	return (
		<div {...blockProps}>
			<RichText
				tagName="span"
				className="ct-tab__header"
				value={title}
				allowedFormats={[]}
				onChange={(value) => setAttributes({ title: value })}
				placeholder={__('Tab heading…', 'theatrum-blocks')}
			/>
			<div {...panelProps} />
		</div>
	);
}
