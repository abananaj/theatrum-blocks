import {
  useBlockProps,
  useInnerBlocksProps,
  RichText,
} from '@wordpress/block-editor';
import clsx from 'clsx';

export default function save({ attributes }) {
  const { title, level, iconPosition, showIcon, openByDefault } = attributes;
  const TagName = 'h' + (level || 3);

  const blockProps = useBlockProps.save({
    className: clsx({ 'is-open': openByDefault }),
  });

  // Inner blocks are serialised inside the panel div.
  const innerBlocksProps = useInnerBlocksProps.save({
    className: 'wp-block-chance-production-tab-item__panel',
  });

  return (
    <div {...blockProps}>
      <TagName className="wp-block-chance-production-tab-item__heading">
        <button
          type="button"
          className="wp-block-chance-production-tab-item__toggle"
        >
          {showIcon && iconPosition === 'left' && (
            <span
              className="wp-block-chance-production-tab-item__toggle-icon"
              aria-hidden="true"
            >
              +
            </span>
          )}
          <RichText.Content
            tagName="span"
            className="wp-block-chance-production-tab-item__title"
            value={title}
          />
          {showIcon && iconPosition === 'right' && (
            <span
              className="wp-block-chance-production-tab-item__toggle-icon"
              aria-hidden="true"
            >
              +
            </span>
          )}
        </button>
      </TagName>
      <div {...innerBlocksProps} />
    </div>
  );
}
