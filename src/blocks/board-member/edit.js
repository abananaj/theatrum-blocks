/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

/**
 * WordPress dependencies
 */
import { useState, useEffect, Fragment, createElement } from '@wordpress/element';
import { TextControl, SelectControl, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object} props Block props
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ style: { background: 'transparent', padding: 0 } });
	const [displayValue, setDisplayValue] = useState('');
	const [displayItems, setDisplayItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	// Fetch the option value when optionName changes
	useEffect(() => {
		if (!attributes.optionName) {
			setDisplayValue('');
			setDisplayItems([]);
			return;
		}

		setIsLoading(true);

		// Fetch option using custom REST endpoint
		apiFetch({ path: `/chance/v1/board-member/${attributes.optionName}` })
			.then((data) => {
				setDisplayValue(data.value || '');
				setDisplayItems(data.items || []);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error('Error fetching board member:', error);
				setDisplayValue('');
				setDisplayItems([]);
				setIsLoading(false);
			});
	}, [attributes.optionName]);

	// Render items with full formatting (matching frontend)
	const renderItems = () => {
		if (displayItems.length === 0) {
			return null;
		}

		return (
			<div style={{ marginTop: '8px' }}>
				{displayItems.map((item, index) => (
					<p key={index} style={{ margin: '8px 0' }}>
						{item.url ? (
							<a href={item.url} target="_blank" rel="noreferrer">
								<strong>{item.title}</strong>
							</a>
						) : (
							<strong>{item.title}</strong>
						)}
						{item.position !== 'Board Members' && <span>, {item.position}</span>}
						{item.meta_title && <br />}
						{item.meta_title && <em>{item.meta_title}</em>}
					</p>
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
						value={attributes.optionName}
						onChange={(value) => setAttributes({ optionName: value })}
						placeholder="e.g., option_board_members"
						help="Enter the WordPress option key to retrieve from wp_options table"
					/>
					<SelectControl
						label="HTML Tag"
						value={attributes.tagName}
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
							value={attributes.href}
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
					createElement(
						attributes.tagName || 'p',
						null,
						displayValue || (attributes.optionName ? '' : 'Enter an option name to display its value')
					)
				)}
			</div>
		</Fragment>
	);
}
