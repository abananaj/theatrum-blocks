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
	const [urlValue, setUrlValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Get current post ID from context (Query Loop) or editor
	const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
	const contextPostId = context?.postId;
	const postId = contextPostId || editorPostId;

	// Fetch the post meta value when key or postId changes
	useEffect(() => {
		if (!attributes.keyInput || !postId) {
			setUrlValue('');
			return;
		}

		setIsLoading(true);

		const url = `/chance/v1/meta-button/${postId}/${attributes.keyInput}`;

		apiFetch({ path: url })
			.then((data) => {
				setUrlValue(data.value || '');
				setIsLoading(false);
			})
			.catch(() => {
				setUrlValue('');
				setIsLoading(false);
			});
	}, [attributes.keyInput, postId]);

	return (
		<Fragment>
			<InspectorControls>
				<div style={{ padding: '16px' }}>
					<TextControl
						label="URL Field Key"
						value={attributes.keyInput || ''}
						onChange={(value) => setAttributes({ keyInput: value })}
						placeholder="e.g., video_link, registration_url"
						help="Enter the meta key that contains the URL"
					/>
					<TextControl
						label="Button Text"
						value={attributes.buttonText || ''}
						onChange={(value) => setAttributes({ buttonText: value })}
						placeholder="Learn More"
						help="Text to display on the button"
					/>
				</div>
			</InspectorControls>
			<div {...blockProps}>
				{isLoading && <Spinner />}
				{!isLoading && urlValue && (
					<a
						href={urlValue}
						className={['wp-block-button__link', 'wp-element-button'].join(' ')}
					>
						{attributes.buttonText || 'Learn More'}
					</a>
				)}
				{!isLoading && !urlValue && (
					<p style={{ color: '#999', fontStyle: 'italic' }}>
						No URL found for key: {attributes.keyInput || '[not set]'}
					</p>
				)}
			</div>
		</Fragment>
	);
}
