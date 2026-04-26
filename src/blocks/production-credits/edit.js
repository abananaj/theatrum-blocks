import { useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit() {
	const blockProps = useBlockProps();
	const [credits, setCredits] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const postId = useSelect((select) => select('core/editor').getCurrentPostId());

	useEffect(() => {
		if (!postId) {
			setCredits([]);
			return;
		}

		setIsLoading(true);

		apiFetch({ path: `/chance/v1/production-credits/${postId}` })
			.then((data) => {
				setCredits(data.credits || []);
				setIsLoading(false);
			})
			.catch(() => {
				setCredits([]);
				setIsLoading(false);
			});
	}, [postId]);

	const decodeHtmlEntities = (text) => {
		const textarea = document.createElement('textarea');
		textarea.innerHTML = text;
		return textarea.value;
	};

	const listItems = credits.map((credit) => {
		const artistTitle = decodeHtmlEntities(credit.artist_title);
		const role = credit.role ? decodeHtmlEntities(credit.role) : '';

		return (
			<li key={credit.id}>
				<a href={credit.artist_url}>
					<span className="artist">{artistTitle}</span>
				</a>
				{role && (
					<>
						,{' '}
						<span className="role">{role}</span>
					</>
				)}
			</li>
		);
	});

	return (
		<div {...blockProps}>
			{isLoading ? (
				<Spinner />
			) : (
				<ul className="production-credits-ul">
					{credits.length > 0 ? listItems : <li>No credits found</li>}
				</ul>
			)}
		</div>
	);
}
