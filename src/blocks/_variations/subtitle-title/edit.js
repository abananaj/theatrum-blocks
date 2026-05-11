import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { createElement } from '@wordpress/element';
import './editor.scss';

export default function Edit({ attributes, setAttributes, context }) {
	const { level, subtitlePosition, isLink, linkTarget } = attributes;
	const blockProps = useBlockProps({ className: 'wp-block-chance-subtitle-title' });

	// Resolve post ID from Query Loop context or current editor post
	const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
	const editorPostType = useSelect((select) => select('core/editor').getCurrentPostType());
	const contextPostId = context?.postId;
	const contextPostType = context?.postType;
	const postId = contextPostId || editorPostId;
	const postType = contextPostType || editorPostType;

	// Get the post title (live from entity store)
	const [rawTitle] = useEntityProp('postType', postType, 'title', postId);

	// Get subtitle from post meta
	const [meta] = useEntityProp('postType', postType, 'meta', postId);
	const subtitle = meta?.subtitle || '';
	const titleText = typeof rawTitle === 'object' && rawTitle?.rendered
		? rawTitle.rendered
		: (rawTitle || '');

	const TitleTag = `h${level}`;

	const titleEl = (
		<TitleTag className="subtitle-title__title">
			{titleText || <span className="subtitle-title__placeholder">Post Title</span>}
		</TitleTag>
	);

	const subtitleEl = subtitle ? (
		<h2 className="subtitle-title__subtitle">{subtitle}</h2>
	) : (
		<h2 className="subtitle-title__subtitle subtitle-title__subtitle--empty">Subtitle</h2>
	);

	return (
		<Fragment>
			<InspectorControls>
				<ToolsPanel
					label="Subtitle"
					resetAll={() => {
						setAttributes({ subtitlePosition: 'before' });
					}}
				>
					<ToolsPanelItem
						hasValue={() => subtitlePosition !== 'before'}
						label="Subtitle position"
						onDeselect={() => setAttributes({ subtitlePosition: 'before' })}
						isShownByDefault
					>
						<SelectControl
							label="Position"
							value={subtitlePosition}
							options={[
								{ label: 'Before title', value: 'before' },
								{ label: 'After title', value: 'after' },
							]}
							onChange={(val) => setAttributes({ subtitlePosition: val })}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</ToolsPanelItem>
				</ToolsPanel>
				<PanelBody title="Title Settings" initialOpen={false}>
					<ToggleControl
						label="Make title a link"
						checked={isLink}
						onChange={(val) => setAttributes({ isLink: val })}
						__nextHasNoMarginBottom
					/>
					{isLink && (
						<SelectControl
							label="Link target"
							value={linkTarget}
							options={[
								{ label: 'Same tab', value: '_self' },
								{ label: 'New tab', value: '_blank' },
							]}
							onChange={(val) => setAttributes({ linkTarget: val })}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					)}
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{subtitlePosition === 'before' && subtitleEl}
				{titleEl}
				{subtitlePosition === 'after' && subtitleEl}
			</div>
		</Fragment>
	);
}
