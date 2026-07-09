/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import getColorStyle from './color-style';

// `role="button"` (not a real <button>) because headings are not valid
// inside a native button's content model. view.js wires up click + keyboard
// (Enter/Space) activation on this element.
export default function save( { attributes } ) {
	const blockProps = useBlockProps.save( {
		className: 'ct-tab__header',
		role: 'button',
		tabIndex: 0,
		style: getColorStyle( attributes ),
	} );
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <div { ...innerBlocksProps } />;
}
