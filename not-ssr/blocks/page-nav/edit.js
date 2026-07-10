import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { navLabel, contentSelector } = attributes;

	const blockProps = useBlockProps( {
		className: 'theatrum-page-nav theatrum-page-nav--editor',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Page Nav Settings', 'theatrum-blocks' ) }
				>
					<TextControl
						label={ __( 'Navigation label', 'theatrum-blocks' ) }
						help={ __(
							'Accessible label for the navigation landmark.',
							'theatrum-blocks'
						) }
						value={ navLabel }
						onChange={ ( value ) =>
							setAttributes( { navLabel: value } )
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label={ __( 'Content selector', 'theatrum-blocks' ) }
						help={ __(
							'CSS selector for the region scanned for <section id> elements. Defaults to "main".',
							'theatrum-blocks'
						) }
						value={ contentSelector }
						onChange={ ( value ) =>
							setAttributes( { contentSelector: value } )
						}
						placeholder="main"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>
			<nav { ...blockProps } aria-label={ navLabel }>
				<span className="theatrum-page-nav__placeholder">
					{ __(
						'Page Nav — links to on-page sections appear here on the front end. Add a Group with HTML element “<section>” and an HTML Anchor to generate a link.',
						'theatrum-blocks'
					) }
				</span>
			</nav>
		</>
	);
}
