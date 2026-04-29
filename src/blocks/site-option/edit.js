import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, SelectControl, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const [displayValue, setDisplayValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!attributes.optionName) {
			setDisplayValue('');
			return;
		}

		setIsLoading(true);

		apiFetch({ path: `/chance/v1/site-option/${attributes.optionName}` })
			.then((data) => {
				setDisplayValue(data.value || '');
				setIsLoading(false);
			})
			.catch(() => {
				setDisplayValue('');
				setIsLoading(false);
			});
	}, [attributes.optionName]);

	const Tag = attributes.tagName || 'p';

	return (
		<Fragment>
			<InspectorControls>
				<div style={{ padding: '16px' }}>
					<TextControl
						label="Option Name"
						value={attributes.optionName || ''}
						onChange={(value) => setAttributes({ optionName: value })}
						placeholder="e.g., siteurl, home, blogname"
						help="Enter the WordPress option key to retrieve from wp_options table"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
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
