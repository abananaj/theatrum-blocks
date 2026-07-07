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
		'textdomain' => 'theatrum-blocks',
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
		'example' => array(
			
		),
		'keywords' => array(
			'team',
			'staff',
			'person',
			'bio'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'breadcrumbs' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/breadcrumbs',
		'title' => 'Breadcrumbs',
		'category' => 'theme',
		'description' => 'Display a breadcrumb trail showing the path to the current page.',
		'example' => array(
			
		),
		'keywords' => array(
			'navigation',
			'nav',
			'path',
			'trail'
		),
		'textdomain' => 'theatrum-blocks',
		'attributes' => array(
			'prefersTaxonomy' => array(
				'type' => 'boolean',
				'default' => false
			),
			'separator' => array(
				'type' => 'string',
				'default' => '/'
			),
			'showHomeItem' => array(
				'type' => 'boolean',
				'default' => true
			),
			'showCurrentItem' => array(
				'type' => 'boolean',
				'default' => true
			),
			'showOnHomePage' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'usesContext' => array(
			'postId',
			'postType',
			'templateSlug'
		),
		'supports' => array(
			'anchor' => true,
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'color' => array(
				'gradients' => true,
				'link' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'__experimentalBorder' => array(
				'radius' => true,
				'color' => true,
				'width' => true,
				'style' => true,
				'__experimentalDefaultControls' => array(
					'radius' => false,
					'color' => true,
					'width' => true,
					'style' => true
				)
			),
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontWeight' => true,
				'__experimentalFontStyle' => true,
				'__experimentalTextTransform' => true,
				'__experimentalTextDecoration' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'interactivity' => array(
				'clientNavigation' => true
			)
		),
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'card-carousel' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/card-carousel',
		'title' => 'Card Carousel',
		'category' => 'theatrum',
		'icon' => 'images-alt2',
		'description' => 'A responsive carousel display for cards with images, titles, and subtitles',
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
		'example' => array(
			
		),
		'keywords' => array(
			'carousel',
			'slider',
			'cards',
			'gallery'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'card-static' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/card-static',
		'version' => '0.1.0',
		'title' => 'Car',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Example block combining dynamic rendering, inner blocks, block supports, and interactivity.',
		'example' => array(
			
		),
		'attributes' => array(
			'content' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => 'p'
			)
		),
		'allowedBlocks' => array(
			'core/paragraph',
			'core/image',
			'core/heading'
		),
		'supports' => array(
			'html' => false,
			'color' => array(
				'text' => true,
				'background' => true
			),
			'interactivity' => true
		),
		'keywords' => array(
			'example',
			'frankenstein'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./editor.css',
		'style' => 'file:./style.css',
		'render' => 'file:./render.php',
		'viewScriptModule' => 'file:./view.js'
	),
	'copyright-date-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/copyright-date-block',
		'version' => '0.1.0',
		'title' => 'Copyright Date Block',
		'category' => 'theatrum',
		'icon' => 'admin-settings',
		'description' => 'Example block scaffolded with Create Block tool.',
		'example' => array(
			
		),
		'keywords' => array(
			'copyright',
			'year',
			'date',
			'footer'
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
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
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
		'example' => array(
			
		),
		'keywords' => array(
			'card',
			'post',
			'preview',
			'featured'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'cover-carousel' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/cover-carousel',
		'title' => 'Cover Card Carousel',
		'category' => 'theatrum',
		'icon' => 'images-alt2',
		'description' => 'A carousel block for displaying multiple images or videos with overlay content, similar to the Cover block but with carousel functionality',
		'textdomain' => 'theatrum-blocks',
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
		'example' => array(
			
		),
		'keywords' => array(
			'carousel',
			'slider',
			'slideshow',
			'cards'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./editor.scss',
		'style' => 'file:./style.scss',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'list-icons' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/list-icons',
		'title' => 'Icon List',
		'category' => 'theatrum',
		'description' => 'A list block with optional icons for each item. Supports ordered and unordered lists with customizable icon styling.',
		'icon' => 'list-view',
		'example' => array(
			
		),
		'keywords' => array(
			'list',
			'icon',
			'item'
		),
		'allowedBlocks' => array(
			'chance/list-item-icon'
		),
		'providesContext' => array(
			'chance/iconSize' => 'iconSize',
			'chance/iconSizeUnit' => 'iconSizeUnit',
			'chance/iconPosition' => 'iconPosition',
			'chance/iconSpacing' => 'iconSpacing',
			'chance/iconColor' => 'iconColor',
			'chance/hoverOnly' => 'hoverOnly'
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
	'list-thumbnail' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/list-thumbnail',
		'title' => 'Thumbnail List',
		'category' => 'theatrum',
		'icon' => 'format-gallery',
		'description' => 'An interactive list with thumbnail images that display when hovering over items. Each item is a nested block with a title, description, and thumbnail image.',
		'textdomain' => 'theatrum-blocks',
		'allowedBlocks' => array(
			'chance/list-item-thumbnail'
		),
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
		'example' => array(
			
		),
		'keywords' => array(
			'thumbnails',
			'gallery',
			'images',
			'list'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'media-popover' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/media-popover',
		'title' => 'Media Popover',
		'category' => 'theatrum',
		'description' => 'Display media (image or video) in a tooltip-style popover that appears on hover. Link the popover to a URL or page.',
		'icon' => 'image',
		'example' => array(
			
		),
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
		'example' => array(
			
		),
		'keywords' => array(
			'button',
			'link',
			'meta',
			'custom field',
			'acf'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
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
		'example' => array(
			
		),
		'keywords' => array(
			'date',
			'meta',
			'custom field',
			'acf'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
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
		'example' => array(
			
		),
		'keywords' => array(
			'embed',
			'video',
			'iframe',
			'meta'
		),
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
		'example' => array(
			
		),
		'keywords' => array(
			'meta',
			'custom field',
			'acf',
			'field'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
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
		'example' => array(
			
		),
		'keywords' => array(
			'file',
			'download',
			'attachment',
			'meta'
		),
		'textdomain' => 'theatrum-blocks',
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
		'example' => array(
			
		),
		'keywords' => array(
			'gallery',
			'images',
			'photos',
			'meta'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
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
		'example' => array(
			
		),
		'keywords' => array(
			'icon',
			'meta',
			'svg',
			'custom field'
		),
		'textdomain' => 'theatrum-blocks',
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
		'example' => array(
			
		),
		'keywords' => array(
			'image',
			'photo',
			'meta',
			'custom field',
			'acf'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'meta-related' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-related',
		'title' => 'Meta Related',
		'category' => 'metablock',
		'description' => 'Display a related post\'s title by entering a meta key that contains a post ID or Post Object',
		'example' => array(
			
		),
		'keywords' => array(
			'related',
			'posts',
			'meta',
			'custom field'
		),
		'textdomain' => 'theatrum-blocks',
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
			),
			'separator' => array(
				'type' => 'string',
				'default' => ', '
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
			)
		),
		'example' => array(
			
		),
		'keywords' => array(
			'repeater',
			'list',
			'meta',
			'acf'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
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
		'example' => array(
			
		),
		'keywords' => array(
			'time',
			'duration',
			'meta',
			'custom field'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'page-nav' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/page-nav',
		'title' => 'Page Nav',
		'category' => 'theme',
		'icon' => 'menu',
		'description' => 'Automatically links to on-page sections. Set a Group\'s HTML element to <section> and give it an HTML Anchor; its first heading becomes a jump link here. Renders nothing when the page has no qualifying sections.',
		'example' => array(
			
		),
		'keywords' => array(
			'navigation',
			'nav',
			'anchor',
			'jump',
			'section',
			'on this page'
		),
		'textdomain' => 'theatrum-blocks',
		'attributes' => array(
			'navLabel' => array(
				'type' => 'string',
				'default' => 'On this page'
			),
			'contentSelector' => array(
				'type' => 'string',
				'default' => 'main'
			)
		),
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'align' => array(
				'wide',
				'full'
			),
			'className' => true,
			'customClassName' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'color' => array(
				'gradients' => true,
				'link' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontWeight' => true,
				'__experimentalFontStyle' => true,
				'__experimentalTextTransform' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'interactivity' => array(
				'clientNavigation' => true
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php'
	),
	'popup' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/popup',
		'title' => 'popup',
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
		'example' => array(
			
		),
		'keywords' => array(
			'modal',
			'dialog',
			'overlay',
			'lightbox'
		),
		'textdomain' => 'theatrum-blocks',
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
		'example' => array(
			
		),
		'keywords' => array(
			'performances',
			'schedule',
			'shows',
			'dates'
		),
		'textdomain' => 'theatrum-blocks',
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
		'example' => array(
			
		),
		'keywords' => array(
			'quotes',
			'reviews',
			'press',
			'testimonials'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'production-tabs' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/production-tabs',
		'title' => 'Production Tabs',
		'category' => 'theatrum',
		'icon' => 'index-card',
		'description' => 'Horizontal tabs that collapse into a vertical accordion on mobile. Add a tab for each section and give it a heading.',
		'textdomain' => 'theatrum-blocks',
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'align' => array(
				'wide',
				'full'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradients' => true
			),
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'letterSpacing' => true,
				'lineHeight' => true,
				'textTransform' => true
			)
		),
		'allowedBlocks' => array(
			'chance/tab'
		),
		'example' => array(
			'innerBlocks' => array(
				array(
					'name' => 'chance/tab',
					'attributes' => array(
						'title' => 'Synopsis'
					),
					'innerBlocks' => array(
						array(
							'name' => 'core/paragraph',
							'attributes' => array(
								'content' => 'What the show is about.'
							)
						)
					)
				),
				array(
					'name' => 'chance/tab',
					'attributes' => array(
						'title' => 'Cast'
					),
					'innerBlocks' => array(
						array(
							'name' => 'core/paragraph',
							'attributes' => array(
								'content' => 'Who is in it.'
							)
						)
					)
				)
			)
		),
		'keywords' => array(
			'tabs',
			'accordion',
			'tabbed',
			'sections'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
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
		'example' => array(
			
		),
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
		'textdomain' => 'theatrum-blocks',
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
		'example' => array(
			
		),
		'keywords' => array(
			'filter',
			'search',
			'sort',
			'query'
		),
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
	'query-loop' => array(
		'apiVersion' => 3,
		'name' => 'theatrum/query-loop',
		'title' => 'Theatrum Query Loop',
		'category' => 'theatrum',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./editor.scss',
		'supports' => array(
			'inserter' => false
		)
	),
	'season-producer' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/season-producer',
		'title' => 'Season Producer (Deprecated)',
		'category' => 'metablock',
		'description' => 'Deprecated — use the Term Meta block\'s "Season Producer" variation instead. Kept registered so existing content keeps rendering; hidden from the inserter so it can\'t be added again.',
		'icon' => 'awards',
		'supports' => array(
			'inserter' => false,
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
		'usesContext' => array(
			'postId',
			'postType'
		),
		'example' => array(
			
		),
		'keywords' => array(
			'producer',
			'season',
			'staff',
			'theater'
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
		'example' => array(
			
		),
		'keywords' => array(
			'options',
			'settings',
			'site',
			'global'
		),
		'textdomain' => 'theatrum-blocks',
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
		'render' => 'file:./render.php'
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
		'example' => array(
			
		),
		'keywords' => array(
			'staff',
			'team',
			'person',
			'bio'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'table-advanced' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/table-advanced',
		'title' => 'Advanced Table',
		'category' => 'text',
		'description' => 'Version of core table block that allows nesting of table elements as nested blocks.',
		'textdomain' => 'theatrum-blocks',
		'attributes' => array(
			'hasThead' => array(
				'type' => 'boolean',
				'default' => true
			),
			'hasTFoot' => array(
				'type' => 'boolean',
				'default' => false
			),
			'tableLayoutFixed' => array(
				'type' => 'boolean',
				'default' => false
			),
			'tableTitle' => array(
				'type' => 'rich-text',
				'source' => 'rich-text',
				'selector' => '.tm-table-advanced > caption',
				'role' => 'content'
			)
		),
		'allowedBlocks' => array(
			'theatrum/table-caption',
			'theatrum/table-header',
			'theatrum/table-body',
			'theatrum/table-footer',
			'theatrum/table-row',
			'theatrum/table-heading-cell',
			'theatrum/table-cell'
		),
		'supports' => array(
			'anchor' => true,
			'align' => array(
				'wide',
				'full',
				'left',
				'center',
				'right'
			),
			'alignWide' => true,
			'allowedBlocks' => true,
			'className' => true,
			'shadow' => true,
			'color' => array(
				'background' => true,
				'text' => true,
				'enableContrastChecker' => true,
				'gradients' => true,
				'link' => true,
				'heading' => false,
				'button' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'__experimentalDefaultControls' => array(
					'margin' => false,
					'padding' => false
				)
			),
			'dimensions' => array(
				'aspectRatio' => true,
				'height' => true,
				'minHeight' => true,
				'minWidth' => true,
				'width' => true
			),
			'typography' => array(
				'fitText' => true,
				'fontSize' => true,
				'lineHeight' => true,
				'textAlign' => true,
				'textIndent' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontStyle' => true,
				'__experimentalFontWeight' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalTextTransform' => true,
				'__experimentalTextDecoration' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			),
			'interactivity' => array(
				'clientNavigation' => true
			)
		),
		'selectors' => array(
			'root' => '.tm-table-advanced'
		),
		'styles' => array(
			array(
				'name' => 'regular',
				'label' => 'Default',
				'isDefault' => true
			),
			array(
				'name' => 'stripes',
				'label' => 'Stripes'
			)
		),
		'example' => array(
			
		),
		'keywords' => array(
			'table',
			'data',
			'rows',
			'columns'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'table-of-contents' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/table-of-contents',
		'title' => 'Table of Contents',
		'category' => 'design',
		'description' => 'Summarize your post with a list of headings. Add HTML anchors to Heading blocks to link them here.',
		'example' => array(
			
		),
		'keywords' => array(
			'document outline',
			'summary'
		),
		'textdomain' => 'theatrum-blocks',
		'attributes' => array(
			'headings' => array(
				'type' => 'array',
				'items' => array(
					'type' => 'object'
				),
				'default' => array(
					
				)
			),
			'onlyIncludeCurrentPage' => array(
				'type' => 'boolean',
				'default' => false
			),
			'maxLevel' => array(
				'type' => 'number'
			),
			'ordered' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'supports' => array(
			'anchor' => true,
			'ariaLabel' => true,
			'html' => false,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradients' => true,
				'link' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontWeight' => true,
				'__experimentalFontStyle' => true,
				'__experimentalTextTransform' => true,
				'__experimentalTextDecoration' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'interactivity' => array(
				'clientNavigation' => true
			),
			'__experimentalBorder' => array(
				'radius' => true,
				'color' => true,
				'width' => true,
				'style' => true,
				'__experimentalDefaultControls' => array(
					'radius' => true,
					'color' => true,
					'width' => true,
					'style' => true
				)
			)
		),
		'style' => 'wp-block-table-of-contents'
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
		'usesContext' => array(
			'postId',
			'postType'
		),
		'example' => array(
			
		),
		'keywords' => array(
			'taxonomy',
			'term',
			'category',
			'meta'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
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
	'title-advanced' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/title-advanced',
		'title' => 'Title (Advanced)',
		'category' => 'text',
		'icon' => 'heading',
		'description' => 'A heading group: the post title as an H1, plus meta-bound subtitle and pre-title lines.',
		'keywords' => array(
			'title',
			'subtitle',
			'pre-title',
			'heading',
			'heading group',
			'meta'
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
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style.scss',
		'editorStyle' => 'file:./editor.scss'
	),
	'list-item-icon' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/list-item-icon',
		'title' => 'Icon List Item',
		'category' => 'theatrum',
		'description' => 'A single item in an icon list, with an optional icon and text.',
		'icon' => 'minus',
		'keywords' => array(
			'list',
			'icon',
			'item'
		),
		'parent' => array(
			'chance/list-icons'
		),
		'usesContext' => array(
			'chance/iconSize',
			'chance/iconSizeUnit',
			'chance/iconPosition',
			'chance/iconSpacing',
			'chance/iconColor',
			'chance/hoverOnly'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'className' => true,
			'customClassName' => true,
			'anchor' => true,
			'color' => array(
				'text' => true,
				'background' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
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
			)
		),
		'attributes' => array(
			'text' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => '.list-icons-text',
				'default' => ''
			),
			'iconId' => array(
				'type' => 'number',
				'default' => 0
			),
			'iconUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'iconAlt' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'list-item-thumbnail' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/list-item-thumbnail',
		'title' => 'Thumbnail List Item',
		'category' => 'theatrum',
		'description' => 'A single item in a thumbnail list, with a title, optional description, and a thumbnail image.',
		'icon' => 'format-image',
		'keywords' => array(
			'thumbnail',
			'list',
			'item'
		),
		'parent' => array(
			'chance/list-thumbnail'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'className' => true,
			'customClassName' => true,
			'anchor' => true,
			'color' => array(
				'text' => true,
				'background' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
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
			)
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => '.item-title',
				'default' => ''
			),
			'description' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => '.item-description',
				'default' => ''
			),
			'thumbnailId' => array(
				'type' => 'number',
				'default' => 0
			),
			'thumbnailUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'thumbnailAlt' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'tab' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/tab',
		'title' => 'Tab',
		'category' => 'theatrum',
		'icon' => 'index-card',
		'description' => 'A single tab: a heading plus its content. Used inside Production Tabs.',
		'textdomain' => 'theatrum-blocks',
		'parent' => array(
			'chance/production-tabs'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'anchor' => true,
			'spacing' => array(
				'padding' => true,
				'blockGap' => true
			),
			'color' => array(
				'text' => true,
				'background' => true
			),
			'typography' => array(
				'fontSize' => true,
				'fontFamily' => true,
				'fontStyle' => true,
				'fontWeight' => true,
				'lineHeight' => true
			)
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js'
	),
	'table-body' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Body',
		'name' => 'theatrum/table-body',
		'category' => 'text',
		'keywords' => array(
			'table'
		),
		'attributes' => array(
			'align' => array(
				'type' => 'string',
				'default' => 'left'
			),
			'char' => array(
				'type' => 'string',
				'default' => ''
			),
			'charoff' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'parent' => array(
			'theatrum/table-advanced'
		),
		'allowedBlocks' => array(
			'theatrum/table-row'
		),
		'supports' => array(
			'anchor' => true,
			'align' => array(
				'wide',
				'full',
				'left',
				'center',
				'right'
			),
			'alignWide' => true,
			'allowedBlocks' => true,
			'className' => true,
			'shadow' => true,
			'color' => array(
				'background' => true,
				'text' => true,
				'enableContrastChecker' => true,
				'gradients' => true,
				'link' => true,
				'heading' => false,
				'button' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'layout' => array(
				'allowVerticalAlignment' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'__experimentalDefaultControls' => array(
					'margin' => false,
					'padding' => false
				)
			),
			'dimensions' => array(
				'aspectRatio' => true,
				'height' => true,
				'minHeight' => true,
				'minWidth' => true,
				'width' => true
			),
			'typography' => array(
				'fitText' => true,
				'fontSize' => true,
				'lineHeight' => true,
				'textAlign' => true,
				'textIndent' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontStyle' => true,
				'__experimentalFontWeight' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalTextTransform' => true,
				'__experimentalTextDecoration' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			),
			'interactivity' => array(
				'clientNavigation' => true
			)
		),
		'selectors' => array(
			'root' => '.tm-table-advanced .tm-table-body'
		),
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css'
	),
	'table-caption' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Title',
		'name' => 'theatrum/table-caption',
		'category' => 'text',
		'keywords' => array(
			'table'
		),
		'attributes' => array(
			'headingLevel' => array(
				'type' => 'number',
				'default' => 2
			)
		),
		'parent' => array(
			'theatrum/table-advanced'
		),
		'allowedBlocks' => array(
			'core/paragraph',
			'core/heading'
		),
		'providesContext' => array(
			'theatrum/headingLevel' => 'attributes.headingLevel'
		),
		'supports' => array(
			'anchor' => true,
			'align' => array(
				'wide',
				'full',
				'left',
				'center',
				'right'
			),
			'alignWide' => true,
			'className' => true,
			'shadow' => true,
			'color' => array(
				'background' => true,
				'text' => true,
				'enableContrastChecker' => true,
				'gradients' => true,
				'link' => true,
				'heading' => false,
				'button' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'dimensions' => array(
				'aspectRatio' => true,
				'height' => true,
				'minHeight' => true,
				'minWidth' => true,
				'width' => true
			),
			'typography' => array(
				'fitText' => true,
				'fontSize' => true,
				'lineHeight' => true,
				'textAlign' => true,
				'textIndent' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontStyle' => true,
				'__experimentalFontWeight' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalTextTransform' => true,
				'__experimentalTextDecoration' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'interactivity' => array(
				'clientNavigation' => true
			)
		),
		'selectors' => array(
			'root' => '.tm-table-advanced .tm-table-adv-title'
		),
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css'
	),
	'table-cell' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Cell',
		'name' => 'theatrum/table-cell',
		'category' => 'text',
		'keywords' => array(
			'table'
		),
		'attributes' => array(
			'colspan' => array(
				'type' => 'number',
				'default' => 1
			),
			'headers' => array(
				'type' => 'string',
				'default' => ''
			),
			'rowspan' => array(
				'type' => 'number',
				'default' => 1
			)
		),
		'parent' => array(
			'theatrum/table-row'
		),
		'ancestor' => array(
			'theatrum/table-advanced'
		),
		'allowedBlocks' => array(
			'core/paragraph',
			'core/list',
			'core/image',
			'core/gallery',
			'core/video',
			'core/audio',
			'core/file',
			'core/cover',
			'core/group',
			'core/icon'
		),
		'supports' => array(
			'anchor' => true,
			'allowedBlocks' => true,
			'className' => true,
			'shadow' => true,
			'color' => array(
				'background' => true,
				'text' => true,
				'enableContrastChecker' => true,
				'gradients' => true,
				'link' => true,
				'heading' => false,
				'button' => true,
				'__experimentalSkipSerialization' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'__experimentalDefaultControls' => array(
					'margin' => false,
					'padding' => false
				)
			),
			'dimensions' => array(
				'height' => true,
				'minHeight' => true,
				'minWidth' => true,
				'width' => true
			),
			'typography' => array(
				'fitText' => true,
				'fontSize' => true,
				'lineHeight' => true,
				'textAlign' => true,
				'textIndent' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontStyle' => true,
				'__experimentalFontWeight' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalTextTransform' => true,
				'__experimentalTextDecoration' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'__experimentalBorder' => array(
				'__experimentalSkipSerialization' => true,
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			)
		),
		'selectors' => array(
			'root' => '.tm-table-advanced .tm-table-cell'
		),
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css'
	),
	'table-footer' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Footer',
		'name' => 'theatrum/table-footer',
		'category' => 'text',
		'keywords' => array(
			'table'
		),
		'attributes' => array(
			'align' => array(
				'type' => 'string',
				'default' => 'left'
			),
			'char' => array(
				'type' => 'string',
				'default' => ''
			),
			'charoff' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'parent' => array(
			'theatrum/table-advanced'
		),
		'allowedBlocks' => array(
			'theatrum/table-row'
		),
		'supports' => array(
			'anchor' => true,
			'align' => array(
				'wide',
				'full',
				'left',
				'center',
				'right'
			),
			'alignWide' => true,
			'allowedBlocks' => true,
			'className' => true,
			'shadow' => true,
			'color' => array(
				'background' => true,
				'text' => true,
				'enableContrastChecker' => true,
				'gradients' => true,
				'link' => true,
				'heading' => false,
				'button' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'layout' => array(
				'allowVerticalAlignment' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'__experimentalDefaultControls' => array(
					'margin' => false,
					'padding' => false
				)
			),
			'dimensions' => array(
				'aspectRatio' => true,
				'height' => true,
				'minHeight' => true,
				'minWidth' => true,
				'width' => true
			),
			'typography' => array(
				'fitText' => true,
				'fontSize' => true,
				'lineHeight' => true,
				'textAlign' => true,
				'textIndent' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontStyle' => true,
				'__experimentalFontWeight' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalTextTransform' => true,
				'__experimentalTextDecoration' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			)
		),
		'selectors' => array(
			'root' => '.tm-table-advanced .tm-table-footer'
		),
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css'
	),
	'table-header' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Header',
		'name' => 'theatrum/table-header',
		'category' => 'text',
		'keywords' => array(
			'table'
		),
		'parent' => array(
			'theatrum/table-advanced'
		),
		'allowedBlocks' => array(
			'theatrum/table-row'
		),
		'supports' => array(
			'anchor' => true,
			'align' => array(
				'wide',
				'full',
				'left',
				'center',
				'right'
			),
			'alignWide' => true,
			'allowedBlocks' => true,
			'className' => true,
			'shadow' => true,
			'color' => array(
				'background' => true,
				'text' => true,
				'enableContrastChecker' => true,
				'gradients' => true,
				'link' => true,
				'heading' => false,
				'button' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'dimensions' => array(
				'height' => true,
				'minHeight' => true,
				'minWidth' => true,
				'width' => true
			),
			'layout' => array(
				'allowVerticalAlignment' => true
			),
			'typography' => array(
				'fitText' => true,
				'fontSize' => true,
				'lineHeight' => true,
				'textAlign' => true,
				'textIndent' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontStyle' => true,
				'__experimentalFontWeight' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalTextTransform' => true,
				'__experimentalTextDecoration' => true
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'interactivity' => array(
				'clientNavigation' => true
			)
		),
		'selectors' => array(
			'root' => '.tm-table-advanced .tm-table-header'
		),
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css'
	),
	'table-heading-cell' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Heading Cell',
		'name' => 'theatrum/table-heading-cell',
		'category' => 'text',
		'keywords' => array(
			'table'
		),
		'attributes' => array(
			'abbr' => array(
				'type' => 'string'
			),
			'colspan' => array(
				'type' => 'number'
			),
			'headers' => array(
				'type' => 'string'
			),
			'rowspan' => array(
				'type' => 'number'
			),
			'scope' => array(
				'type' => 'string',
				'enum' => array(
					'row',
					'col',
					'rowgroup',
					'colgroup'
				)
			)
		),
		'parent' => array(
			'theatrum/table-row'
		),
		'ancestor' => array(
			'theatrum/table-advanced'
		),
		'allowedBlocks' => array(
			'core/paragraph',
			'core/list',
			'core/image',
			'core/icon'
		),
		'supports' => array(
			'anchor' => true,
			'allowedBlocks' => true,
			'className' => true,
			'shadow' => true,
			'color' => array(
				'background' => true,
				'text' => true,
				'enableContrastChecker' => true,
				'gradients' => true,
				'link' => true,
				'heading' => false,
				'button' => true,
				'__experimentalSkipSerialization' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'__experimentalDefaultControls' => array(
					'margin' => false,
					'padding' => false
				)
			),
			'dimensions' => array(
				'height' => true,
				'minHeight' => true,
				'minWidth' => true,
				'width' => true
			),
			'typography' => array(
				'fitText' => true,
				'fontSize' => true,
				'lineHeight' => true,
				'textAlign' => true,
				'textIndent' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontStyle' => true,
				'__experimentalFontWeight' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalTextTransform' => true,
				'__experimentalTextDecoration' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'__experimentalBorder' => array(
				'__experimentalSkipSerialization' => true,
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			),
			'interactivity' => array(
				'clientNavigation' => true
			)
		),
		'selectors' => array(
			'root' => '.tm-table-advanced .tm-table-heading-cell'
		),
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css'
	),
	'table-row' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Row',
		'name' => 'theatrum/table-row',
		'category' => 'text',
		'keywords' => array(
			'table'
		),
		'attributes' => array(
			'char' => array(
				'type' => 'string',
				'default' => ''
			),
			'charoff' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'parent' => array(
			'theatrum/table-header',
			'theatrum/table-body',
			'theatrum/table-footer'
		),
		'ancestor' => array(
			'theatrum/table-advanced'
		),
		'allowedBlocks' => array(
			'theatrum/table-heading-cell',
			'theatrum/table-cell'
		),
		'supports' => array(
			'anchor' => true,
			'align' => array(
				'wide',
				'full',
				'left',
				'center',
				'right'
			),
			'alignWide' => true,
			'allowedBlocks' => true,
			'className' => true,
			'shadow' => true,
			'color' => array(
				'background' => true,
				'text' => true,
				'enableContrastChecker' => true,
				'gradients' => true,
				'link' => true,
				'heading' => false,
				'button' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'__experimentalDefaultControls' => array(
					'margin' => false,
					'padding' => false
				)
			),
			'layout' => array(
				'allowVerticalAlignment' => true,
				'allowTextAlignment' => true,
				'allowOverlap' => true,
				'allowOverflow' => true
			),
			'dimensions' => array(
				'aspectRatio' => true,
				'height' => true,
				'minHeight' => true,
				'minWidth' => true,
				'width' => true
			),
			'typography' => array(
				'fitText' => true,
				'fontSize' => true,
				'lineHeight' => true,
				'textAlign' => true,
				'textIndent' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontStyle' => true,
				'__experimentalFontWeight' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalTextTransform' => true,
				'__experimentalTextDecoration' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			),
			'interactivity' => array(
				'clientNavigation' => true
			)
		),
		'selectors' => array(
			'root' => '.tm-table-advanced .tm-table-row'
		),
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css'
	)
);
