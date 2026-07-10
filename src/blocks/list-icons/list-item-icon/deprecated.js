import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * v1: SVG icons were saved as a plain <img>, which meant CSS could never
 * recolor them (an <img>'s SVG source is opaque to `color`/CSS variables).
 * Current save() renders SVG icons as a CSS-masked <span> instead so
 * --list-icon-color / the inherited text color actually applies. Non-SVG
 * (raster) icons are unaffected and still save as <img> either way.
 */
const v1 = {
	attributes: {
		text: {
			type: 'string',
			source: 'html',
			selector: '.list-icons-text',
			default: '',
		},
		iconId: {
			type: 'number',
			default: 0,
		},
		iconUrl: {
			type: 'string',
			default: '',
		},
		iconAlt: {
			type: 'string',
			default: '',
		},
	},
	save( { attributes } ) {
		const { text, iconUrl, iconAlt } = attributes;
		const blockProps = useBlockProps.save( {
			className: 'list-icons-item',
		} );

		return (
			<li { ...blockProps }>
				{ iconUrl && (
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
	},
};

export default [ v1 ];
