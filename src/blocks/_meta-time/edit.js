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
						label="Time Field Key"
						value={ attributes.keyInput || '' }
						onChange={ ( value ) =>
							setAttributes( { keyInput: value } )
						}
						placeholder="e.g., event_time, start_time"
						help="Enter the meta key that contains the time value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label="Display Format"
						value={ attributes.timeFormat || 'g:i A' }
						onChange={ ( value ) =>
							setAttributes( { timeFormat: value } )
						}
						options={ [
							{ label: '2:30 PM', value: 'g:i A' },
							{ label: '02:30 PM', value: 'h:i A' },
							{ label: '14:30', value: 'H:i' },
							{ label: 'Custom', value: 'custom' },
						] }
					/>
					{ attributes.timeFormat === 'custom' && (
						<TextControl
							label="Custom Format"
							value={ attributes.customFormat || '' }
							onChange={ ( value ) =>
								setAttributes( { customFormat: value } )
							}
							placeholder="e.g., H:i or g:i A"
							help={
								<Fragment>
									<div>G=Hour (24h format)</div>
									<div>g=Hour (12h format)</div>
									<div>i=Minutes (00-59)</div>
									<div>a=am/pm</div>
									<div>A=AM/PM</div>
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
						block="chance/meta-time"
						attributes={ attributes }
					/>
				) : (
					<em style={ { color: '#999' } }>
						Enter a time field key to display its value
					</em>
				) }
			</div>
		</Fragment>
	);
}
