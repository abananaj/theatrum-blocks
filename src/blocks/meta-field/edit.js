/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes, context }) {
	const blockProps = useBlockProps();
	const [displayValue, setDisplayValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Get current post ID from context (Query Loop) or editor
	const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

	// Fetch the post meta value when key or postId changes
	useEffect(() => {
		if (!attributes.keyInput || !postId) {
			setDisplayValue('');
			return;
		}

		setIsLoading(true);

		const url = `/chance/v1/post-meta/${postId}/${attributes.keyInput}`;

		apiFetch({ path: url })
			.then((data) => {
				setDisplayValue(data.value || '');
				setIsLoading(false);
			})
			.catch(() => {
				setDisplayValue('');
				setIsLoading(false);
			});
	}, [attributes.keyInput, postId]);

	const displayText = displayValue || `[${attributes.keyInput}]`;
	const prependText = attributes.prepend || '';
	const appendText = attributes.append || '';
	const finalText = `${prependText}${displayText}${appendText}`;

	return (
		<Fragment>
			<InspectorControls>
				<div style={{ padding: '16px' }}>
					<TextControl
						label="Key"
						value={attributes.keyInput || ''}
						onChange={(value) => setAttributes({ keyInput: value })}
						placeholder="e.g., page_title, description, custom_field"
						help="Enter the key to retrieve the corresponding value"
					/>
					<TextControl
						label="Prepend"
						value={attributes.prepend || ''}
						onChange={(value) => setAttributes({ prepend: value })}
						placeholder="Text to prepend"
						help="Optional plain text to add before the value"
					/>
					<TextControl
						label="Append"
						value={attributes.append || ''}
						onChange={(value) => setAttributes({ append: value })}
						placeholder="Text to append"
						help="Optional plain text to add after the value"
					/>
				</div>
			</InspectorControls>
			<div {...blockProps}>
				{isLoading ? (
					<Spinner />
				) : attributes.keyInput ? (
					<span className="wp-block-chance-post-meta-field" style={{ wordBreak: 'break-word' }}>
						{finalText}
					</span>
				) : (
					<em style={{ color: '#999' }}>Enter a key to display its value</em>
				)}
			</div>
		</Fragment>
	);
}
