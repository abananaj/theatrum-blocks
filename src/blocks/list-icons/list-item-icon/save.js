/**
 * Icon List Item Block - Frontend Rendering (child of chance/list-icons)
 *
 * Saves a single `<li>` with its optional icon and text. Icon size, spacing,
 * colour, position and hover behaviour are inherited from the parent wrapper's
 * CSS custom properties and modifier classes.
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const { text, iconUrl, iconAlt } = attributes;
	const blockProps = useBlockProps.save({ className: 'list-icons-item' });

	return (
		<li {...blockProps}>
			{iconUrl && (
				<img src={iconUrl} alt={iconAlt || ''} className="list-icons-icon" />
			)}
			<RichText.Content tagName="span" className="list-icons-text" value={text} />
		</li>
	);
}
