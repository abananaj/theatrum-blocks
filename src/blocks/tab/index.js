import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import deprecated from './deprecated';
import metadata from './block.json';

registerBlockType(metadata.name, {
  edit: Edit,
  save: Save,
  deprecated,
});
