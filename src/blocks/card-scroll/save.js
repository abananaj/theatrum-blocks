import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { mediaUrl, mediaAlt, title, description } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<div className="wp-block-theatrum-card-scroll__image">
				{ mediaUrl && <img src={ mediaUrl } alt={ mediaAlt } /> }
			</div>
			<div className="wp-block-theatrum-card-scroll__info">
				<RichText.Content
					tagName="h3"
					className="wp-block-theatrum-card-scroll__title max-line-two"
					value={ title }
				/>
				<RichText.Content
					tagName="p"
					className="wp-block-theatrum-card-scroll__description"
					value={ description }
				/>
			</div>
		</div>
	);
}
