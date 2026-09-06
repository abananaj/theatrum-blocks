/**
 * Static block: markup ships without ids/ARIA (view.js assigns them at runtime so multiple
 * instances on one page never collide — the theatrum/tabs idiom). Title sits inside a real
 * <button> as a <span>, never a heading — headings aren't valid phrasing content inside <button>.
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { mediaUrl, mediaAlt, title, description } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<div className="wp-block-theatrum-card-expanding__image">
				{ mediaUrl && <img src={ mediaUrl } alt={ mediaAlt } /> }
			</div>
			<div className="wp-block-theatrum-card-expanding__info">
				<button
					type="button"
					className="wp-block-theatrum-card-expanding__trigger"
				>
					<RichText.Content
						tagName="span"
						className="wp-block-theatrum-card-expanding__title line-clamp-1"
						value={ title }
					/>
				</button>
				<RichText.Content
					tagName="p"
					className="wp-block-theatrum-card-expanding__description"
					value={ description }
				/>
			</div>
		</div>
	);
}
