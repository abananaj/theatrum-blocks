import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { TextControl, SelectControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const memberType = attributes.memberType || '';
	const isMemberType = memberType === 'staff' || memberType === 'board';

	return (
		<Fragment>
			<InspectorControls>
				<div style={ { padding: '16px' } }>
					<SelectControl
						label="Display Type"
						value={ memberType }
						options={ [
							{ label: 'Generic Option', value: '' },
							{ label: 'Staff Member', value: 'staff' },
							{ label: 'Board Member', value: 'board' },
						] }
						onChange={ ( value ) =>
							setAttributes( { memberType: value } )
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Option Name"
						value={ attributes.optionName || '' }
						onChange={ ( value ) =>
							setAttributes( { optionName: value } )
						}
						placeholder={
							isMemberType
								? 'e.g., option_staff_members'
								: 'e.g., siteurl, home, blogname'
						}
						help={
							isMemberType
								? 'Enter the WordPress option key for staff/board members'
								: 'Enter the WordPress option key to retrieve from wp_options table'
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					{ ! isMemberType && (
						<TextControl
							label="Post Meta Key"
							value={ attributes.metaKey || '' }
							onChange={ ( value ) =>
								setAttributes( { metaKey: value } )
							}
							placeholder="e.g., title, subtitle"
							help="If the option value is a post ID, display this meta field instead of the post title."
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
					{ ! isMemberType && (
						<Fragment>
							<SelectControl
								label="HTML Tag"
								value={ attributes.tagName || 'p' }
								onChange={ ( value ) =>
									setAttributes( { tagName: value } )
								}
								options={ [
									{ label: '<p>', value: 'p' },
									{ label: '<span>', value: 'span' },
									{ label: '<a>', value: 'a' },
									{ label: '<h1>', value: 'h1' },
									{ label: '<h2>', value: 'h2' },
									{ label: '<h3>', value: 'h3' },
									{ label: '<h4>', value: 'h4' },
									{ label: '<h5>', value: 'h5' },
									{ label: '<h6>', value: 'h6' },
								] }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
							{ attributes.tagName === 'a' && (
								<TextControl
									label="Link URL"
									value={ attributes.href || '' }
									onChange={ ( value ) =>
										setAttributes( { href: value } )
									}
									placeholder="https://example.com"
									help="Enter the URL for the link"
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
							) }
						</Fragment>
					) }
				</div>
			</InspectorControls>
			<div { ...blockProps }>
				{ attributes.optionName ? (
					<ServerSideRender
						block="chance/site-option"
						attributes={ attributes }
					/>
				) : (
					<p style={ { margin: 0, color: '#999' } }>
						Enter an option name to display its value
					</p>
				) }
			</div>
		</Fragment>
	);
}
