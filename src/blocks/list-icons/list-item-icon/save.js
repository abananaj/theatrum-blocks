/**
 * Icon List Item Block - Frontend Rendering (child of theatrum/list-icons)
 *
 * Saves a single `<li>` with its optional icon and text. Icon size, spacing,
 * colour, position and hover behaviour are inherited from the parent wrapper's
 * CSS custom properties and modifier classes.
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

const isSvgUrl = ( url ) =>
	typeof url === 'string' &&
	url.toLowerCase().split( '?' )[ 0 ].endsWith( '.svg' );

export default function Save( { attributes } ) {
	const { text, iconUrl, iconAlt } = attributes;
	const blockProps = useBlockProps.save( { className: 'list-icons-item' } );

	return (
		<li { ...blockProps }>
			{ iconUrl && isSvgUrl( iconUrl ) && (
				// SVGs are recolored via a CSS mask (so they pick up
				// --list-icon-color / the inherited text color) instead of an
				// <img>, whose internal SVG colors CSS can't otherwise touch.
				<span
					className="list-icons-icon list-icons-icon--svg"
					style={ { '--list-icon-svg-url': `url("${ iconUrl }")` } }
					role={ iconAlt ? 'img' : undefined }
					aria-label={ iconAlt || undefined }
					aria-hidden={ iconAlt ? undefined : 'true' }
				/>
			) }
			{ iconUrl && ! isSvgUrl( iconUrl ) && (
				<img
					src={ iconUrl }
					alt={ iconAlt || '' }
					className="list-icons-icon"
				/>
			) }
			<RichText.Content
				tagName="span"
				className="list-icons-text"
				value={ text }
			/>
		</li>
	);
}
