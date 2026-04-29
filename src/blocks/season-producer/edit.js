import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect, createElement } from '@wordpress/element';
import { PanelBody, SelectControl, TextControl, Spinner } from '@wordpress/components';
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

  const HeadingTag = attributes.headingLevel || 'h2';
  const headingEl = attributes.headingText
    ? createElement(HeadingTag, { className: 'season-producer-heading' }, attributes.headingText)
    : null;

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
        <PanelBody title="Heading" initialOpen={false}>
          <TextControl
            label="Heading Text"
            value={attributes.headingText || ''}
            onChange={(value) => setAttributes({ headingText: value })}
            placeholder="e.g., Season Producers"
            help="Appears before the list. Hidden when there are no producers."
            __nextHasNoMarginBottom
            __next40pxDefaultSize
          />
          <SelectControl
            label="Heading Level"
            value={attributes.headingLevel || 'h2'}
            onChange={(value) => setAttributes({ headingLevel: value })}
            options={[
              { label: 'H2', value: 'h2' },
              { label: 'H3', value: 'h3' },
              { label: 'H4', value: 'h4' },
              { label: 'H5', value: 'h5' },
              { label: 'H6', value: 'h6' },
            ]}
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        {isLoading ? (
          <Spinner />
        ) : producers.length > 0 ? (
          <Fragment>
            {headingEl}
            <ul className="season-producer-list">
              {producers.map((producer) => (
                <li key={producer.id} className="season-producer-item">
                  {decodeHtmlEntities(producer.title)}
                </li>
              ))}
            </ul>
          </Fragment>
        ) : (
          <Fragment>
            {headingEl}
            <p style={{ color: '#999', fontStyle: 'italic', margin: 0 }}>
              {postId
                ? 'No season producers found for this post.'
                : 'Season producer names will appear here.'}
            </p>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
