import './style.scss';
import './editor.scss';
import { registerBlockType, createBlock } from '@wordpress/blocks';
import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

const TEMPLATE = [
	[ 'theatrum/blockquote-text', {} ],
	[ 'theatrum/blockquote-source', {} ],
];

const ALLOWED_BLOCKS = [
	'theatrum/blockquote-text',
	'theatrum/blockquote-source',
];

const Edit = ( { attributes, setAttributes, clientId } ) => {
	const { addCitation } = attributes;
	const blockProps = useBlockProps( {
		className: 'theatrum-blockquote-advanced',
	} );

	const { insertBlock, removeBlock } = useDispatch( blockEditorStore );

	const innerBlocks = useSelect(
		( select ) => select( blockEditorStore ).getBlocks( clientId ),
		[ clientId ]
	);

	const onToggleCitation = ( value ) => {
		setAttributes( { addCitation: value } );
		const sourceBlock = innerBlocks.find(
			( b ) => b.name === 'theatrum/blockquote-source'
		);
		if ( value && ! sourceBlock ) {
			insertBlock(
				createBlock( 'theatrum/blockquote-source' ),
				innerBlocks.length,
				clientId,
				false
			);
		} else if ( ! value && sourceBlock ) {
			removeBlock( sourceBlock.clientId );
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Citation', 'theatrum-blocks' ) }>
					<ToggleControl
						label={ __( 'Add citation', 'theatrum-blocks' ) }
						help={ __(
							'Show an attributed source line below the quote.',
							'theatrum-blocks'
						) }
						checked={ addCitation }
						onChange={ onToggleCitation }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlocks
					template={ TEMPLATE }
					allowedBlocks={ ALLOWED_BLOCKS }
					templateLock={ false }
				/>
			</div>
		</>
	);
};

const save = () => {
	const blockProps = useBlockProps.save( {
		className: 'theatrum-blockquote-advanced',
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
};

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
