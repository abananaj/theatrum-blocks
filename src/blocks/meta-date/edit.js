/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, SelectControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes, context }) {
	const blockProps = useBlockProps();
	const [displayValue, setDisplayValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Get current post ID from context (Query Loop) or editor
	const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
	const editorPostType = useSelect((select) => select('core/editor').getCurrentPostType());
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

	// Check if we're editing a template (post type starts with 'wp_template')
	const isEditingTemplate = editorPostType && editorPostType.startsWith('wp_template');

	// Fetch the post meta value when key, format, or postId changes
	useEffect(() => {
		if (!attributes.keyInput || !postId) {
			setDisplayValue('');
			return;
		}

		// In template editor, show placeholder
		if (isEditingTemplate && !contextPostId) {
			setDisplayValue(`[${attributes.keyInput}]`);
			return;
		}

		setIsLoading(true);

		// Use custom format if 'custom' is selected, otherwise use the selected preset format
		const format = attributes.dateFormat === 'custom'
			? (attributes.customFormat || 'Y-m-d')
			: attributes.dateFormat;
		const encodedFormat = encodeURIComponent(format);
		const url = `/theatrum/v1/meta-date/${postId}/${attributes.keyInput}/${encodedFormat}`;

		apiFetch({ path: url })
			.then((data) => {
				setDisplayValue(data.value || '');
				setIsLoading(false);
			})
			.catch(() => {
				setDisplayValue('');
				setIsLoading(false);
			});
	}, [attributes.keyInput, attributes.dateFormat, attributes.customFormat, postId, isEditingTemplate, contextPostId]);

	const Tag = attributes.tagName || 'p';

	return (
		<Fragment>
			<InspectorControls>
				<div style={{ padding: '16px' }}>
					<TextControl
						label="Date Field Key"
						value={attributes.keyInput || ''}
						onChange={(value) => setAttributes({ keyInput: value })}
						placeholder="e.g., event_date, publication_date"
						help="Enter the meta key that contains the date value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label="Display Format"
						value={attributes.dateFormat || 'M jS'}
						onChange={(value) => setAttributes({ dateFormat: value })}
						options={[
							{ label: 'Jan 1st', value: 'M jS' },
							{ label: 'January 1', value: 'F j' },
							{ label: '01-01-2026', value: 'm-d-Y' },
							{ label: '1-1-2026', value: 'n-j-Y' },
							{ label: 'Sunday, January 1', value: 'l, F j' },
							{ label: 'Custom', value: 'custom' }
						]}
					/>
					{attributes.dateFormat === 'custom' && (
						<TextControl
							label="Custom Format"
							value={attributes.customFormat || ''}
							onChange={(value) => setAttributes({ customFormat: value })}
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
									<div>H=24-hour format of an hour (00 to 23)</div>
									<div>h=12-hour format of an hour with leading zeros (01 to 12)</div>
									<div>i=Minutes with leading zeros (00 to 59)</div>
									<div>s=Seconds with leading zeros (00 to 59)</div>
									<div>a=Lowercase am/pm</div>
									<div>A=Uppercase AM/PM</div>
									<div>S=Ordinal suffix (eg. st, nd, rd, th)</div>
								</Fragment>
							}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					)}
					<SelectControl
						label="HTML Tag"
						value={attributes.tagName || 'p'}
						onChange={(value) => setAttributes({ tagName: value })}
						options={[
							{ label: '<p>', value: 'p' },
							{ label: '<span>', value: 'span' },
							{ label: '<time>', value: 'time' },
							{ label: '<h1>', value: 'h1' },
							{ label: '<h2>', value: 'h2' },
							{ label: '<h3>', value: 'h3' },
							{ label: '<h4>', value: 'h4' },
							{ label: '<h5>', value: 'h5' },
							{ label: '<h6>', value: 'h6' }
						]}
					/>
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
				</div>
			</InspectorControls>
			<div {...blockProps}>
				{isLoading ? (
					<Spinner />
				) : attributes.keyInput ? (
					<Tag className="wp-block-theatrum-meta-date" style={{ margin: 0, padding: '8px 0', wordBreak: 'break-word' }}>
						{`${attributes.prepend || ''}${displayValue || `[${attributes.keyInput}]`}${attributes.append || ''}`}
					</Tag>
				) : (
					<em style={{ color: '#999' }}>Enter a date field key</em>
				)}
			</div>
		</Fragment>
	);
}
