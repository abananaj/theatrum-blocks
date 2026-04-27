import { useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

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
      .catch((error) => {
        console.error('Error fetching production credits:', error);
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
      <li key={credit.id} className="credit">
        <a href={credit.artist_url}>
          <p className="title">{artistTitle}</p>
        </a>
        {role && (
          <p>
            <span className="role">{role}</span>
          </p>
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
          {listItems.length > 0 ? listItems : <li>No credits found</li>}
        </ul>
      )}
    </div>
  );
}
