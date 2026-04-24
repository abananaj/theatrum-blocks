import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  TextControl,
  SearchControl,
  Spinner,
} from '@wordpress/components';
import { useEffect, useState } from 'react';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { productionId, buttonText } = attributes;
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch available productions
  const fetchProductions = async (search = '') => {
    setIsSearching(true);
    try {
      const query = new URLSearchParams({
        per_page: 20,
        orderby: 'meta_value',
        meta_key: 'opening',
        order: 'DESC',
        tax_query: JSON.stringify([
          {
            taxonomy: 'series',
            terms: ['main', 'holiday'],
            operator: 'IN',
          },
        ]),
      });

      if (search) {
        query.append('search', search);
      }

      const response = await fetch(
        `/wp-json/wp/v2/ct-production?${query}`
      );
      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error fetching productions:', error);
    }
    setIsSearching(false);
  };

  // Fetch selected post details
  useEffect(() => {
    if (productionId) {
      fetch(`/wp-json/wp/v2/ct-production/${productionId}`)
        .then((res) => res.json())
        .then((data) => setSelectedPost(data))
        .catch((err) => console.error('Error fetching post:', err));
    }
  }, [productionId]);

  const handleSearch = (value) => {
    if (value.length > 0) {
      fetchProductions(value);
    } else {
      fetchProductions();
    }
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Production Selection', 'onstage-next')}>
          <SearchControl
            value={productionId ? selectedPost?.title?.rendered : ''}
            onChange={handleSearch}
            placeholder={__(
              'Search productions...',
              'onstage-next'
            )}
          />
          {isSearching && <Spinner />}
          <div className="production-search-results">
            {searchResults.map((post) => (
              <button
                key={post.id}
                className={`production-result ${productionId === post.id ? 'selected' : ''
                  }`}
                onClick={() => {
                  setAttributes({ productionId: post.id });
                  setSelectedPost(post);
                }}
              >
                {post.title.rendered}
              </button>
            ))}
          </div>
          {!productionId && (
            <p className="help-text">
              {__(
                'Leave empty to show the automatically determined next production.',
                'onstage-next'
              )}
            </p>
          )}
          {productionId && selectedPost && (
            <div className="selected-production">
              <p>
                <strong>{__('Selected:', 'onstage-next')}</strong>
              </p>
              <p>{selectedPost.title.rendered}</p>
              <button
                onClick={() => {
                  setAttributes({ productionId: 0 });
                  setSelectedPost(null);
                }}
                className="button"
              >
                {__('Clear Selection', 'onstage-next')}
              </button>
            </div>
          )}
        </PanelBody>

        <PanelBody title={__('Button Settings', 'onstage-next')}>
          <TextControl
            label={__('Button Text', 'onstage-next')}
            value={buttonText}
            onChange={(value) =>
              setAttributes({ buttonText: value })
            }
            help={__(
              'Text displayed on the Learn More button',
              'onstage-next'
            )}
          />
        </PanelBody>
      </InspectorControls>

      <div {...useBlockProps()}>
        <div className="wp-block-cover wp-block-cover__inner-container">
          <div className="wp-block-cover__gradient-background"></div>
          <div className="wp-block-cover__content">
            {selectedPost ? (
              <p>
                {__('Selected Production:', 'onstage-next')}{' '}
                <strong>{selectedPost.title.rendered}</strong>
              </p>
            ) : (
              <p>
                {__(
                  'Next Production (automatic)',
                  'onstage-next'
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
