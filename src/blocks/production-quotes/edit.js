import ServerSideRender from '@wordpress/server-side-render';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';
import './editor.scss';

export default function Edit({ attributes }) {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<ServerSideRender block={metadata.name} attributes={attributes} />
		</div>
	);
}
