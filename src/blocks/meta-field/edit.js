/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, SelectControl, Spinner, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes, context }) {
	const blockProps = useBlockProps();
	const [displayValue, setDisplayValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Get current post ID from context (Query Loop) or editor
	const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

	// Fetch the post meta value when key or postId changes
	useEffect(() => {
		if (!attributes.keyInput || !postId) {
			setDisplayValue('');
			return;
		}

		setIsLoading(true);

		const url = `/chance/v1/post-meta/${postId}/${attributes.keyInput}`;

		apiFetch({ path: url })
			.then((data) => {
				setDisplayValue(data.value || '');
				setIsLoading(false);
			})
			.catch(() => {
				setDisplayValue('');
				setIsLoading(false);
			});
	}, [attributes.keyInput, postId]);

	const Tag = attributes.tagName || 'span';
	const displayText = displayValue || `[${attributes.keyInput}]`;
	const prependText = attributes.prepend || '';
	const appendText = attributes.append || '';
	const finalText = `${prependText}${displayText}${appendText}`;
	const isEmpty = !displayValue && attributes.keyInput;
	const shouldHideIfEmpty = attributes.hideIfEmpty && isEmpty;

	return (
		<Fragment>
			<InspectorControls>
				<div style={{ padding: '16px' }}>
					<TextControl
						label="Key"
						value={attributes.keyInput || ''}
						onChange={(value) => setAttributes({ keyInput: value })}
						placeholder="e.g., page_title, description, custom_field"
						help="Enter the key to retrieve the corresponding value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label="HTML Tag"
						value={attributes.tagName || 'span'}
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
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					)}
					<TextControl
						label="Prepend"
						value={attributes.prepend || ''}
						onChange={(value) => setAttributes({ prepend: value })}
						placeholder="Text to prepend"
						help="Optional plain text to add before the value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Append"
						value={attributes.append || ''}
						onChange={(value) => setAttributes({ append: value })}
						placeholder="Text to append"
						help="Optional plain text to add after the value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<ToggleControl
						label="Hide if empty"
						checked={attributes.hideIfEmpty || false}
						onChange={(value) => setAttributes({ hideIfEmpty: value })}
						help="Hide the parent container when this field has no value"
					/>
				</div>
			</InspectorControls>
			<div {...blockProps} className={`${blockProps.className}${shouldHideIfEmpty ? ' meta-field-empty' : ''}`}>
				{isLoading ? (
					<Spinner />
				) : attributes.keyInput ? (
					<Tag
						className="wp-block-chance-post-meta-field"
						style={{ wordBreak: 'break-word' }}
						{...(attributes.tagName === 'a' ? { href: attributes.href || undefined } : {})}
					>
						{finalText}
					</Tag>
				) : (
					<em style={{ color: '#999' }}>Enter a key to display its value</em>
				)}
			</div>
		</Fragment>
	);
}
