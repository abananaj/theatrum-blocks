/**
 * Icon panel for the cards of an Icon Accordion — the rail icon and the rail's background colour,
 * both per `core/accordion-item`. Follows src/format-controls.js's registerBlockType/BlockEdit/
 * BlockListBlock/getSaveContent.extraProps shape, the core-block-extension pattern chance-ollie's
 * ctGridColumns/ctGridSpan established.
 *
 * The icon is any image from the media library (the theme allows SVG uploads — see
 * chance-ollie/inc/utils/svg-uploads.php — so a real icon set works here, not just raster). Core
 * marks the rail span aria-hidden, so the icon is decorative and needs no alt text.
 *
 * It is drawn as a background-image and NOT as a mask painted in the card's text colour, which is
 * what the design wants and what the retired built-in glyph set did. Masking is not available here:
 * this site offloads its media to S3 (chance-theater.s3.us-west-1.amazonaws.com), CSS `mask-image`
 * is CORS-restricted where `background-image` is not, and the bucket sends no
 * Access-Control-Allow-Origin — so a masked attachment renders as nothing at all, with no error
 * anywhere. Measured 2026-09-07: masking a data: URI paints, masking the same attachment URL does
 * not, and `img.crossOrigin = 'anonymous'` on it fails. Give the bucket a CORS rule for the site
 * origin and tinting becomes a few lines again; until then an icon arrives in whatever colours it
 * was uploaded with, and the rail colour below is the way to sit it on a contrasting ground.
 *
 * Everything persists as a custom property in the card's inline style, because a class cannot carry
 * an arbitrary URL or colour. Two KSES details govern the values written (safecss_filter_attr()):
 *
 *   URL — allowed. A `--*` property whose value starts with `url(` is protocol-checked against
 *   wp_allowed_protocols(), which includes http/https, and the whole `url(…)` is then lifted out of
 *   the string before the "no bare parentheses" test. An attachment URL passes; a `data:` URI
 *   would not.
 *
 *   Colour — a palette choice is stored as `var(--wp--preset--color--<slug>)` rather than the
 *   literal. Only var/calc/clamp/… are lifted out before that same test, so a literal `hsl(...)`,
 *   which is what most of this theme's palette resolves to, would be silently dropped for anyone
 *   without `unfiltered_html`. Storing the preset var also means a repalette follows automatically.
 *
 * The panel only appears inside an accordion carrying `is-style-tm-accordion-icon`, which is why it
 * has to look at the parent block rather than its own attributes.
 *
 * It is a ToolsPanel, and the rail colour is the one control here NOT shown by default — it is the
 * exception to this codebase's usual preference for isShownByDefault, because the rail is meant to
 * be a tinted strip of the card and colouring it separately is the deliberate case, not the common
 * one. It is a menu item away, and picking a colour keeps it visible from then on.
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	InspectorControls,
	ColorPalette,
	MediaUpload,
	MediaUploadCheck,
	useSettings,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	BaseControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const TARGET_BLOCK = 'core/accordion-item';
const STYLE_CLASS = 'is-style-tm-accordion-icon';

/** Marker class style.scss keys off — the URL itself rides in the inline style beside it. */
const ICON_CLASS = 'has-ct-icon';

const PRESET_VAR = /^var\(--wp--preset--color--([a-z0-9-]+)\)$/;

function hasStyle(className, slug) {
	return (className || '').split(/\s+/).includes(slug);
}

/**
 * Palette colour -> the preset var actually stored (see the KSES note above).
 * @param {string} value   Colour picked in the palette.
 * @param {Array}  palette Editor colour palette.
 * @return {string} The value to store on the attribute.
 */
function toStoredColor(value, palette) {
	if (!value) {
		return '';
	}
	const preset = (palette || []).find((entry) => entry.color === value);
	return preset ? `var(--wp--preset--color--${preset.slug})` : value;
}

/**
 * Stored value -> the colour ColorPalette needs to show the swatch as selected.
 * @param {string} stored  Attribute value.
 * @param {Array}  palette Editor colour palette.
 * @return {string|undefined} The colour to mark selected, if any.
 */
