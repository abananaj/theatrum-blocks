import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, SelectControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes, context }) {
	const blockProps = useBlockProps();
	const [rowCount, setRowCount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

	useEffect(() => {
		if (!attributes.repeaterKey || !postId) {
			setRowCount(0);
			return;
		}

		setIsLoading(true);

		const url = `/chance/v1/meta-repeater/${postId}/${attributes.repeaterKey}`;

		apiFetch({ path: url })
			.then((data) => {
				setRowCount(data.rows || 0);
				setIsLoading(false);
			})
			.catch(() => {
				setRowCount(0);
				setIsLoading(false);
			});
	}, [attributes.repeaterKey, postId]);

	return (
		<Fragment>
			<InspectorControls>
				<div style={{ padding: '16px' }}>
					<TextControl
						label="Repeater Field Key"
						value={attributes.repeaterKey || ''}
						onChange={(value) => setAttributes({ repeaterKey: value })}
						placeholder="e.g., team_members, gallery_items"
						help="Enter the ACF repeater field key"
					/>
					<TextControl
						label="Subfield Keys (comma-separated)"
						value={attributes.subfields || ''}
						onChange={(value) => setAttributes({ subfields: value })}
						placeholder="e.g., name, title, email"
						help="Enter the subfield keys to display, separated by commas"
					/>
					<SelectControl
						label="List Tag"
						value={attributes.tagName || 'ul'}
						onChange={(value) => setAttributes({ tagName: value })}
						options={[
							{ label: 'Unordered List', value: 'ul' },
							{ label: 'Ordered List', value: 'ol' },
							{ label: 'Div', value: 'div' }
						]}
					/>
				</div>
			</InspectorControls>
			<div {...blockProps}>
				{isLoading && <Spinner />}
				{!isLoading && rowCount > 0 && (
					<p style={{ color: '#666' }}>
						{rowCount} row{rowCount === 1 ? '' : 's'} found
					</p>
				)}
				{!isLoading && rowCount === 0 && (
					<p style={{ color: '#999', fontStyle: 'italic' }}>
						No repeater rows found for: {attributes.repeaterKey || '[not set]'}
					</p>
				)}
			</div>
		</Fragment>
	);
}
