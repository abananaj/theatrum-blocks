/**
 * Registers the Icon List Item block (child of theatrum/list-icons)
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Import styles
 */
import './style.scss';
import './editor.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import deprecated from './deprecated';

/**
 * Register the block
 */
registerBlockType( metadata.name, {
	...metadata,
	edit: Edit,
	save: Save,
	deprecated,
} );