function toDisplayColor(stored, palette) {
	const preset = PRESET_VAR.exec(stored || '');
	if (!preset) {
		return stored || undefined;
	}
	return (palette || []).find((entry) => entry.slug === preset[1])
		?.color;
}

/**
 * The inline CSS vars and marker classes for a card, shared by the canvas and save filters below.
 * @param {Object} attributes Card attributes.
 * @return {Object} `{ style, classNames }`, both empty when nothing is set.
 */
function buildCardProps(attributes) {
	const style = {};
	const classNames = [];

	if (attributes?.ctIconUrl) {
		// Quoted, so a filename with a space or a parenthesis still parses as one url() token.
		style[
			'--tm-accordion-icon-glyph'
		] = `url('${attributes.ctIconUrl}')`;
		classNames.push(ICON_CLASS);
	}

	if (attributes?.ctIconBackground) {
		style['--tm-accordion-icon-rail-bg'] = attributes.ctIconBackground;
	}

	return { style, classNames };
}

/**
 * Joins a block's existing class list with the markers above, dropping empties.
 * @param {string} existing   Current class list.
 * @param {Array}  classNames Markers to add.
 * @return {string|undefined} The merged list, or undefined when there is nothing to set.
 */
function mergeClassNames(existing, classNames) {
	return (
		[existing, ...classNames].filter(Boolean).join(' ') || undefined
	);
}

/* 1. Register the icon and rail-colour attributes on core/accordion-item. */
addFilter(
	'blocks.registerBlockType',
	'theatrum-blocks/accordion-icon/attributes',
	(settings, name) => {
		if (TARGET_BLOCK !== name) {
			return settings;
		}
		return {
			...settings,
			attributes: {
				...settings.attributes,
				// The id is not read anywhere yet — it is stored so the media library can show the
				// current selection, and so a future revision could resolve the URL server-side.
				ctIconId: { type: 'number' },
				ctIconUrl: { type: 'string', default: '' },
				ctIconBackground: { type: 'string', default: '' },
			},
		};
	}
);

