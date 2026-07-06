import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';

const DATE_FORMAT_OPTIONS = [
	{ label: 'Jan 1st', value: 'M jS' },
	{ label: 'January 1', value: 'F j' },
	{ label: '01-01-2026', value: 'm-d-Y' },
	{ label: '1-1-2026', value: 'n-j-Y' },
	{ label: 'Sunday, January 1', value: 'l, F j' },
	{ label: 'Custom', value: 'custom' },
];

function getMetaBinding(attributes) {
	const bindings = attributes?.metadata?.bindings ?? {};
	const entries = Object.entries(bindings).filter(
		([, b]) => b?.source === 'chance/post-meta'
	);
	if (! entries.length) return null;
	const [attr, binding] = entries[0];
	return { attr, binding };
}

function setBindingArg(attributes, attr, argName, argValue) {
	return {
		metadata: {
			...(attributes.metadata ?? {}),
			bindings: {
				...(attributes.metadata?.bindings ?? {}),
				[attr]: {
					source: 'chance/post-meta',
					args: {
						...((attributes.metadata?.bindings?.[attr] ?? {}).args ?? {}),
						[argName]: argValue,
					},
				},
			},
		},
	};
}

const withMetaBindingPanel = createHigherOrderComponent((BlockEdit) => {
	return function WithMetaBindingPanel(props) {
		const { attributes, setAttributes, isSelected } = props;
		const meta = getMetaBinding(attributes);

		if (! meta || ! isSelected) {
			return <BlockEdit {...props} />;
		}

		const { attr, binding } = meta;
		const currentKey    = binding?.args?.key          ?? '';
		const currentFormat = binding?.args?.format       ?? 'M jS';
		const customFormat  = binding?.args?.customFormat ?? '';
		const isDate        = attributes?.metadata?.name === 'chance/bind-date';
		const isCustom      = currentFormat === 'custom';

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title="Meta Source" initialOpen>
						<TextControl
							label="Meta Key"
							value={currentKey}
							onChange={(val) =>
								setAttributes(setBindingArg(attributes, attr, 'key', val))
							}
							placeholder="e.g., opening, hero_image"
							help="ACF field key or post meta key"
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						{isDate && (
							<SelectControl
								label="Date Format"
								value={currentFormat}
								options={DATE_FORMAT_OPTIONS}
								onChange={(val) =>
									setAttributes(setBindingArg(attributes, attr, 'format', val))
								}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						)}
						{isDate && isCustom && (
							<TextControl
								label="Custom Format"
								value={customFormat}
								onChange={(val) =>
									setAttributes(setBindingArg(attributes, attr, 'customFormat', val))
								}
								placeholder="e.g., M j, Y"
								help="PHP date format string (Y=year, M=month, j=day, etc.)"
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						)}
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withMetaBindingPanel');

addFilter('editor.BlockEdit', 'chance/meta-binding-panel', withMetaBindingPanel);
