import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { PanelBody, SelectControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

const META_KEY_OPTIONS = [
  { label: 'Season Producers', value: 'season_producers' },
  { label: 'Associate Season Producers', value: 'associate_season_producers' },
];

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();
  const [producers, setProducers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const postId = useSelect((select) => select('core/editor').getCurrentPostId());

  useEffect(() => {
    if (!postId) {
      setProducers([]);
      return;
    }

    setIsLoading(true);

    apiFetch({ path: `/chance/v1/season-producer/${postId}/${attributes.metaKey}` })
      .then((data) => {
        setProducers(data.producers || []);
        setIsLoading(false);
      })
      .catch(() => {
        setProducers([]);
        setIsLoading(false);
      });
  }, [postId, attributes.metaKey]);

  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title="Season Producer Settings" initialOpen={true}>
          <SelectControl
            label="Field"
            value={attributes.metaKey}
            options={META_KEY_OPTIONS}
            onChange={(value) => setAttributes({ metaKey: value })}
            help="Select which producer field to display from the season term."
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        {isLoading ? (
          <Spinner />
        ) : producers.length > 0 ? (
          <ul className="season-producer-list">
            {producers.map((producer) => (
              <li key={producer.id} className="season-producer-item">
                {decodeHtmlEntities(producer.title)}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#999', fontStyle: 'italic', margin: 0 }}>
            {postId
              ? 'No season producers found for this post.'
              : 'Season producer names will appear here.'}
          </p>
        )}
      </div>
    </Fragment>
  );
}
