import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	const blockProps = useBlockProps({ className: 'production-quotes-editor' });

	return (
		<div {...blockProps}>
			<div className="production-quotes-placeholder">
				<span className="dashicons dashicons-format-quote" />
				<p>{__('Production Quotes', 'production-quotes')}</p>
				<p className="description">
					{__(
						'Displays quotes from the production_quotes ACF repeater field.',
						'production-quotes'
					)}
				</p>
			</div>
		</div>
	);
}
