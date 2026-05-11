import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { SelectControl, TextControl, Spinner, PanelBody } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const { taxonomy, termId, metaKey, prepend, append } = attributes;

	const [taxonomies, setTaxonomies] = useState([]);
	const [terms, setTerms] = useState([]);
	const [metaValue, setMetaValue] = useState('');
	const [isLoadingTaxonomies, setIsLoadingTaxonomies] = useState(true);
	const [isLoadingTerms, setIsLoadingTerms] = useState(false);
	const [isLoadingMeta, setIsLoadingMeta] = useState(false);

	// Fetch all taxonomies on mount
	useEffect(() => {
		apiFetch({ path: '/wp/v2/taxonomies?context=edit' })
			.then((data) => {
				const options = Object.values(data).map((tax) => ({
					label: tax.name,
					value: tax.rest_base,
				}));
				setTaxonomies(options);
				setIsLoadingTaxonomies(false);
			})
			.catch(() => setIsLoadingTaxonomies(false));
	}, []);

	// Fetch terms when taxonomy changes
	useEffect(() => {
		if (!taxonomy) {
			setTerms([]);
			return;
		}

		setIsLoadingTerms(true);
		setAttributes({ termId: 0 });

		apiFetch({ path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc&context=edit` })
			.then((data) => {
				const options = data.map((term) => ({
					label: term.name,
					value: term.id,
				}));
				setTerms(options);
				setIsLoadingTerms(false);
			})
			.catch(() => {
				setTerms([]);
				setIsLoadingTerms(false);
			});
	}, [taxonomy]);

	// Fetch meta value when termId or metaKey changes
	useEffect(() => {
		if (!termId || !metaKey) {
			setMetaValue('');
			return;
		}

		setIsLoadingMeta(true);

		apiFetch({ path: `/chance/v1/term-meta-field/${termId}/${metaKey}` })
			.then((data) => {
				setMetaValue(data.value || '');
				setIsLoadingMeta(false);
			})
			.catch(() => {
				setMetaValue('');
				setIsLoadingMeta(false);
			});
	}, [termId, metaKey]);

	const selectedTermLabel = terms.find((t) => t.value === termId)?.label;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title="Term" initialOpen={true}>
					{isLoadingTaxonomies ? (
						<Spinner />
					) : (
						<SelectControl
							label="Taxonomy"
							value={taxonomy}
							options={[
								{ label: '— Select taxonomy —', value: '' },
								...taxonomies,
							]}
							onChange={(value) => setAttributes({ taxonomy: value, termId: 0 })}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					)}
					{taxonomy && (
						isLoadingTerms ? (
							<Spinner />
						) : (
							<SelectControl
								label="Term"
								value={termId}
								options={[
									{ label: '— Select term —', value: 0 },
									...terms,
								]}
								onChange={(value) => setAttributes({ termId: parseInt(value) })}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						)
					)}
				</PanelBody>
				<PanelBody title="Meta" initialOpen={true}>
					<TextControl
						label="Meta Key"
						value={metaKey || ''}
						onChange={(value) => setAttributes({ metaKey: value })}
						placeholder="e.g., description, color, icon"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Prepend"
						value={prepend || ''}
						onChange={(value) => setAttributes({ prepend: value })}
						placeholder="Text before value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label="Append"
						value={append || ''}
						onChange={(value) => setAttributes({ append: value })}
						placeholder="Text after value"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{isLoadingMeta ? (
					<Spinner />
				) : metaValue ? (
					<p style={{ margin: 0, padding: '8px 0' }}>{metaValue}</p>
				) : (
					<p style={{ color: '#999', fontStyle: 'italic', margin: 0 }}>
						{termId && metaKey
							? `[${metaKey}] — term #${termId}${selectedTermLabel ? ` (${selectedTermLabel})` : ''}`
							: 'Select a taxonomy, term, and meta key'}
					</p>
				)}
			</div>
		</Fragment>
	);
}
