wp.blocks.registerBlockType('chance/production-credits', {
  apiVersion: 3,
  edit: (props) => {
    const { useBlockProps } = wp.blockEditor;
    const { useState, useEffect } = wp.element;
    const { Spinner } = wp.components;
    const { useSelect } = wp.data;

    const blockProps = useBlockProps();
    const [credits, setCredits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Get current post ID
    const postId = useSelect((select) => select('core/editor').getCurrentPostId());

    // Fetch credits when post ID changes
    useEffect(() => {
      if (!postId) {
        setCredits([]);
        return;
      }

      setIsLoading(true);

      // Fetch credits using REST endpoint
      wp.apiFetch({ path: `/chance/v1/production-credits/${postId}` })
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

    // Helper function to decode HTML entities
    const decodeHtmlEntities = (text) => {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = text;
      return textarea.value;
    };

    const listItems = credits.map((credit) => {
      const artistTitle = decodeHtmlEntities(credit.artist_title);
      const role = credit.role ? decodeHtmlEntities(credit.role) : '';

      const linkContent = wp.element.createElement(
        'span',
        { className: 'artist' },
        artistTitle
      );

      const link = wp.element.createElement(
        'a',
        { href: credit.artist_url },
        linkContent
      );

      const children = [link];

      if (role) {
        children.push(', ');
        children.push(
          wp.element.createElement(
            'span',
            { className: 'role', key: `${credit.id}-role` },
            role
          )
        );
      }

      return wp.element.createElement(
        'li',
        { key: credit.id },
        ...children
      );
    });

    return wp.element.createElement(
      'div',
      blockProps,
      isLoading
        ? wp.element.createElement(Spinner, null)
        : wp.element.createElement(
          'ul',
          { className: 'production-credits-ul' },
          credits.length > 0
            ? listItems
            : wp.element.createElement('li', null, 'No credits found')
        )
    );
  },
  save: () => null
});
