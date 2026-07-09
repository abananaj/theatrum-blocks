/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { TextControl, SelectControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<div style={ { padding: '16px' } }>
					<TextControl
						label="Date Field Key"
						value={ attributes.keyInput || '' }
						onChange={ ( value ) =>
							setAttributes( { keyInput: value } )
						}
						placeholder="e.g., event_date, publication_date"
						help="Enter the meta key that contains the date value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label="Display Format"
						value={ attributes.dateFormat || 'M jS' }
						onChange={ ( value ) =>
							setAttributes( { dateFormat: value } )
						}
						options={ [
							{ label: 'Jan 1st', value: 'M jS' },
							{ label: 'January 1', value: 'F j' },
							{ label: '01-01-2026', value: 'm-d-Y' },
							{ label: '1-1-2026', value: 'n-j-Y' },
							{ label: 'Sunday, January 1', value: 'l, F j' },
							{ label: 'Custom', value: 'custom' },
						] }
					/>
					{ attributes.dateFormat === 'custom' && (
						<TextControl
							label="Custom Format"
							value={ attributes.customFormat || '' }
							onChange={ ( value ) =>
								setAttributes( { customFormat: value } )
							}
							placeholder="e.g., M j, Y"
							help={
								<Fragment>
									<div>Y=year</div>
									<div>F=Month name (full)</div>
									<div>M=Month name (short)</div>
									<div>m=Month ##</div>
									<div>n=Month # (no leading zero)</div>
									<div>d=Day #</div>
									<div>j=Day # (no leading zero)</div>
									<div>l=Day of week (full)</div>
									<div>D=Day of week (short)</div>
									<div>
										H=24-hour format of an hour (00 to 23)
									</div>
									<div>
										h=12-hour format of an hour with leading
										zeros (01 to 12)
									</div>
									<div>
										i=Minutes with leading zeros (00 to 59)
									</div>
									<div>
										s=Seconds with leading zeros (00 to 59)
									</div>
									<div>a=Lowercase am/pm</div>
									<div>A=Uppercase AM/PM</div>
									<div>
										S=Ordinal suffix (eg. st, nd, rd, th)
									</div>
								</Fragment>
							}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
					<SelectControl
						label="HTML Tag"
						value={ attributes.tagName || 'span' }
						onChange={ ( value ) =>
							setAttributes( { tagName: value } )
						}
						options={ [
							{ label: '<p>', value: 'p' },
							{ label: '<span>', value: 'span' },
							{ label: '<time>', value: 'time' },
							{ label: '<h1>', value: 'h1' },
							{ label: '<h2>', value: 'h2' },
							{ label: '<h3>', value: 'h3' },
							{ label: '<h4>', value: 'h4' },
							{ label: '<h5>', value: 'h5' },
							{ label: '<h6>', value: 'h6' },
						] }
					/>
					<TextControl
						label="Prepend"
						value={ attributes.prepend || '' }
						onChange={ ( value ) =>
							setAttributes( { prepend: value } )
						}
						placeholder="Text to prepend"
						help="Optional plain text to add before the value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Append"
						value={ attributes.append || '' }
						onChange={ ( value ) =>
							setAttributes( { append: value } )
						}
						placeholder="Text to append"
						help="Optional plain text to add after the value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</div>
			</InspectorControls>
			<div { ...blockProps }>
				{ attributes.keyInput ? (
					<ServerSideRender
						block="chance/meta-date"
						attributes={ attributes }
					/>
				) : (
					<em style={ { color: '#999' } }>Enter a date field key</em>
				) }
			</div>
		</Fragment>
	);
}
