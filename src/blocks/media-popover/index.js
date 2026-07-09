/**
 * Registers the Media Popover block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-types/
 */
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import './editor.scss';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

registerBlockType( metadata.name, {
	...metadata,
	edit: Edit,
	save: Save,
} );
