import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect, createElement } from '@wordpress/element';
import {
	TextControl,
	SelectControl,
	Spinner,
	PanelBody,
	BaseControl,
	ComboboxControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

// Subfields sit inside a row (<li> or <p>), so only inline-safe tags apply.
const SUBFIELD_TAG_OPTIONS = [
	{ label: '<span>', value: 'span' },
	{ label: '<p>', value: 'p' },
	{ label: '<h1>', value: 'h1' },
	{ label: '<h2>', value: 'h2' },
	{ label: '<h3>', value: 'h3' },
	{ label: '<h4>', value: 'h4' },
	{ label: '<h5>', value: 'h5' },
	{ label: '<h6>', value: 'h6' },
];

// One choice sets both the block wrapper and the row tag together, since
// the two are structurally paired (li only makes sense inside ul/ol; p
// rows need a plain div around them, not another list).
const ROW_STYLE_OPTIONS = [
	{ label: 'Paragraph text', value: 'p' },
	{ label: 'Unordered List', value: 'ul' },
	{ label: 'Ordered List', value: 'ol' },
];

function resolveRowStyle(tagName) {
	const rowStyle = ['ul', 'ol', 'p'].includes(tagName) ? tagName : 'p';
	const isParagraphRows = rowStyle === 'p';
	return {
		rowStyle,
		isParagraphRows,
		WrapperTag: isParagraphRows ? 'div' : rowStyle,
		ItemTag: isParagraphRows ? 'p' : 'li',
	};
}

export default function Edit({ attributes, setAttributes, context }) {
	const blockProps = useBlockProps();
	const [rows, setRows] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [postSearchInput, setPostSearchInput] = useState('');
	const [searchOptions, setSearchOptions] = useState([]);

	const editorPostId = useSelect((select) => select('core/editor')?.getCurrentPostId?.() ?? 0);
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

		apiFetch({ path: `/theatrum/v1/meta-repeater/${postId}/${attributes.repeaterKey}` })
			.then((data) => {
				setRows(Array.isArray(data.rows) ? data.rows : []);
				setIsLoading(false);
			})
			.catch(() => {
				setRows([]);
				setIsLoading(false);
			});
	}, [attributes.repeaterKey, postId]);

	const { rowStyle, isParagraphRows, WrapperTag, ItemTag } = resolveRowStyle(attributes.tagName);
	const TagA = isParagraphRows ? 'span' : (attributes.tagA || 'span');
	const TagB = isParagraphRows ? 'span' : (attributes.tagB || 'span');

	const renderPreview = () => {
		if (!rows.length) {
			return (
				<p style={{ color: '#999', fontStyle: 'italic' }}>
					{attributes.repeaterKey
						? `No rows found for: "${attributes.repeaterKey}"`
						: 'Enter a repeater key in the sidebar'}
				</p>
			);
		}

		const items = rows.map((row, i) => {
			const valA = attributes.subfieldA ? (row[attributes.subfieldA] ?? '') : '';
			const valB = attributes.subfieldB ? (row[attributes.subfieldB] ?? '') : '';
			return createElement(
				ItemTag,
				{ key: i },
				valA && createElement(TagA, { className: 'repeater-subfield-a' }, String(valA)),
				valA && valB ? ' ' : null,
				valB && createElement(TagB, { className: 'repeater-subfield-b' }, String(valB)),
				!valA && !valB && (
					<span style={{ color: '#aaa' }}>Row {i + 1} — set subfield keys to see values</span>
				)
			);
		});

		return createElement(WrapperTag, { className: 'wp-block-theatrum-meta-repeater-preview' }, ...items);
	};

	return (
		<Fragment>
			<InspectorControls>
				<ToolsPanel
					label="Post Source"
					panelId="theatrum/meta-repeater"
					resetAll={() => {
						setAttributes({ overridePostId: 0 });
						setPostSearchInput('');
						setSearchOptions([]);
					}}
				>
					<ToolsPanelItem
						hasValue={() => !!attributes.overridePostId}
						label="Override Post"
						panelId="theatrum/meta-repeater"
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
						label="Block Format"
						value={rowStyle}
						onChange={(value) => {
							const nextIsParagraphRows = value === 'p';
							setAttributes({
								tagName: value,
								...(nextIsParagraphRows ? { tagA: 'span', tagB: 'span' } : {}),
							});
						}}
						options={ROW_STYLE_OPTIONS}
						help="Sets the outer block tag and each row's tag together."
					/>

					<BaseControl.VisualLabel style={{ display: 'block', marginTop: '24px' }}>
						Subfield A
					</BaseControl.VisualLabel>
					<TextControl
						label="Key"
						value={attributes.subfieldA || ''}
						onChange={(value) => setAttributes({ subfieldA: value })}
						placeholder="e.g., text, name"
						help="The ACF subfield key for the first field"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label="Tag"
						value={TagA}
						onChange={(value) => setAttributes({ tagA: value })}
						options={SUBFIELD_TAG_OPTIONS}
						disabled={isParagraphRows}
						help={isParagraphRows ? 'Locked to <span> while rows are <p> tags.' : undefined}
					/>

					<BaseControl.VisualLabel style={{ display: 'block', marginTop: '24px' }}>
						Subfield B
					</BaseControl.VisualLabel>
					<TextControl
						label="Key"
						value={attributes.subfieldB || ''}
						onChange={(value) => setAttributes({ subfieldB: value })}
						placeholder="e.g., url, title"
						help="The ACF subfield key for the second field (optional)"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label="Tag"
						value={TagB}
						onChange={(value) => setAttributes({ tagB: value })}
						options={SUBFIELD_TAG_OPTIONS}
						disabled={isParagraphRows}
						help={isParagraphRows ? 'Locked to <span> while rows are <p> tags.' : undefined}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{isLoading ? <Spinner /> : renderPreview()}
			</div>
		</Fragment>
	);
}
