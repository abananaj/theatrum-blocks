import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import './editor.scss';

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
			/>
		</div>
	);
}
