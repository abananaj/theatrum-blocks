import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect, createElement } from '@wordpress/element';
import { TextControl, SelectControl, Spinner, PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

const DATE_FORMAT_OPTIONS = [
	{ label: 'Sunday, January 1', value: 'l, F j' },
	{ label: 'Jan 1st', value: 'M jS' },
	{ label: 'January 1', value: 'F j' },
	{ label: '01-01-2026', value: 'm-d-Y' },
	{ label: '1-1-2026', value: 'n-j-Y' },
	{ label: 'Custom', value: 'custom' },
];

/**
 * Format a raw date string for editor preview using the Intl API.
 * Falls back to the raw string if parsing fails.
 */
function formatDatePreview(rawValue, dateFormat) {
	if (!rawValue) return '';
	const dateOnly = rawValue.replace(/\s.*$/, '').substring(0, 10);
	const parsed = new Date(dateOnly + 'T00:00:00');
	if (isNaN(parsed.getTime())) return rawValue;

	// Simple format approximation for preview
	const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	return parsed.toLocaleDateString('en-US', opts);
}

export default function Edit({ attributes, setAttributes, context }) {
	const blockProps = useBlockProps();
	const [rows, setRows] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

	useEffect(() => {
		if (!attributes.repeaterKey || !postId) {
			setRows([]);
			return;
		}

		setIsLoading(true);

		apiFetch({ path: `/chance/v1/meta-repeater/${postId}/${attributes.repeaterKey}` })
			.then((data) => {
				setRows(Array.isArray(data.rows) ? data.rows : []);
				setIsLoading(false);
			})
			.catch(() => {
				setRows([]);
				setIsLoading(false);
			});
	}, [attributes.repeaterKey, postId]);

	const TagWrapper = attributes.tagName || 'ul';

	const renderPreview = () => {
		const HeadingTag = attributes.headingLevel || 'h2';
		const headingEl = attributes.headingText
			? createElement(HeadingTag, { className: 'repeater-heading' }, attributes.headingText)
			: null;

		if (!rows.length) {
			return (
				<Fragment>
					{headingEl}
					<p style={{ color: '#999', fontStyle: 'italic' }}>
						{attributes.repeaterKey
							? `No rows found for: "${attributes.repeaterKey}"`
							: 'Enter a repeater key in the sidebar'}
					</p>
				</Fragment>
			);
		}

		const items = rows.map((row, i) => {
			const rawDate = attributes.dateSubfield ? (row[attributes.dateSubfield] ?? '') : '';
			const label = attributes.labelSubfield ? (row[attributes.labelSubfield] ?? '') : '';
			const formattedDate = rawDate ? formatDatePreview(rawDate, attributes.dateFormat) : '';

			return (
				<li key={i} className="performance-row">
					{formattedDate && <span className="performance-date">{formattedDate}</span>}
					{label && <span className="performance-label">{String(label)}</span>}
					{!formattedDate && !label && (
						<span style={{ color: '#aaa' }}>Row {i + 1} — set subfield keys to see values</span>
					)}
				</li>
			);
		});

		return createElement(
			Fragment,
			null,
			headingEl,
			createElement(TagWrapper, { className: 'wp-block-chance-performance-repeater-preview' }, ...items)
		);
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title="Repeater Settings" initialOpen={true}>
					<TextControl
						label="Repeater Field Key"
						value={attributes.repeaterKey || ''}
						onChange={(value) => setAttributes({ repeaterKey: value })}
						placeholder="e.g., performances, show_dates"
						help="The ACF repeater field key"
					/>
					<SelectControl
						label="Wrapper Tag"
						value={attributes.tagName || 'ul'}
						onChange={(value) => setAttributes({ tagName: value })}
						options={[
							{ label: 'Unordered List (ul)', value: 'ul' },
							{ label: 'Ordered List (ol)', value: 'ol' },
							{ label: 'Div', value: 'div' },
						]}
					/>
				</PanelBody>
				<PanelBody title="Date Subfield" initialOpen={true}>
					<TextControl
						label="Date Subfield Key"
						value={attributes.dateSubfield || ''}
						onChange={(value) => setAttributes({ dateSubfield: value })}
						placeholder="e.g., date, performance_date"
						help="The ACF subfield key containing the date value"
					/>
					<SelectControl
						label="Date Format"
						value={attributes.dateFormat || 'l, F j'}
						onChange={(value) => setAttributes({ dateFormat: value })}
						options={DATE_FORMAT_OPTIONS}
					/>
					{attributes.dateFormat === 'custom' && (
						<TextControl
							label="Custom Format"
							value={attributes.customFormat || ''}
							onChange={(value) => setAttributes({ customFormat: value })}
							placeholder="e.g., M j, Y"
							help="PHP date format string"
						/>
					)}
				</PanelBody>
				<PanelBody title="Label Subfield" initialOpen={false}>
					<TextControl
						label="Label Subfield Key"
						value={attributes.labelSubfield || ''}
						onChange={(value) => setAttributes({ labelSubfield: value })}
						placeholder="e.g., note, venue, time"
						help="Optional second subfield displayed alongside the date"
					/>
				</PanelBody>
				<PanelBody title="Heading" initialOpen={false}>
					<TextControl
						label="Heading Text"
						value={attributes.headingText || ''}
						onChange={(value) => setAttributes({ headingText: value })}
						placeholder="e.g., Performances, Show Dates"
						help="Appears before the list."
					/>
					<SelectControl
						label="Heading Level"
						value={attributes.headingLevel || 'h2'}
						onChange={(value) => setAttributes({ headingLevel: value })}
						options={[
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
						]}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{isLoading ? <Spinner /> : renderPreview()}
			</div>
		</Fragment>
	);
}
