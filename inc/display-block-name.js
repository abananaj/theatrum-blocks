/**
 * Dev Mode Display Utility — displays block names in dev mode.
 */

import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Dev mode toggle control for block inspectors.
 *
 * @param {Object}   props           - Component props
 * @param {boolean}  props.isDevMode - Current dev mode state
 * @param {Function} props.onChange  - Callback when toggled
 */
export function DevModeToggle( { isDevMode, onChange } ) {
	return (
		<ToggleControl
			label={ __( 'Dev Mode', 'theatrum-blocks' ) }
			help={ __(
				'Show block name and class names in the top-left corner of the block for development.', 'theatrum-blocks'
			) }
			checked={ isDevMode }
			onChange={ onChange }
		/>
	);
}

/**
 * Applies dev mode styling to a block element: a visual indicator showing the block name and first class name.
 *
 * @param {HTMLElement} element   - The DOM element to apply dev mode to
 * @param {string}      blockName - The block name (e.g., 'theatrum/breadcrumbs')
 */
export function applyDevMode( element, blockName ) {
	if ( ! element ) {
		return;
	}

	// Get the first class name from the element
	const classList = element.className.split( ' ' );
	const firstClass =
		classList.find( ( cls ) => cls.length > 0 ) || 'no-class';

	// Create dev indicator
	const indicator = document.createElement( 'div' );
	indicator.style.cssText = `
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 11px;
		padding: 2px 4px;
		z-index: 9999;
		font-family: monospace;
		white-space: nowrap;
		pointer-events: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.3);
		border-right: 1px solid rgba(255, 255, 255, 0.3);
		max-width: 300px;
		overflow: hidden;
		text-overflow: ellipsis;
	`;

	indicator.textContent = `${ blockName } • ${ firstClass }`;

	// Make element position relative so indicator is positioned relative to it
	const position = window.getComputedStyle( element ).position;
	if ( position === 'static' || ! position ) {
		element.style.position = 'relative';
	}

	element.appendChild( indicator );
}

/**
 * Remove dev mode styling from a block element.
 *
 * @param {HTMLElement} element - The DOM element to remove dev mode from
 */
export function removeDevMode( element ) {
	if ( ! element ) {
		return;
	}

	const indicators = element.querySelectorAll(
		'div[style*="position: absolute"][style*="top: 0"][style*="left: 0"]'
	);
	indicators.forEach( ( indicator ) => {
		if ( indicator.textContent.includes( '•' ) ) {
			indicator.remove();
		}
	} );
}

/**
 * Hook to apply dev mode display to a block element.
 *
 * @param {Object}      props           - Hook props
 * @param {HTMLElement} props.element   - DOM ref to the block container
 * @param {boolean}     props.isDevMode - Whether dev mode is enabled
 * @param {string}      props.blockName - Block name to display
 */
export function useDevMode( { element, isDevMode, blockName } ) {
	const elementRef = useRef( element );

	useEffect( () => {
		if ( ! elementRef.current ) {
			return;
		}

		if ( isDevMode ) {
			applyDevMode( elementRef.current, blockName );
		} else {
			removeDevMode( elementRef.current );
		}

		return () => {
			removeDevMode( elementRef.current );
		};
	}, [ isDevMode, blockName ] );

	return elementRef;
}
