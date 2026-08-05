import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import './editor.scss';

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
			/>
		</div>
	);
}
