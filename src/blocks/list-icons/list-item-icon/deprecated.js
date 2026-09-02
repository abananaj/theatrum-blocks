import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * v1: SVG icons saved as plain <img>, which CSS couldn't recolor (SVG source is opaque to `color`). Current save() masks SVGs as a <span> instead so --list-icon-color applies; raster icons still save as <img>.
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
