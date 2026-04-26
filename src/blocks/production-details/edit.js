import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<p style={{ color: '#666', fontStyle: 'italic' }}>Production Details – Server rendered</p>
		</div>
	);
}
