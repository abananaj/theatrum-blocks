import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { TextControl, RangeControl, Spinner, PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ attributes, setAttributes, context }) {
  const blockProps = useBlockProps({
    style: { display: 'inline-flex', alignItems: 'center' },
  });

  const [iconData, setIconData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const editorPostId = useSelect((select) => select('core/editor').getCurrentPostId());
  const contextPostId = context?.postId;
  const postId = contextPostId || editorPostId;

  useEffect(() => {
    if (!attributes.keyInput || !postId) {
      setIconData(null);
      return;
    }

    setIsLoading(true);

    apiFetch({ path: `/chance/v1/meta-icon/${postId}/${attributes.keyInput}` })
      .then((data) => {
        setIconData(data.type ? data : null);
        setIsLoading(false);
      })
      .catch(() => {
        setIconData(null);
        setIsLoading(false);
      });
  }, [attributes.keyInput, postId]);

  const iconSize = attributes.iconSize || 48;

  const renderIconPreview = () => {
    if (!iconData) return null;

    if (iconData.type === 'dashicon') {
      return (
        <span
          className={`dashicons dashicons-${iconData.value}`}
          style={{ fontSize: iconSize, width: iconSize, height: iconSize }}
        />
      );
    }

    if (iconData.type === 'url' || iconData.type === 'attachment') {
      return (
        <img
          src={iconData.url}
          alt=""
          style={{ width: iconSize, height: iconSize, objectFit: 'contain' }}
        />
      );
    }

    return null;
  };

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title="Icon Settings" initialOpen={true}>
          <TextControl
            label="ACF Field Key"
            value={attributes.keyInput || ''}
            onChange={(value) => setAttributes({ keyInput: value })}
            placeholder="e.g., venue_icon, category_icon"
            help="The ACF icon picker field key"
          />
          <RangeControl
            label="Icon Size (px)"
            value={iconSize}
            onChange={(value) => setAttributes({ iconSize: value })}
            min={16}
            max={256}
            step={4}
          />
        </PanelBody>
      </InspectorControls>
      <span {...blockProps}>
        {isLoading && <Spinner />}
        {!isLoading && iconData && renderIconPreview()}
        {!isLoading && !iconData && (
          <span className="meta-icon-placeholder">
            {attributes.keyInput
              ? `"${attributes.keyInput}`
              : 'Enter an ACF field key in the sidebar'}
          </span>
        )}
      </span>
    </Fragment>
  );
}
