/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import block from './block.json';

registerBlockType( block.name, {
	...block,
	edit: Edit,
} );
