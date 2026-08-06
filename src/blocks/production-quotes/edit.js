import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import './editor.scss';

function EmptyQuotesPlaceholder() {
	return <p>{ __( 'No quotes found', 'theatrum-blocks' ) }</p>;
}

export default function Edit() {
	const blockProps = useBlockProps();

	return (
		<div
			{ ...blockProps }
			onClick={ ( event ) => {
				if ( event.target.closest( 'a' ) ) {
					event.preventDefault();
				}
			} }
		>
			<ServerSideRender
				block="theatrum/production-quotes"
				attributes={ {} }
				EmptyResponsePlaceholder={ EmptyQuotesPlaceholder }
			/>
		</div>
	);
}
