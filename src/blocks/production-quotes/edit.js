import { useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ context }) {
	const blockProps = useBlockProps();
	const [quotes, setQuotes] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
	const postId = context?.postId || editorPostId;

	useEffect(() => {
		if (!postId) {
			setQuotes([]);
			return;
		}

		setIsLoading(true);

		apiFetch({ path: `/chance/v1/production-quotes/${postId}` })
			.then((data) => {
				setQuotes(Array.isArray(data.quotes) ? data.quotes : []);
				setIsLoading(false);
			})
			.catch(() => {
				setQuotes([]);
				setIsLoading(false);
			});
	}, [postId]);

	return (
		<div {...blockProps}>
			{isLoading ? (
				<Spinner />
			) : quotes.length > 0 ? (
				<div className="wp-block-chance-production-quotes">
					{quotes.map((item, index) => (
						<div key={index} className="wp-block-chance-production-quotes-item">
							<blockquote className="wp-block-quote">
								<p
									className="quote-text"
									dangerouslySetInnerHTML={{ __html: item.quote_text }}
								/>
								{item.source && (
									<p className="quote-cite">
										{'– '}
										{item.link_url ? (
											<a href={item.link_url}>{item.source}</a>
										) : (
											item.source
										)}
									</p>
								)}
							</blockquote>
						</div>
					))}
				</div>
			) : (
				<p style={{ color: '#999', fontStyle: 'italic' }}>
					{postId
						? 'No quotes found for this post.'
						: 'Production Quotes – no post context available.'}
				</p>
			)}
		</div>
	);
}
