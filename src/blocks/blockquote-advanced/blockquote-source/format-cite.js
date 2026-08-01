import { registerFormatType, toggleFormat } from '@wordpress/rich-text';
import {
	RichTextToolbarButton,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const FORMAT_NAME = 'theatrum/cite-title';

const CiteEdit = ( { isActive, value, onChange } ) => {
	const isBlockquoteSource = useSelect( ( select ) => {
		const { getSelectedBlockClientId, getBlockName } =
			select( blockEditorStore );
		const clientId = getSelectedBlockClientId();
		return (
			!! clientId &&
			getBlockName( clientId ) === 'theatrum/blockquote-source'
		);
	}, [] );

	if ( ! isBlockquoteSource ) {
		return null;
	}

	return (
		<RichTextToolbarButton
			icon="book"
			title={ __( 'Cite work title', 'theatrum-blocks' ) }
			onClick={ () =>
				onChange( toggleFormat( value, { type: FORMAT_NAME } ) )
			}
			isActive={ isActive }
		/>
	);
};

registerFormatType( FORMAT_NAME, {
	title: __( 'Cite work title', 'theatrum-blocks' ),
	tagName: 'cite',
	className: 'theatrum-blockquote-cite',
	edit: CiteEdit,
} );
