import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import './editor.scss';

function EmptyPerformancesPlaceholder() {
	return <p>{ __( 'No performances found', 'theatrum-blocks' ) }</p>;
}

export default function Edit( { attributes } ) {
	const blockProps = useBlockProps( {
		className: 'performances-list-editor',
	} );

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
				block="theatrum/performances-list"
				attributes={ attributes }
				EmptyResponsePlaceholder={ EmptyPerformancesPlaceholder }
			/>
		</div>
	);
}
