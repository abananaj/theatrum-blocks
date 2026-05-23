<?php
// This file is generated. Do not modify it manually.
return array(
	'board-member' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/board-member',
		'title' => 'Board Member',
		'category' => 'deprecated',
		'description' => 'Display board member information from WordPress options',
		'textdomain' => 'board-member',
		'icon' => 'admin-settings',
		'supports' => array(
			'html' => false,
			'align' => true,
			'reusable' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'attributes' => array(
			'optionName' => array(
				'type' => 'string',
				'default' => ''
			),
			'tagName' => array(
				'type' => 'string',
				'default' => 'p'
			),
			'href' => array(
				'type' => 'string',
				'default' => ''
			),
			'prepend' => array(
				'type' => 'string',
				'default' => ''
			),
			'append' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'card-carousel' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/card-carousel',
		'title' => 'Card Carousel',
		'category' => 'theatrum',
		'icon' => 'images-alt2',
		'description' => 'A responsive carousel display for cards with images, titles, and subtitles',
		'textdomain' => 'card-carousel',
		'supports' => array(
			'html' => false,
			'align' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'attributes' => array(
			'headline' => array(
				'type' => 'string',
				'default' => 'Headline'
			),
			'items' => array(
				'type' => 'array',
				'default' => array(
					array(
						'id' => 1,
						'image' => 'https://picsum.photos/id/21/300/300',
						'title' => 'Card Title',
						'subtitle' => 'Subtitle text',
						'link' => '#'
					)
				)
			)
		),
		'usesInnerBlocks' => false,
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'copyright-date-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'create-block/copyright-date-block',
		'version' => '0.1.0',
		'title' => 'Copyright Date Block',
		'category' => 'theatrum',
		'icon' => 'admin-settings',
		'description' => 'Example block scaffolded with Create Block tool.',
		'example' => array(
			
		),
		'attributes' => array(
			'fallbackCurrentYear' => array(
				'type' => 'string'
			),
			'showStartingYear' => array(
				'type' => 'boolean'
			),
			'startingYear' => array(
				'type' => 'string'
			)
		),
		'supports' => array(
			'color' => array(
				'background' => true,
				'text' => true
			),
			'html' => false,
			'typography' => array(
				'fontSize' => true,
				'textAlign' => true,
				'lineHeight' => true
			)
		),
		'textdomain' => 'copyright-date-block',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'cover-card' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/cover-card',
		'title' => 'Cover Card',
		'category' => 'theatrum',
		'description' => 'Display a featured production or event as a card with featured image background and overlaid title',
		'icon' => 'cover-image',
		'supports' => array(
			'customCSS' => true,
			'ariaLabel' => true,
			'alignWide' => true,
			'allowedBlocks' => true,
			'background' => array(
				'backgroundImage' => true,
				'backgroundSize' => true,
				'gradient' => true
			),
			'contentRole' => true,
			'dimensions' => array(
				'aspectRatio' => true,
				'minHeight' => true,
				'height' => true,
				'minWidth' => true,
				'width' => true
			),
			'filter' => array(
				'duotone' => true
			),
			'inserter' => true,
			'interactivity' => true,
			'layout' => true,
			'listView' => true,
			'lock' => true,
			'multiple' => true,
			'position' => array(
				'sticky' => true
			),
			'renaming' => true,
			'splitting' => true,
			'visibility' => true,
			'html' => true,
			'align' => true,
			'reusable' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'typography' => array(
				'fitText' => true,
				'textAlign' => true,
				'textIndent' => true,
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true,
				'button' => true,
				'enableContrastChecker' => true,
				'gradients' => true,
				'heading' => true,
				'link' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			'metaKey' => array(
				'type' => 'string',
				'default' => ''
			),
			'postId' => array(
				'type' => 'number',
				'default' => 0
			),
			'buttonText' => array(
				'type' => 'string',
				'default' => ''
			),
			'buttonUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'button2Text' => array(
				'type' => 'string',
				'default' => ''
			),
			'button2Url' => array(
				'type' => 'string',
				'default' => ''
			),
			'button3Text' => array(
				'type' => 'string',
				'default' => ''
			),
			'button3Url' => array(
				'type' => 'string',
				'default' => ''
			),
			'openInNewWindow' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'styles' => array(
			
		),
		'textdomain' => 'cover-card',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'cover-carousel' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/cover-carousel',
		'title' => 'Cover Carousel',
		'category' => 'theatrum',
		'icon' => 'images-alt2',
		'description' => 'A carousel block for displaying multiple images or videos with overlay content, similar to the Cover block but with carousel functionality',
		'textdomain' => 'cover-carousel',
		'supports' => array(
			'html' => false,
			'align' => array(
				'full',
				'wide'
			),
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'color' => array(
				'text' => true,
				'background' => true
			)
		),
		'attributes' => array(
			'items' => array(
				'type' => 'array',
				'default' => array(
					array(
						'id' => 1,
						'url' => '',
						'type' => 'image',
						'dimRatio' => 50,
						'overlayColor' => '',
						'customOverlayColor' => '#000000',
						'focalPoint' => array(
							'x' => 0.5,
							'y' => 0.5
						)
					)
				)
			),
			'currentSlide' => array(
				'type' => 'number',
				'default' => 0
			),
			'minHeight' => array(
				'type' => 'number',
				'default' => 300
			),
			'minHeightUnit' => array(
				'type' => 'string',
				'default' => 'px'
			),
			'contentPosition' => array(
				'type' => 'string',
				'enum' => array(
					'center',
					'top-center',
					'top-left',
					'top-right',
					'bottom-center',
					'bottom-left',
					'bottom-right'
				),
				'default' => 'center'
			),
			'showIndicators' => array(
				'type' => 'boolean',
				'default' => true
			),
			'indicatorStyle' => array(
				'type' => 'string',
				'enum' => array(
					'dots',
					'lines',
					'numbers'
				),
				'default' => 'dots'
			),
			'showArrows' => array(
				'type' => 'boolean',
				'default' => true
			),
			'arrowStyle' => array(
				'type' => 'string',
				'enum' => array(
					'light',
					'dark'
				),
				'default' => 'light'
			),
			'autoplay' => array(
				'type' => 'boolean',
				'default' => false
			),
			'autoplaySpeed' => array(
				'type' => 'number',
				'default' => 5000
			),
			'transitionType' => array(
				'type' => 'string',
				'enum' => array(
					'fade',
					'slide'
				),
				'default' => 'fade'
			),
			'transitionSpeed' => array(
				'type' => 'number',
				'default' => 500
			)
		),
		'usesInnerBlocks' => true,
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./editor.scss',
		'style' => 'file:./style.scss',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'icon-list' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/icon-list',
		'title' => 'Icon List',
		'category' => 'theatrum',
		'description' => 'A list block with optional icons for each item. Supports ordered and unordered lists with customizable icon styling.',
		'icon' => 'list-view',
		'keywords' => array(
			'list',
			'icon',
			'item'
		),
		'supports' => array(
			'html' => false,
			'align' => true,
			'reusable' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true
		),
		'attributes' => array(
			'listType' => array(
				'type' => 'string',
				'default' => 'ul',
				'enum' => array(
					'ul',
					'ol'
				)
			),
			'items' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'id' => array(
							'type' => 'string',
							'description' => 'Unique identifier for the list item'
						),
						'text' => array(
							'type' => 'string',
							'description' => 'Text content of the list item'
						),
						'iconId' => array(
							'type' => 'number',
							'description' => 'Media library attachment ID'
						),
						'iconUrl' => array(
							'type' => 'string',
							'description' => 'URL of the icon image'
						),
						'iconAlt' => array(
							'type' => 'string',
							'description' => 'Alt text for the icon'
						)
					)
				)
			),
			'iconSize' => array(
				'type' => 'string',
				'default' => '24'
			),
			'iconSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
				'enum' => array(
					'px',
					'em',
					'rem',
					'%'
				)
			),
			'iconPosition' => array(
				'type' => 'string',
				'default' => 'left',
				'enum' => array(
					'left',
					'top',
					'right',
					'bottom'
				)
			),
			'iconSpacing' => array(
				'type' => 'string',
				'default' => '8'
			),
			'iconColor' => array(
				'type' => 'string',
				'default' => ''
			),
			'hoverOnly' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'media-popover' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/media-popover',
		'title' => 'Media Popover',
		'category' => 'theatrum',
		'description' => 'Display media (image or video) in a tooltip-style popover that appears on hover. Link the popover to a URL or page.',
		'icon' => 'image',
		'keywords' => array(
			'media',
			'popover',
			'tooltip',
			'hover',
			'image',
			'video'
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'left',
				'center',
				'right'
			),
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true
			)
		),
		'attributes' => array(
			'mediaId' => array(
				'type' => 'number',
				'default' => 0
			),
			'mediaUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'mediaAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'mediaType' => array(
				'type' => 'string',
				'default' => 'image'
			),
			'linkType' => array(
				'type' => 'string',
				'default' => 'none',
				'enum' => array(
					'none',
					'url',
					'page'
				)
			),
			'linkUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'linkPageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'linkTarget' => array(
				'type' => 'boolean',
				'default' => false
			),
			'width' => array(
				'type' => 'string',
				'default' => '300'
			),
			'widthUnit' => array(
				'type' => 'string',
				'default' => 'px'
			),
			'alignment' => array(
				'type' => 'string',
				'default' => 'center'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'meta-button' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-button',
		'title' => 'Meta Button',
		'category' => 'metablock',
		'icon' => 'button',
		'description' => 'Display a button/link from a URL meta field',
		'supports' => array(
			'html' => false,
			'align' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontWeight' => true,
				'fontStyle' => true,
				'lineHeight' => true,
				'letterSpacing' => true,
				'textDecoration' => true,
				'textTransform' => true,
				'textColumns' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			'keyInput' => array(
				'type' => 'string',
				'default' => ''
			),
			'buttonText' => array(
				'type' => 'string',
				'default' => 'Learn More'
			)
		),
		'textdomain' => 'meta-button',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'meta-date' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-date',
		'title' => 'Meta Date',
		'icon' => 'calendar-alt',
		'category' => 'metablock',
		'description' => 'Display date meta fields with configurable formatting',
		'supports' => array(
			'html' => false,
			'align' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontWeight' => true,
				'fontStyle' => true,
				'lineHeight' => true,
				'letterSpacing' => true,
				'textDecoration' => true,
				'textTransform' => true,
				'textColumns' => false
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			'keyInput' => array(
				'type' => 'string',
				'default' => ''
			),
			'dateFormat' => array(
				'type' => 'string',
				'default' => 'Y-m-d'
			),
			'customFormat' => array(
				'type' => 'string',
				'default' => ''
			),
			'tagName' => array(
				'type' => 'string',
				'default' => 'p'
			),
			'prepend' => array(
				'type' => 'string',
				'default' => ''
			),
			'append' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'textdomain' => 'meta-date',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'meta-embed' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-embed',
		'title' => 'Meta Embed',
		'category' => 'metablock',
		'description' => 'Embed a resource from a URL stored in post metadata',
		'icon' => 'embed-generic',
		'supports' => array(
			'html' => false,
			'align' => array(
				'left',
				'center',
				'right',
				'wide',
				'full'
			),
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			'keyInput' => array(
				'type' => 'string',
				'default' => ''
			),
			'embedType' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'textdomain' => 'meta-embed',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'meta-field' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-field',
		'title' => 'Meta Field',
		'category' => 'metablock',
		'description' => 'Display a value from post metadata by entering a key',
		'icon' => 'admin-generic',
		'supports' => array(
			'html' => false,
			'align' => true,
			'reusable' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'attributes' => array(
			'keyInput' => array(
				'type' => 'string',
				'default' => ''
			),
			'tagName' => array(
				'type' => 'string',
				'default' => 'span'
			),
			'href' => array(
				'type' => 'string',
				'default' => ''
			),
			'prepend' => array(
				'type' => 'string',
				'default' => ''
			),
			'append' => array(
				'type' => 'string',
				'default' => ''
			),
			'hideIfEmpty' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'textdomain' => 'meta-date',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'meta-file' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-file',
		'title' => 'Meta File Link',
		'category' => 'metablock',
		'description' => 'Display a link to a file from a post meta or ACF file field by entering a key',
		'icon' => 'media-document',
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'color' => array(
				'link' => true,
				'text' => true,
				'background' => false
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			'keyInput' => array(
				'type' => 'string',
				'default' => ''
			),
			'linkText' => array(
				'type' => 'string',
				'default' => 'Download File'
			),
			'fallbackText' => array(
				'type' => 'string',
				'default' => ''
			),
			'openInNewTab' => array(
				'type' => 'boolean',
				'default' => true
			),
			'showIcon' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'textdomain' => 'meta-file',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'meta-gallery' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-gallery',
		'title' => 'Meta Gallery',
		'category' => 'metablock',
		'description' => 'Display a gallery of images from a post meta or ACF gallery field with core gallery styling and features',
		'icon' => 'format-gallery',
		'supports' => array(
			'html' => false,
			'align' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'color' => array(
				'gradients' => true,
				'link' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => array(
					'horizontal',
					'vertical'
				),
				'__experimentalDefaultControls' => array(
					'blockGap' => true,
					'margin' => false,
					'padding' => false
				)
			),
			'__experimentalBorder' => array(
				'radius' => true,
				'color' => true,
				'width' => true,
				'style' => true
			),
			'units' => array(
				'px',
				'em',
				'rem',
				'vh',
				'vw'
			),
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'providesContext' => array(
			'imageCrop' => 'imageCrop',
			'fixedHeight' => 'fixedHeight',
			'navigationButtonType' => 'navigationButtonType'
		),
		'attributes' => array(
			'metaKey' => array(
				'type' => 'string',
				'default' => ''
			),
			'sizeSlug' => array(
				'type' => 'string',
				'default' => 'large'
			),
			'columns' => array(
				'type' => 'number',
				'minimum' => 1,
				'maximum' => 8
			),
			'linkTo' => array(
				'type' => 'string',
				'default' => 'none'
			),
			'imageCrop' => array(
				'type' => 'boolean',
				'default' => true
			),
			'fixedHeight' => array(
				'type' => 'boolean',
				'default' => true
			),
			'randomOrder' => array(
				'type' => 'boolean',
				'default' => false
			),
			'caption' => array(
				'type' => 'rich-text',
				'source' => 'rich-text',
				'selector' => '.blocks-gallery-caption',
				'role' => 'content'
			),
			'navigationButtonType' => array(
				'type' => 'string',
				'default' => 'icon',
				'enum' => array(
					'icon',
					'text',
					'both'
				)
			),
			'allowResize' => array(
				'type' => 'boolean',
				'default' => false
			),
			'aspectRatio' => array(
				'type' => 'string',
				'default' => 'auto'
			),
			'linkTarget' => array(
				'type' => 'string'
			),
			'fallbackText' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'textdomain' => 'meta-gallery',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'meta-icon' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-icon',
		'title' => 'Meta Icon',
		'category' => 'metablock',
		'description' => 'Display an icon from an ACF icon picker field by entering a key. Handles dashicon names, URLs, and attachment IDs.',
		'icon' => 'star-filled',
		'supports' => array(
			'html' => false,
			'align' => array(
				'left',
				'center',
				'right'
			),
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => false
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			'keyInput' => array(
				'type' => 'string',
				'default' => ''
			),
			'iconSize' => array(
				'type' => 'number',
				'default' => 48
			)
		),
		'textdomain' => 'meta-icon',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'meta-image' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-image',
		'title' => 'Meta Image',
		'category' => 'metablock',
		'description' => 'Display an image from a post meta or ACF image field by entering a key',
		'icon' => 'format-image',
		'supports' => array(
			'html' => false,
			'align' => array(
				'left',
				'center',
				'right',
				'wide',
				'full'
			),
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'color' => array(
				'duotone' => true
			),
			'filter' => array(
				'duotone' => true
			),
			'shadow' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			'keyInput' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageSize' => array(
				'type' => 'string',
				'default' => 'full'
			),
			'linkTo' => array(
				'type' => 'string',
				'default' => 'none'
			),
			'customLink' => array(
				'type' => 'string',
				'default' => ''
			),
			'openInNewTab' => array(
				'type' => 'boolean',
				'default' => false
			),
			'showCaption' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'textdomain' => 'meta-image',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'meta-related' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-related',
		'title' => 'Meta Related',
		'category' => 'metablock',
		'description' => 'Display a related post\'s title by entering a meta key that contains a post ID or Post Object',
		'textdomain' => 'meta-related',
		'icon' => 'admin-links',
		'supports' => array(
			'html' => false,
			'align' => true,
			'reusable' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			'keyInput' => array(
				'type' => 'string',
				'default' => ''
			),
			'tagName' => array(
				'type' => 'string',
				'default' => 'p'
			),
			'linkToPost' => array(
				'type' => 'boolean',
				'default' => false
			),
			'prepend' => array(
				'type' => 'string',
				'default' => ''
			),
			'append' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'meta-repeater' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-repeater',
		'title' => 'Meta Repeater',
		'category' => 'metablock',
		'icon' => 'update',
		'description' => 'Display ACF repeater field rows with configurable subfield display',
		'supports' => array(
			'html' => false,
			'align' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontWeight' => true,
				'fontStyle' => true,
				'lineHeight' => true,
				'letterSpacing' => true,
				'textDecoration' => true,
				'textTransform' => true,
				'textColumns' => false
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			'overridePostId' => array(
				'type' => 'integer',
				'default' => 0
			),
			'repeaterKey' => array(
				'type' => 'string',
				'default' => ''
			),
			'subfields' => array(
				'type' => 'string',
				'default' => ''
			),
			'tagName' => array(
				'type' => 'string',
				'default' => 'ul'
			),
			'subfieldA' => array(
				'type' => 'string',
				'default' => ''
			),
			'subfieldB' => array(
				'type' => 'string',
				'default' => ''
			),
			'tagA' => array(
				'type' => 'string',
				'default' => 'span'
			),
			'tagB' => array(
				'type' => 'string',
				'default' => 'span'
			),
			'headingText' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			)
		),
		'variations' => array(
			array(
				'name' => 'chance/meta-repeater-bylines',
				'title' => 'Bylines Repeater',
				'attributes' => array(
					'tagName' => 'ul'
				)
			),
			array(
				'name' => 'chance/meta-repeater-awards',
				'title' => 'Awards Repeater',
				'icon' => 'awards',
				'attributes' => array(
					'tagName' => 'ul',
					'subfields' => 'subfieldA|subfieldB'
				)
			),
			array(
				'name' => 'chance/meta-repeater-notes',
				'title' => 'Notes Repeater',
				'attributes' => array(
					'tagName' => 'ul',
					'subfields' => 'icon|note'
				)
			),
			array(
				'name' => 'chance/meta-repeater-producers',
				'title' => 'Producers Repeater',
				'attributes' => array(
					'tagName' => 'ul',
					'subfields' => 'title|company'
				)
			),
			array(
				'name' => 'chance/meta-repeater-performances',
				'title' => 'Performances Repeater',
				'attributes' => array(
					'tagName' => 'ul',
					'subfields' => array(
						'date' => 'date',
						'time' => 'time'
					)
				)
			),
			array(
				'name' => 'chance/meta-repeater-events',
				'title' => 'Events Repeater',
				'attributes' => array(
					'tagName' => 'ul'
				)
			),
			array(
				'name' => 'chance/meta-repeater-quotes',
				'title' => 'Quotes Repeater',
				'attributes' => array(
					'tagName' => 'ul',
					'subfields' => 'quote|source'
				)
			)
		),
		'textdomain' => 'meta-repeater',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'meta-time' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-time',
		'title' => 'Meta Time',
		'category' => 'metablock',
		'icon' => 'clock',
		'description' => 'Display time meta fields with configurable formatting',
		'supports' => array(
			'html' => false,
			'align' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontWeight' => true,
				'fontStyle' => true,
				'lineHeight' => true,
				'letterSpacing' => true,
				'textDecoration' => true,
				'textTransform' => true,
				'textColumns' => false
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			'keyInput' => array(
				'type' => 'string',
				'default' => ''
			),
			'timeFormat' => array(
				'type' => 'string',
				'default' => 'h:i A'
			),
			'customFormat' => array(
				'type' => 'string',
				'default' => ''
			),
			'tagName' => array(
				'type' => 'string',
				'default' => 'p'
			),
			'prepend' => array(
				'type' => 'string',
				'default' => ''
			),
			'append' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'textdomain' => 'meta-time',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'popup' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/popup',
		'title' => 'Popup',
		'category' => 'theatrum',
		'icon' => 'visibility',
		'description' => 'A simple popup block with a button to reveal hidden content',
		'supports' => array(
			'html' => false,
			'align' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'attributes' => array(
			'buttonText' => array(
				'type' => 'string',
				'default' => 'Open Dialog'
			),
			'popupTitle' => array(
				'type' => 'string',
				'default' => ''
			),
			'isOpen' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'usesInnerBlocks' => true,
		'textdomain' => 'popup',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'production-details' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/production-details',
		'title' => 'Production Details',
		'category' => 'production',
		'icon' => 'info',
		'supports' => array(
			'html' => false,
			'align' => true,
			'reusable' => false,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'attributes' => array(
			
		),
		'textdomain' => 'production-details',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'production-performances' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/performances-list',
		'title' => 'Production Performances',
		'category' => 'production',
		'description' => 'Display the next 5 upcoming performances from the ACF performances repeater field.',
		'icon' => 'calendar-alt',
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'color' => array(
				'text' => true,
				'background' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			
		),
		'textdomain' => 'performances-list',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'production-quotes' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/production-quotes',
		'title' => 'Production Quotes',
		'category' => 'production',
		'description' => 'Display quotes from the production_quotes ACF repeater field',
		'icon' => 'format-quote',
		'supports' => array(
			'html' => false,
			'align' => true,
			'reusable' => false,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'attributes' => array(
			
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'textdomain' => 'production-quotes',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'production-tab-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/production-tab-item',
		'title' => 'Tab Item',
		'category' => 'theatrum',
		'icon' => 'list-view',
		'description' => 'A single tab with a label and content panel.',
		'parent' => array(
			'chance/production-tabs'
		),
		'supports' => array(
			'html' => false,
			'color' => array(
				'background' => true,
				'gradients' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'spacing' => array(
				'margin' => array(
					'top',
					'bottom'
				),
				'padding' => true,
				'blockGap' => true
			),
			'shadow' => true,
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true,
				'fontFamily' => true,
				'fontWeight' => true,
				'fontStyle' => true,
				'textTransform' => true,
				'textDecoration' => true,
				'letterSpacing' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			)
		),
		'attributes' => array(
			'title' => array(
				'type' => 'rich-text',
				'source' => 'rich-text',
				'selector' => '.wp-block-chance-production-tab-item__title'
			),
			'level' => array(
				'type' => 'number',
				'default' => 3
			),
			'iconPosition' => array(
				'type' => 'string',
				'default' => 'right'
			),
			'showIcon' => array(
				'type' => 'boolean',
				'default' => true
			),
			'openByDefault' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'usesContext' => array(
			'chance/tabs-icon-position',
			'chance/tabs-show-icon',
			'chance/tabs-heading-level'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'production-tabs' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/production-tabs',
		'title' => 'Tabs',
		'category' => 'theatrum',
		'icon' => 'table-col-before',
		'description' => 'Displays content in a tabbed layout on desktop, switching to an accordion on mobile.',
		'example' => array(
			
		),
		'supports' => array(
			'anchor' => true,
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'color' => array(
				'background' => true,
				'gradients' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'spacing' => array(
				'padding' => true,
				'margin' => array(
					'top',
					'bottom'
				),
				'blockGap' => true
			),
			'shadow' => true,
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true,
				'fontFamily' => true,
				'fontWeight' => true,
				'fontStyle' => true,
				'textTransform' => true,
				'textDecoration' => true,
				'letterSpacing' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			)
		),
		'attributes' => array(
			'iconPosition' => array(
				'type' => 'string',
				'default' => 'right'
			),
			'showIcon' => array(
				'type' => 'boolean',
				'default' => true
			),
			'autoclose' => array(
				'type' => 'boolean',
				'default' => false
			),
			'headingLevel' => array(
				'type' => 'number',
				'default' => 3
			),
			'initialTab' => array(
				'type' => 'number',
				'default' => 0
			),
			'mobileBreakpoint' => array(
				'type' => 'number',
				'default' => 768
			)
		),
		'providesContext' => array(
			'chance/tabs-icon-position' => 'iconPosition',
			'chance/tabs-show-icon' => 'showIcon',
			'chance/tabs-heading-level' => 'headingLevel'
		),
		'allowedBlocks' => array(
			'chance/production-tab-item'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'production-trailer' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/video-trailer',
		'title' => 'Production Trailer',
		'category' => 'production',
		'description' => 'Embed a YouTube video trailer from a URL stored in post metadata',
		'icon' => 'video-alt3',
		'keywords' => array(
			'youtube',
			'video',
			'trailer',
			'embed',
			'meta'
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'left',
				'center',
				'right',
				'wide',
				'full'
			),
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			'metaKey' => array(
				'type' => 'string',
				'default' => 'video-trailer-url'
			),
			'allowResponsive' => array(
				'type' => 'boolean',
				'default' => true
			),
			'aspectRatio' => array(
				'type' => 'string',
				'default' => '16-9'
			),
			'caption' => array(
				'type' => 'string',
				'default' => ''
			),
			'type' => array(
				'type' => 'string',
				'default' => 'video'
			),
			'providerNameSlug' => array(
				'type' => 'string',
				'default' => 'youtube'
			),
			'responsive' => array(
				'type' => 'boolean',
				'default' => true
			),
			'previewable' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'textdomain' => 'video-trailer',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'query-filter' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/query-filter',
		'title' => 'Query Filter',
		'category' => 'theatrum',
		'description' => 'Frontend filter and sort controls for a Query Loop block.',
		'icon' => 'filter',
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'interactivity' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true
			)
		),
		'attributes' => array(
			'filterType' => array(
				'type' => 'string',
				'default' => 'taxonomy',
				'enum' => array(
					'taxonomy',
					'orderby'
				)
			),
			'taxonomy' => array(
				'type' => 'string',
				'default' => 'season'
			),
			'paramName' => array(
				'type' => 'string',
				'default' => 'season'
			),
			'label' => array(
				'type' => 'string',
				'default' => 'Season'
			),
			'showLabel' => array(
				'type' => 'boolean',
				'default' => true
			),
			'allLabel' => array(
				'type' => 'string',
				'default' => 'All'
			),
			'layout' => array(
				'type' => 'string',
				'default' => 'horizontal',
				'enum' => array(
					'horizontal',
					'vertical'
				)
			)
		),
		'render' => 'file:./render.php',
		'viewScriptModule' => 'file:./view.js',
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style.scss',
		'editorStyle' => 'file:./editor.scss'
	),
	'season-producer' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/season-producer',
		'title' => 'Season Producer',
		'category' => 'metablock',
		'description' => 'Display season producer titles from the current post\'s season taxonomy term.',
		'icon' => 'awards',
		'supports' => array(
			'html' => false,
			'align' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true
		),
		'attributes' => array(
			'metaKey' => array(
				'type' => 'string',
				'default' => 'season_producers'
			),
			'tagName' => array(
				'type' => 'string',
				'default' => 'ul'
			),
			'headingText' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			)
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'site-option' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/site-option',
		'title' => 'Site Option',
		'category' => 'metablock',
		'description' => 'Display values from WordPress options table, including staff/board members',
		'icon' => 'admin-settings',
		'supports' => array(
			'html' => false,
			'align' => true,
			'reusable' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'attributes' => array(
			'memberType' => array(
				'type' => 'string',
				'default' => '',
				'enum' => array(
					'',
					'staff',
					'board'
				)
			),
			'optionName' => array(
				'type' => 'string',
				'default' => ''
			),
			'tagName' => array(
				'type' => 'string',
				'default' => 'p'
			),
			'href' => array(
				'type' => 'string',
				'default' => ''
			),
			'prepend' => array(
				'type' => 'string',
				'default' => ''
			),
			'append' => array(
				'type' => 'string',
				'default' => ''
			),
			'metaKey' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'textdomain' => 'site-option',
		'variations' => array(
			array(
				'name' => 'staff',
				'title' => 'Staff Member',
				'description' => 'Display staff member information from WordPress options',
				'icon' => 'admin-users',
				'attributes' => array(
					'memberType' => 'staff'
				),
				'isActive' => array(
					'memberType'
				)
			),
			array(
				'name' => 'board',
				'title' => 'Board Member',
				'description' => 'Display board member information from WordPress options',
				'icon' => 'groups',
				'attributes' => array(
					'memberType' => 'board'
				),
				'isActive' => array(
					'memberType'
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'staff-member' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/staff-member',
		'title' => 'Staff Member',
		'category' => 'deprecated',
		'description' => 'Display staff member information from WordPress options',
		'icon' => 'admin-settings',
		'supports' => array(
			'html' => false,
			'align' => true,
			'reusable' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'attributes' => array(
			'optionName' => array(
				'type' => 'string',
				'default' => ''
			),
			'tagName' => array(
				'type' => 'string',
				'default' => 'p'
			),
			'href' => array(
				'type' => 'string',
				'default' => ''
			),
			'prepend' => array(
				'type' => 'string',
				'default' => ''
			),
			'append' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'textdomain' => 'staff-member',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'svg-icon' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/svg-icon',
		'title' => 'SVG Icon',
		'category' => 'theatrum',
		'description' => 'Display SVG files from the media library with custom styling and alignment options',
		'icon' => 'image',
		'keywords' => array(
			'svg',
			'icon',
			'image'
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'left',
				'center',
				'right',
				'wide',
				'full'
			),
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true
			)
		),
		'attributes' => array(
			'svgId' => array(
				'type' => 'number',
				'default' => 0
			),
			'svgUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'svgAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'width' => array(
				'type' => 'string',
				'default' => '100'
			),
			'widthUnit' => array(
				'type' => 'string',
				'default' => 'px'
			),
			'alignment' => array(
				'type' => 'string',
				'default' => 'center'
			),
			'customCSS' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'textdomain' => 'svg-icon',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'term-meta' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/term-meta',
		'title' => 'Term Meta',
		'category' => 'metablock',
		'icon' => 'tag',
		'description' => 'Display metadata for a selected taxonomy term',
		'supports' => array(
			'html' => false,
			'align' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontWeight' => true,
				'fontStyle' => true,
				'lineHeight' => true,
				'letterSpacing' => true,
				'textDecoration' => true,
				'textTransform' => true,
				'textColumns' => false
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'attributes' => array(
			'displayType' => array(
				'type' => 'string',
				'default' => 'generic',
				'enum' => array(
					'generic',
					'season-producer'
				)
			),
			'taxonomy' => array(
				'type' => 'string',
				'default' => ''
			),
			'termId' => array(
				'type' => 'number',
				'default' => 0
			),
			'metaKey' => array(
				'type' => 'string',
				'default' => ''
			),
			'tagName' => array(
				'type' => 'string',
				'default' => 'p'
			),
			'prepend' => array(
				'type' => 'string',
				'default' => ''
			),
			'append' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingText' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			)
		),
		'textdomain' => 'term-meta',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js',
		'variations' => array(
			array(
				'name' => 'generic',
				'title' => 'Term Meta',
				'description' => 'Display metadata for a selected taxonomy term',
				'attributes' => array(
					'displayType' => 'generic'
				),
				'isDefault' => true
			),
			array(
				'name' => 'season-producer',
				'title' => 'Season Producer',
				'description' => 'Display season producer titles from the current post\'s season taxonomy term',
				'attributes' => array(
					'displayType' => 'season-producer',
					'metaKey' => 'season_producers'
				)
			)
		)
	),
	'thumbnail-list' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/thumbnail-list',
		'title' => 'Thumbnail List',
		'category' => 'theatrum',
		'icon' => 'format-gallery',
		'description' => 'An interactive list with thumbnail images that display when hovering over items. Each item can have a title, description, and thumbnail image.',
		'textdomain' => 'theatrum-blocks',
		'supports' => array(
			'html' => false,
			'align' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'opacity' => true,
			'filters' => array(
				'duotone' => true
			)
		),
		'attributes' => array(
			'items' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'id' => array(
							'type' => 'string',
							'description' => 'Unique identifier for the list item'
						),
						'title' => array(
							'type' => 'string',
							'description' => 'Title text for the list item'
						),
						'description' => array(
							'type' => 'string',
							'description' => 'Description text for the list item'
						),
						'thumbnailId' => array(
							'type' => 'number',
							'description' => 'Media library attachment ID for thumbnail'
						),
						'thumbnailUrl' => array(
							'type' => 'string',
							'description' => 'URL of the thumbnail image'
						),
						'thumbnailAlt' => array(
							'type' => 'string',
							'description' => 'Alt text for the thumbnail image'
						)
					)
				)
			),
			'thumbnailWidth' => array(
				'type' => 'string',
				'default' => '400'
			),
			'thumbnailWidthUnit' => array(
				'type' => 'string',
				'default' => 'px',
				'enum' => array(
					'px',
					'%',
					'em',
					'rem'
				)
			),
			'thumbnailHeight' => array(
				'type' => 'string',
				'default' => '300'
			),
			'thumbnailHeightUnit' => array(
				'type' => 'string',
				'default' => 'px',
				'enum' => array(
					'px',
					'%',
					'em',
					'rem'
				)
			),
			'itemHeight' => array(
				'type' => 'string',
				'default' => '80'
			),
			'itemHeightUnit' => array(
				'type' => 'string',
				'default' => 'px'
			),
			'thumbnailPosition' => array(
				'type' => 'string',
				'default' => 'right',
				'enum' => array(
					'left',
					'right'
				)
			),
			'animationSpeed' => array(
				'type' => 'string',
				'default' => '0.3',
				'enum' => array(
					'0.2',
					'0.3',
					'0.5',
					'1'
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'heading-toggle' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/toggle-heading',
		'title' => 'Heading Toggle',
		'category' => 'text',
		'icon' => 'heading',
		'description' => 'Heading with a toggle to show/hide nested content',
		'keywords' => array(
			'heading',
			'toggle',
			'collapsible',
			'accordion'
		),
		'supports' => array(
			'html' => false,
			'align' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'reusable' => true,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'typography' => array(
				'textAlign' => true,
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			)
		),
		'attributes' => array(
			'content' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => 'summary',
				'default' => ''
			),
			'level' => array(
				'type' => 'number',
				'default' => 2
			),
			'isOpen' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'style' => 'file:./style.scss',
		'editorStyle' => 'file:./editor.scss'
	),
	'subtitle-title' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/subtitle-title',
		'title' => 'Subtitle + Title',
		'category' => 'text',
		'icon' => 'heading',
		'description' => 'Display the post title with an optional subtitle heading before or after it',
		'keywords' => array(
			'title',
			'subtitle',
			'heading',
			'post title'
		),
		'supports' => array(
			'html' => false,
			'align' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'reusable' => true,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'typography' => array(
				'textAlign' => true,
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textDecoration' => true,
				'textTransform' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			'level' => array(
				'type' => 'number',
				'default' => 1
			),
			'subtitlePosition' => array(
				'type' => 'string',
				'default' => 'before'
			),
			'isLink' => array(
				'type' => 'boolean',
				'default' => false
			),
			'linkTarget' => array(
				'type' => 'string',
				'default' => '_self'
			)
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'style' => 'file:./style.scss',
		'editorStyle' => 'file:./editor.scss'
	)
);
