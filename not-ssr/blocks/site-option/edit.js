import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, SelectControl, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const [displayValue, setDisplayValue] = useState('');
	const [displayItems, setDisplayItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const memberType = attributes.memberType || '';
	const isMemberType = memberType === 'staff' || memberType === 'board';

	useEffect(() => {
		if (!attributes.optionName) {
			setDisplayValue('');
			setDisplayItems([]);
			return;
		}

		setIsLoading(true);

		// Use appropriate endpoint based on memberType
		const metaKey = attributes.metaKey ? `?meta_key=${encodeURIComponent(attributes.metaKey)}` : '';
		const endpoint = isMemberType
			? `/chance/v1/${memberType}-member/${attributes.optionName}`
			: `/chance/v1/site-option/${attributes.optionName}${metaKey}`;

		apiFetch({ path: endpoint })
			.then((data) => {
				setDisplayValue(data.value || '');
				setDisplayItems(data.items || []);
				setIsLoading(false);
			})
			.catch(() => {
				setDisplayValue('');
				setDisplayItems([]);
				setIsLoading(false);
			});
	}, [attributes.optionName, memberType, isMemberType, attributes.metaKey]);

	const Tag = attributes.tagName || 'p';

	const renderItems = () => {
		if (displayItems.length === 0) {
			return null;
		}

		return (
			<div style={{ marginTop: '8px' }}>
				{displayItems.map((item, index) => (
					<Fragment key={index}>
						<p style={{ margin: '4px 0 0 0' }}>
							{item.url ? (
								<a href={item.url} target="_blank" rel="noreferrer">
									<strong>{item.title}</strong>
								</a>
							) : (
								<strong>{item.title}</strong>
							)}
						</p>
						{item.meta_title && (
							<p style={{ margin: '0 0 8px 0' }}>
								<em>{item.meta_title}</em>
							</p>
						)}
					</Fragment>
				))}
			</div>
		);
	};

	return (
		<Fragment>
			<InspectorControls>
				<div style={{ padding: '16px' }}>
					<SelectControl
						label="Display Type"
						value={memberType}
						options={[
							{ label: 'Generic Option', value: '' },
							{ label: 'Staff Member', value: 'staff' },
							{ label: 'Board Member', value: 'board' },
						]}
						onChange={(value) => setAttributes({ memberType: value })}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Option Name"
						value={attributes.optionName || ''}
						onChange={(value) => setAttributes({ optionName: value })}
						placeholder={isMemberType ? 'e.g., option_staff_members' : 'e.g., siteurl, home, blogname'}
						help={isMemberType ? 'Enter the WordPress option key for staff/board members' : 'Enter the WordPress option key to retrieve from wp_options table'}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					{!isMemberType && (
						<TextControl
							label="Post Meta Key"
							value={attributes.metaKey || ''}
							onChange={(value) => setAttributes({ metaKey: value })}
							placeholder="e.g., title, subtitle"
							help="If the option value is a post ID, display this meta field instead of the post title."
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					)}
					{!isMemberType && (
						<Fragment>
							<SelectControl
								label="HTML Tag"
								value={attributes.tagName || 'p'}
								onChange={(value) => setAttributes({ tagName: value })}
								options={[
									{ label: '<p>', value: 'p' },
									{ label: '<span>', value: 'span' },
									{ label: '<a>', value: 'a' },
									{ label: '<h1>', value: 'h1' },
									{ label: '<h2>', value: 'h2' },
									{ label: '<h3>', value: 'h3' },
									{ label: '<h4>', value: 'h4' },
									{ label: '<h5>', value: 'h5' },
									{ label: '<h6>', value: 'h6' }
								]}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
							{attributes.tagName === 'a' && (
								<TextControl
									label="Link URL"
									value={attributes.href || ''}
									onChange={(value) => setAttributes({ href: value })}
									placeholder="https://example.com"
									help="Enter the URL for the link"
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
							)}
						</Fragment>
					)}
				</div>
			</InspectorControls>
			<div {...blockProps}>
				{isLoading && <Spinner />}
				{!isLoading && (isMemberType || displayItems.length > 0) && renderItems()}
				{!isLoading && !isMemberType && displayItems.length === 0 && attributes.tagName === 'a' && (
					<a href={attributes.href || '#'}>
						{displayValue || (attributes.optionName ? '' : 'Enter an option name to display its value')}
					</a>
				)}
				{!isLoading && !isMemberType && displayItems.length === 0 && attributes.tagName !== 'a' && (
					<Tag style={{ margin: 0, wordBreak: 'break-word' }}>
						{displayValue || (attributes.optionName ? '' : 'Enter an option name to display its value')}
					</Tag>
				)}
			</div>
		</Fragment>
	);
}
