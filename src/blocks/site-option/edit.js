import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import {
	TextControl,
	SelectControl,
	ToggleControl,
	Spinner,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const [ displayValue, setDisplayValue ] = useState( '' );
	const [ displayItems, setDisplayItems ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( false );
	const memberType = attributes.memberType || '';
	const isMemberType = memberType === 'staff' || memberType === 'board';

	useEffect( () => {
		if ( ! attributes.optionName ) {
			setDisplayValue( '' );
			setDisplayItems( [] );
			return;
		}

		setIsLoading( true );

		// Use appropriate endpoint based on memberType
		const metaKey = attributes.metaKey
			? `?meta_key=${ encodeURIComponent( attributes.metaKey ) }`
			: '';
		const endpoint = isMemberType
			? `/theatrum/v1/${ memberType }-member/${ attributes.optionName }`
			: `/theatrum/v1/site-option/${ attributes.optionName }${ metaKey }`;

		apiFetch( { path: endpoint } )
			.then( ( data ) => {
				setDisplayValue( data.value || '' );
				setDisplayItems( data.items || [] );
				setIsLoading( false );
			} )
			.catch( () => {
				setDisplayValue( '' );
				setDisplayItems( [] );
				setIsLoading( false );
			} );
	}, [
		attributes.optionName,
		memberType,
		isMemberType,
		attributes.metaKey,
	] );

	const AFFIX_STYLE_OPTIONS = [
		{ label: 'None', value: '' },
		{ label: 'Italic <em>', value: 'em' },
		{ label: 'Bold <strong>', value: 'strong' },
		{ label: 'Small <small>', value: 'small' },
	];

	const renderAffix = ( text, tag ) => {
		if ( ! text ) {
			return null;
		}
		const AffixTag = tag || null;
		return AffixTag ? <AffixTag>{ text }</AffixTag> : text;
	};

	const renderItems = () => {
		if ( displayItems.length === 0 ) {
			return null;
		}

		const linkTitle = isMemberType || attributes.linkPostTitle !== false;

		return (
			<div style={ { marginTop: '8px' } }>
				{ renderAffix( attributes.prepend, attributes.prependTag ) }
				{ displayItems.map( ( item, index ) => (
					<p key={ index } style={ { margin: '4px 0 0 0' } }>
						{ item.url && linkTitle ? (
							<a
								href={ item.url }
								target="_blank"
								rel="noreferrer"
								onClick={ ( event ) => event.preventDefault() }
							>
								{ item.title }
							</a>
						) : (
							<span>{ item.title }</span>
						) }
						{ ! isMemberType && attributes.metaKey && ',' }
						{ item.meta_title && (
							<span className="site-option-meta">
								{ ' ' }
								{ renderAffix(
									item.meta_title,
									attributes.appendTag
								) }
							</span>
						) }
					</p>
				) ) }
				{ renderAffix( attributes.append, attributes.appendTag ) }
			</div>
		);
	};

	return (
		<Fragment>
			<InspectorControls>
				<div style={ { padding: '16px' } }>
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
							help="If the option value is a post ID, display this meta field in addition to the post title."
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
					{ ! isMemberType && (
						<ToggleControl
							label="Link Post Title"
							checked={ attributes.linkPostTitle !== false }
							onChange={ ( value ) =>
								setAttributes( { linkPostTitle: value } )
							}
							help="When the option value is a post ID, link the post title to the post. The meta value is always plain text."
							__nextHasNoMarginBottom
						/>
					) }
					{ ! isMemberType && (
						<TextControl
							label="Link URL"
							value={ attributes.href || '' }
							onChange={ ( value ) =>
								setAttributes( { href: value } )
							}
							placeholder="https://example.com"
							help="If set, the option value links to this URL (only applies when the option isn't a post/term reference)."
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
					<TextControl
						label="Prepend"
						value={ attributes.prepend || '' }
						onChange={ ( value ) =>
							setAttributes( { prepend: value } )
						}
						placeholder="Text before value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label="Prepend Style"
						value={ attributes.prependTag || '' }
						options={ AFFIX_STYLE_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { prependTag: value } )
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Append"
						value={ attributes.append || '' }
						onChange={ ( value ) =>
							setAttributes( { append: value } )
						}
						placeholder="Text after value"
						disabled={ !! attributes.metaKey }
						help={
							attributes.metaKey
								? 'Disabled while a Post Meta Key is set. Use Append Style to style the meta value instead.'
								: undefined
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label="Append Style"
						value={ attributes.appendTag || '' }
						options={ AFFIX_STYLE_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { appendTag: value } )
						}
						help={
							attributes.metaKey
								? 'Styles the post meta value.'
								: undefined
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</div>
			</InspectorControls>
			<div { ...blockProps }>
				{ isLoading && <Spinner /> }
				{ ! isLoading && displayItems.length > 0 && renderItems() }
				{ ! isLoading &&
					displayItems.length === 0 &&
					! attributes.optionName && (
						<p
							style={ {
								margin: 0,
								color: '#999',
								fontStyle: 'italic',
							} }
						>
							Enter an option name to display its value
						</p>
					) }
				{ ! isLoading &&
					displayItems.length === 0 &&
					attributes.optionName &&
					isMemberType && (
						<p
							style={ { margin: 0 } }
						>{ `[${ attributes.optionName }]` }</p>
					) }
				{ ! isLoading &&
					displayItems.length === 0 &&
					attributes.optionName &&
					! isMemberType && (
						<p style={ { margin: 0, wordBreak: 'break-word' } }>
							{ renderAffix(
								attributes.prepend,
								attributes.prependTag
							) }
							{ attributes.href ? (
								<a
									href={ attributes.href }
									onClick={ ( event ) =>
										event.preventDefault()
									}
								>
									{ displayValue ||
										`[${ attributes.optionName }]` }
								</a>
							) : (
								<span>
									{ displayValue ||
										`[${ attributes.optionName }]` }
								</span>
							) }
							{ renderAffix(
								attributes.append,
								attributes.appendTag
							) }
						</p>
					) }
			</div>
		</Fragment>
	);
}
