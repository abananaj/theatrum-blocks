/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import {
	TextControl,
	SelectControl,
	Panel,
	PanelBody,
	PanelRow,
} from '@wordpress/components';

const TAG_OPTIONS = [
	{ label: 'span', value: 'span' },
	{ label: 'div', value: 'div' },
	{ label: 'p', value: 'p' },
	{ label: 'em', value: 'em' },
	{ label: 'strong', value: 'strong' },
	{ label: 'h1', value: 'h1' },
	{ label: 'h2', value: 'h2' },
	{ label: 'h3', value: 'h3' },
	{ label: 'h4', value: 'h4' },
	{ label: 'h5', value: 'h5' },
	{ label: 'h6', value: 'h6' },
];

const WRAPPER_TAG_OPTIONS = [
	{ label: 'ul', value: 'ul' },
	{ label: 'ol', value: 'ol' },
	{ label: 'div', value: 'div' },
];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		repeaterKey,
		subfieldA,
		subfieldB,
		tagA,
		tagB,
		tagName,
	} = attributes;

	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Repeater Settings', 'meta-repeater')}>
					<TextControl
						label={__('Repeater Field Key', 'meta-repeater')}
						value={repeaterKey}
						onChange={(value) =>
							setAttributes({ repeaterKey: value })
						}
						help={__('ACF repeater field name/key', 'meta-repeater')}
					/>
					<SelectControl
						label={__('Wrapper Tag', 'meta-repeater')}
						value={tagName}
						options={WRAPPER_TAG_OPTIONS}
						onChange={(value) =>
							setAttributes({ tagName: value })
						}
					/>
				</PanelBody>

				<PanelBody
					title={__('Subfield A', 'meta-repeater')}
					initialOpen={true}
				>
					<TextControl
						label={__('Subfield A Key', 'meta-repeater')}
						value={subfieldA}
						onChange={(value) =>
							setAttributes({ subfieldA: value })
						}
						help={__('ACF subfield name/key', 'meta-repeater')}
					/>
					<SelectControl
						label={__('HTML Tag for Subfield A', 'meta-repeater')}
						value={tagA}
						options={TAG_OPTIONS}
						onChange={(value) =>
							setAttributes({ tagA: value })
						}
					/>
				</PanelBody>

				<PanelBody
					title={__('Subfield B', 'meta-repeater')}
					initialOpen={true}
				>
					<TextControl
						label={__('Subfield B Key', 'meta-repeater')}
						value={subfieldB}
						onChange={(value) =>
							setAttributes({ subfieldB: value })
						}
						help={__('ACF subfield name/key', 'meta-repeater')}
					/>
					<SelectControl
						label={__('HTML Tag for Subfield B', 'meta-repeater')}
						value={tagB}
						options={TAG_OPTIONS}
						onChange={(value) =>
							setAttributes({ tagB: value })
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="wp-block-chance-meta-repeater-editor">
				<p>
					{__('Meta Repeater Block', 'meta-repeater')}
				</p>
				{repeaterKey && (
					<ul>
						<li>
							{__('Repeater: ', 'meta-repeater')}
							<strong>{repeaterKey}</strong>
						</li>
						{subfieldA && (
							<li>
								{__('Subfield A: ', 'meta-repeater')}
								<strong>{subfieldA}</strong>
								{__(' (', 'meta-repeater')}
								{tagA}
								{__(
									')',
									'meta-repeater'
								)}
							</li>
						)}
						{subfieldB && (
							<li>
								{__('Subfield B: ', 'meta-repeater')}
								<strong>{subfieldB}</strong>
								{__(' (', 'meta-repeater')}
								{tagB}
								{__(
									')',
									'meta-repeater'
								)}
							</li>
						)}
					</ul>
				)}
			</div>
		</div>
	);
}
