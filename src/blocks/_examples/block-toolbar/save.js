import { useBlockProps, RichText } from '@wordpress/block-editor';

import './style.scss';

export default function save(props) {
	const blockProps = useBlockProps.save({
		className: `block-toolbar-align-${props.attributes.alignment}`,
	});
	return (
		<RichText.Content
			{...blockProps}
			tagName="p"
			value={props.attributes.content}
		/>
	);
}
