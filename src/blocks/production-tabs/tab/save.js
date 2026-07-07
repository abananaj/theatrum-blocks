/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	RichText,
} from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { title } = attributes;
	const blockProps = useBlockProps.save({ className: 'ct-tab' });
	const panelProps = useInnerBlocksProps.save({
		className: 'ct-tab__panel',
		role: 'region',
	});

	return (
		<div {...blockProps}>
			<button type="button" className="ct-tab__header">
				<RichText.Content tagName="span" value={title} />
			</button>
			<div {...panelProps} />
		</div>
	);
}
