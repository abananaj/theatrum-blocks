/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import clsx from 'clsx';

export default function save({ attributes }) {
  const { caption, columns, imageCrop } = attributes;

  const className = clsx('has-nested-images', {
    [`columns-${columns}`]: columns !== undefined,
    'columns-default': columns === undefined,
    'is-cropped': imageCrop,
  });

  const blockProps = useBlockProps.save({ className });

  return (
    <figure {...blockProps}>
      {/* The actual gallery content is rendered server-side by render.php */}
      {!RichText.isEmpty(caption) && (
        <RichText.Content
          tagName="figcaption"
          className="blocks-gallery-caption"
          value={caption}
        />
      )}
    </figure>
  );
}
