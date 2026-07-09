import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	TextControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps( {
		style: { background: 'transparent', padding: 0 },
	} );

	return (
		<Fragment>
			<InspectorControls>
				<div style={ { padding: '16px' } }>
					<TextControl
						label="Meta Key"
						value={ attributes.keyInput }
						onChange={ ( value ) =>
							setAttributes( { keyInput: value } )
						}
						placeholder="e.g., related_production, venue_id"
						help="Enter the meta key that contains a post ID or Post Object"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label="HTML Tag"
						value={ attributes.tagName }
						onChange={ ( value ) =>
							setAttributes( { tagName: value } )
						}
						options={ [
							{ label: '<p>', value: 'p' },
							{ label: '<span>', value: 'span' },
							{ label: '<h1>', value: 'h1' },
							{ label: '<h2>', value: 'h2' },
							{ label: '<h3>', value: 'h3' },
							{ label: '<h4>', value: 'h4' },
							{ label: '<h5>', value: 'h5' },
							{ label: '<h6>', value: 'h6' },
						] }
					/>
					<ToggleControl
						label="Link to post"
						checked={ attributes.linkToPost }
						onChange={ ( value ) =>
							setAttributes( { linkToPost: value } )
						}
						help="Wrap the title in a link to the related post"
						__nextHasNoMarginBottom
					/>
					<TextControl
						label="Prepend text"
						value={ attributes.prepend }
						onChange={ ( value ) =>
							setAttributes( { prepend: value } )
						}
						placeholder="e.g., Venue: "
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Append text"
						value={ attributes.append }
						onChange={ ( value ) =>
							setAttributes( { append: value } )
						}
						placeholder="e.g., ."
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Separator"
						value={ attributes.separator }
						onChange={ ( value ) =>
							setAttributes( { separator: value } )
						}
						placeholder="e.g., ', '"
						help="Text placed between each linked post when the meta holds multiple IDs"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</div>
			</InspectorControls>
			<div { ...blockProps }>
				{ attributes.keyInput ? (
					<ServerSideRender
						block="chance/meta-related"
						attributes={ attributes }
					/>
				) : (
					<p style={ { margin: 0, color: '#999' } }>
						Enter a meta key to display a related post
					</p>
				) }
			</div>
		</Fragment>
	);
}
