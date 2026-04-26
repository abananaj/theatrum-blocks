import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, SelectControl, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ style: { background: 'transparent', padding: 0 } });
	const [displayValue, setDisplayValue] = useState('');
	const [displayItems, setDisplayItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!attributes.optionName) {
			setDisplayValue('');
			setDisplayItems([]);
			return;
		}

		setIsLoading(true);

		apiFetch({ path: `/chance/v1/staff-member/${attributes.optionName}` })
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
	}, [attributes.optionName]);

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
					<TextControl
						label="Option Name"
						value={attributes.optionName || ''}
						onChange={(value) => setAttributes({ optionName: value })}
						placeholder="e.g., option_staff_members"
						help="Enter the WordPress option key to retrieve from wp_options table"
					/>
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
					/>
					{attributes.tagName === 'a' && (
						<TextControl
							label="Link URL"
							value={attributes.href || ''}
							onChange={(value) => setAttributes({ href: value })}
							placeholder="https://example.com"
							help="Enter the URL for the link"
						/>
					)}
				</div>
			</InspectorControls>
			<div {...blockProps}>
				{isLoading ? (
					<Spinner />
				) : displayItems.length > 0 ? (
					renderItems()
				) : attributes.tagName === 'a' ? (
					<a href={attributes.href || '#'}>
						{displayValue || (attributes.optionName ? '' : 'Enter an option name to display its value')}
					</a>
				) : (
					<Tag style={{ margin: 0, wordBreak: 'break-word' }}>
						{displayValue || (attributes.optionName ? '' : 'Enter an option name to display its value')}
					</Tag>
				)}
			</div>
		</Fragment>
	);
}
