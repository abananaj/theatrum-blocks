/**
 * Thumbnail List Item Block Editor (child of chance/list-thumbnail)
 *
 * Renders a single `.list-item` with editable title/description (inline
 * RichText) and a thumbnail image managed from the Inspector. Pressing Enter
 * splits the item into a new sibling (like core/list-item); backspacing an
 * empty item merges/removes it. Layout (height, spacing, hover transition)
 * comes from the parent's CSS custom properties via style.scss, so this
 * component only needs to render structure — it stays identical between the
 * editor and the frontend.
 */

import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { Fragment } from '@wordpress/element';
import { Button, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

export default function Edit({
	attributes,
	setAttributes,
	onReplace,
	mergeBlocks,
	onRemove,
	clientId,
}) {
	const { title, description, thumbnailId, thumbnailUrl, thumbnailAlt } = attributes;
	const blockProps = useBlockProps({ className: 'list-item' });

	const setThumbnail = (media) => {
		setAttributes({
			thumbnailId: media.id,
			thumbnailUrl: media.url,
			thumbnailAlt: media.alt || '',
		});
	};

	const removeThumbnail = () => {
		setAttributes({ thumbnailId: 0, thumbnailUrl: '', thumbnailAlt: '' });
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Thumbnail Image', 'theatrum-blocks')} initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={setThumbnail}
							allowedTypes={['image']}
							value={thumbnailId}
							render={({ open }) => (
								<Button
									onClick={open}
									variant="primary"
									style={{ marginBottom: '8px', width: '100%', justifyContent: 'center' }}
								>
									{thumbnailUrl
										? __('Replace Image', 'theatrum-blocks')
										: __('Select Image', 'theatrum-blocks')}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					{thumbnailUrl && (
						<Fragment>
							<img
								src={thumbnailUrl}
								alt={thumbnailAlt}
								style={{
									maxWidth: '100%',
									height: 'auto',
									borderRadius: '4px',
									marginBottom: '8px',
								}}
							/>
							<Button
								onClick={removeThumbnail}
								variant="secondary"
								isDestructive
								style={{ width: '100%', justifyContent: 'center' }}
							>
								{__('Remove Image', 'theatrum-blocks')}
							</Button>
						</Fragment>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<RichText
					identifier="title"
					tagName="div"
					className="item-title"
					value={title}
					onChange={(value) => setAttributes({ title: value })}
					placeholder={__('List item', 'theatrum-blocks')}
					onSplit={(value, isOriginal) => {
						// Keep the thumbnail with the original item; a freshly
						// split item starts without one.
						const newAttributes = isOriginal
							? { ...attributes, title: value }
							: { title: value };

						const block = createBlock('chance/list-item-thumbnail', newAttributes);

						if (isOriginal) {
							block.clientId = clientId;
						}

						return block;
					}}
					onReplace={onReplace}
					onMerge={mergeBlocks}
					onRemove={onRemove}
				/>
				<RichText
					identifier="description"
					tagName="div"
					className="item-description"
					value={description}
					onChange={(value) => setAttributes({ description: value })}
					placeholder={__('Add a description (optional)', 'theatrum-blocks')}
				/>
			</div>
		</Fragment>
	);
}
