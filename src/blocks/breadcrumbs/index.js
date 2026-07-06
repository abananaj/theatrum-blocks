/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { chevronRight as icon } from '@wordpress/icons';

/**
 * Lets webpack bundle the block's styles. Files containing the `style` keyword
 * are emitted to `style-index.css` and applied on both the editor and front end.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Edit from './edit';

registerBlockType( metadata.name, {
	icon,
	edit: Edit,
	// Dynamic block: markup is produced server-side by render.php.
	save: () => null,
} );
