import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const [metaValue, setMetaValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!attributes.termId || !attributes.metaKey) {
			setMetaValue('');
			return;
		}

		setIsLoading(true);

		const url = `/chance/v1/term-meta-field/${attributes.termId}/${attributes.metaKey}`;

		apiFetch({ path: url })
			.then((data) => {
				setMetaValue(data.value || '');
				setIsLoading(false);
			})
			.catch(() => {
				setMetaValue('');
				setIsLoading(false);
			});
	}, [attributes.termId, attributes.metaKey]);

	return (
		<Fragment>
			<InspectorControls>
				<div style={{ padding: '16px' }}>
					<TextControl
						label="Term ID"
						type="number"
						value={attributes.termId || ''}
						onChange={(value) => setAttributes({ termId: value ? parseInt(value) : 0 })}
						placeholder="e.g., 5"
						help="Enter the ID of the taxonomy term"
					/>
					<TextControl
						label="Meta Key"
						value={attributes.metaKey || ''}
						onChange={(value) => setAttributes({ metaKey: value })}
						placeholder="e.g., description, color, icon"
						help="Enter the meta key to display"
					/>
				</div>
			</InspectorControls>
			<div {...blockProps}>
				{isLoading ? (
					<Spinner />
				) : metaValue ? (
					<p style={{ margin: 0, padding: '8px 0' }}>{metaValue}</p>
				) : (
					<p style={{ color: '#999', fontStyle: 'italic', margin: 0 }}>
						{attributes.termId && attributes.metaKey
							? `[${attributes.metaKey}]`
							: 'Enter a term ID and meta key'}
					</p>
				)}
			</div>
		</Fragment>
	);
}
