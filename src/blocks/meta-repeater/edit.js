import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect, createElement } from '@wordpress/element';
import {
	TextControl,
	SelectControl,
	Spinner,
	PanelBody,
	ComboboxControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

const SUBFIELD_TAG_OPTIONS = [
	{ label: '<span>', value: 'span' },
	{ label: '<li>', value: 'li' },
	{ label: '<div>', value: 'div' },
	{ label: '<p>', value: 'p' },
	{ label: '<em>', value: 'em' },
	{ label: '<strong>', value: 'strong' },
	{ label: '<h3>', value: 'h3' },
	{ label: '<h4>', value: 'h4' },
	{ label: '<h5>', value: 'h5' },
	{ label: '<h6>', value: 'h6' },
];

export default function Edit({ attributes, setAttributes, context }) {
	const blockProps = useBlockProps();
	const [rows, setRows] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [postSearchInput, setPostSearchInput] = useState('');
	const [searchOptions, setSearchOptions] = useState([]);

	const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
	const contextPostId = context?.postId;
	const defaultPostId = contextPostId || editorPostId;
	const postId = attributes.overridePostId || defaultPostId;

	// Fetch post search results for the ComboboxControl
	useEffect(() => {
		if (!postSearchInput || postSearchInput.length < 2) {
			setSearchOptions([]);
			return;
		}
		apiFetch({
			path: `/wp/v2/search?search=${encodeURIComponent(postSearchInput)}&per_page=20&type=post&subtype=any`,
		})
			.then((results) => {
				if (Array.isArray(results)) {
					setSearchOptions(
						results.map((r) => ({
							label: `${r.title} — ${r.subtype} #${r.id}`,
							value: String(r.id),
						}))
					);
				}
			})
			.catch(() => setSearchOptions([]));
	}, [postSearchInput]);

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

	const TagA = attributes.tagA || 'span';
	const TagB = attributes.tagB || 'span';
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
			const valA = attributes.subfieldA ? (row[attributes.subfieldA] ?? '') : '';
			const valB = attributes.subfieldB ? (row[attributes.subfieldB] ?? '') : '';
			return (
				<li key={i}>
					{valA && createElement(TagA, { className: 'repeater-subfield-a' }, String(valA))}
					{valB && createElement(TagB, { className: 'repeater-subfield-b' }, String(valB))}
					{!valA && !valB && (
						<span style={{ color: '#aaa' }}>Row {i + 1} — set subfield keys to see values</span>
					)}
				</li>
			);
		});

		return createElement(Fragment, null, headingEl, createElement(TagWrapper, { className: 'wp-block-chance-meta-repeater-preview' }, ...items));
	};

	return (
		<Fragment>
			<InspectorControls>
				<ToolsPanel
					label="Post Source"
					resetAll={() => {
						setAttributes({ overridePostId: 0 });
						setPostSearchInput('');
						setSearchOptions([]);
					}}
				>
					<ToolsPanelItem
						hasValue={() => !!attributes.overridePostId}
						label="Override Post"
						onDeselect={() => {
							setAttributes({ overridePostId: 0 });
							setPostSearchInput('');
							setSearchOptions([]);
						}}
						isShownByDefault={false}
					>
						<ComboboxControl
							label="Search posts"
							value={attributes.overridePostId ? String(attributes.overridePostId) : null}
							options={searchOptions}
							onFilterValueChange={(val) => setPostSearchInput(val)}
							onChange={(val) => {
								setAttributes({ overridePostId: val ? parseInt(val, 10) : 0 });
							}}
							help="Search by title to select a post"
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						<TextControl
							label="Post ID"
							type="number"
							value={attributes.overridePostId || ''}
							onChange={(val) => {
								setAttributes({ overridePostId: val ? parseInt(val, 10) : 0 });
							}}
							placeholder={`Default: ${defaultPostId || '—'}`}
							help="Or enter a numeric post ID directly"
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</ToolsPanelItem>
				</ToolsPanel>
				<PanelBody title="Repeater Settings" initialOpen={true}>
					<TextControl
						label="Repeater Field Key"
						value={attributes.repeaterKey || ''}
						onChange={(value) => setAttributes({ repeaterKey: value })}
						placeholder="e.g., info, team_members"
						help="The ACF repeater field key"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
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
				<PanelBody title="Subfield A" initialOpen={true}>
					<TextControl
						label="Subfield A Key"
						value={attributes.subfieldA || ''}
						onChange={(value) => setAttributes({ subfieldA: value })}
						placeholder="e.g., text, name"
						help="The ACF subfield key for the first field"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label="HTML Tag for Subfield A"
						value={attributes.tagA || 'span'}
						onChange={(value) => setAttributes({ tagA: value })}
						options={SUBFIELD_TAG_OPTIONS}
					/>
				</PanelBody>
				<PanelBody title="Heading" initialOpen={false}>
					<TextControl
						label="Heading Text"
						value={attributes.headingText || ''}
						onChange={(value) => setAttributes({ headingText: value })}
						placeholder="e.g., Credits, Cast"
						help="Appears before the list. Hidden when there are no rows."
						__nextHasNoMarginBottom
						__next40pxDefaultSize
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
				<PanelBody title="Subfield B" initialOpen={false}>
					<TextControl
						label="Subfield B Key"
						value={attributes.subfieldB || ''}
						onChange={(value) => setAttributes({ subfieldB: value })}
						placeholder="e.g., url, title"
						help="The ACF subfield key for the second field (optional)"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label="HTML Tag for Subfield B"
						value={attributes.tagB || 'span'}
						onChange={(value) => setAttributes({ tagB: value })}
						options={SUBFIELD_TAG_OPTIONS}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{isLoading ? <Spinner /> : renderPreview()}
			</div>
		</Fragment>
	);
}