/* 2. The Icon panel itself. Split into its own component so the hooks below only ever run for a card inside an Icon Accordion. */
function IconPanel({ attributes, setAttributes, clientId }) {
	const [palette] = useSettings('color.palette');
	const isIconAccordion = useSelect(
		(select) => {
			const { getBlockRootClientId, getBlockAttributes } =
				select(blockEditorStore);
			const parentId = getBlockRootClientId(clientId);
			return parentId
				? hasStyle(
					getBlockAttributes(parentId)?.className,
					STYLE_CLASS
				)
				: false;
		},
		[clientId]
	);

	if (!isIconAccordion) {
		return null;
	}

	const { ctIconUrl, ctIconBackground } = attributes;

	return (
		<InspectorControls>
			<ToolsPanel
				label={__('Icon', 'theatrum-blocks')}
				panelId={clientId}
				resetAll={() =>
					setAttributes({
						ctIconId: undefined,
						ctIconUrl: '',
						ctIconBackground: '',
					})
				}
			>
				<ToolsPanelItem
					hasValue={() => !!ctIconUrl}
					label={__('Rail icon', 'theatrum-blocks')}
					onDeselect={() =>
						setAttributes({ ctIconId: undefined, ctIconUrl: '' })
					}
					isShownByDefault
					panelId={clientId}
				>
					<BaseControl
						__nextHasNoMarginBottom
						id="tm-accordion-icon-image"
						label={__('Rail icon', 'theatrum-blocks')}
						help={__(
							'Shown in the coloured rail. Without one the card falls back to the accordion’s open/close “+”.',
							'theatrum-blocks'
						)}
					>
						<div className="tm-accordion-icon-media">
							{ctIconUrl && (
								<span
									aria-hidden="true"
									className="tm-accordion-icon-preview"
									style={{
										'--tm-accordion-icon-glyph': `url('${ctIconUrl}')`,
									}}
								/>
							)}
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={['image']}
									value={attributes.ctIconId}
									onSelect={(media) =>
										setAttributes({
											ctIconId: media.id,
											// An icon renders at ~28px, so the full-size file is
											// wasted bandwidth; `medium` is scaled, not cropped.
											// SVGs have no sizes at all, hence the fallback.
											ctIconUrl:
												media.sizes?.medium?.url ||
												media.url,
										})
									}
									render={({ open }) => (
										<Button
											variant="secondary"
											onClick={open}
										>
											{ctIconUrl
												? __(
													'Replace',
													'theatrum-blocks'
												)
												: __(
													'Select icon',
													'theatrum-blocks'
												)}
										</Button>
									)}
								/>
							</MediaUploadCheck>
							{ctIconUrl && (
								<Button
									variant="tertiary"
									isDestructive
									onClick={() =>
										setAttributes({
											ctIconId: undefined,
											ctIconUrl: '',
										})
									}
								>
									{__('Remove', 'theatrum-blocks')}
								</Button>
							)}
						</div>
					</BaseControl>
				</ToolsPanelItem>

				<ToolsPanelItem
					hasValue={() => !!ctIconBackground}
					label={__('Icon background', 'theatrum-blocks')}
					onDeselect={() =>
						setAttributes({ ctIconBackground: '' })
					}
					isShownByDefault={false}
					panelId={clientId}
				>
					<BaseControl
						__nextHasNoMarginBottom
						id="tm-accordion-icon-background"
						label={__('Icon background', 'theatrum-blocks')}
						help={__(
							'Colours the rail behind the icon. Left unset, the rail is a tinted strip of the card’s own colour.',
							'theatrum-blocks'
						)}
					>
						<ColorPalette
							colors={palette || []}
							value={toDisplayColor(
								ctIconBackground,
								palette
							)}
							onChange={(value) =>
								setAttributes({
									ctIconBackground: toStoredColor(
										value,
										palette
									),
								})
							}
							enableAlpha={false}
							clearable
						/>
					</BaseControl>
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);
}

const withIconControls = createHigherOrderComponent(
	(BlockEdit) => (props) => {
		if (TARGET_BLOCK !== props.name) {
			return <BlockEdit {...props} />;
		}

		return (
			<Fragment>
				<BlockEdit {...props} />
				<IconPanel {...props} />
			</Fragment>
		);
	},
	'withAccordionIconControls'
);
addFilter(
	'editor.BlockEdit',
	'theatrum-blocks/accordion-icon/controls',
	withIconControls
);

/* 3. Paint it in the canvas. */
const withIconEditorStyle = createHigherOrderComponent(
	(BlockListBlock) => (props) => {
		const { style, classNames } = buildCardProps(props.attributes);

		if (TARGET_BLOCK !== props.name || !Object.keys(style).length) {
			return <BlockListBlock {...props} />;
		}

		return (
			<BlockListBlock
				{...props}
				className={mergeClassNames(props.className, classNames)}
				wrapperProps={{
					...props.wrapperProps,
					style: { ...props.wrapperProps?.style, ...style },
				}}
			/>
		);
	},
	'withAccordionIconEditorStyle'
);
addFilter(
	'editor.BlockListBlock',
	'theatrum-blocks/accordion-icon/editor-style',
	withIconEditorStyle
);

/* 4. Persist it into saved markup. core/accordion-item is dynamic, but its render callback only rewrites the saved HTML with WP_HTML_Tag_Processor, so what is written here survives to the front end. */
addFilter(
	'blocks.getSaveContent.extraProps',
	'theatrum-blocks/accordion-icon/save-props',
	(props, blockType, attributes) => {
		const { style, classNames } = buildCardProps(attributes);

		if (
			TARGET_BLOCK !== blockType.name ||
			!Object.keys(style).length
		) {
			return props;
		}

		// props.style is a plain object here — merge as an object, never string-concatenate.
		return {
			...props,
			className: mergeClassNames(props.className, classNames),
			style: { ...props.style, ...style },
		};
	}
);
