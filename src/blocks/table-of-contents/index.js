/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { tableOfContents as icon } from '@wordpress/icons';
import './style.scss';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
import save from './save';

const settings = {
	icon,
	edit,
	save,
	example: {
		innerBlocks: [
			{
				name: 'core/heading',
				attributes: {
					level: 2,
					content: __( 'Heading', 'theatrum-blocks' ),
				},
			},
			{
				name: 'core/heading',
				attributes: {
					level: 3,
					content: __( 'Subheading', 'theatrum-blocks' ),
				},
			},
			{
				name: 'core/heading',
				attributes: {
					level: 2,
					content: __( 'Heading', 'theatrum-blocks' ),
				},
			},
			{
				name: 'core/heading',
				attributes: {
					level: 3,
					content: __( 'Subheading', 'theatrum-blocks' ),
				},
			},
		],
		attributes: {
			headings: [
				{
					content: __( 'Heading', 'theatrum-blocks' ),
					level: 2,
				},
				{
					content: __( 'Subheading', 'theatrum-blocks' ),
					level: 3,
				},
				{
					content: __( 'Heading', 'theatrum-blocks' ),
					level: 2,
				},
				{
					content: __( 'Subheading', 'theatrum-blocks' ),
					level: 3,
				},
			],
		},
	},
};

registerBlockType( metadata.name, settings );
