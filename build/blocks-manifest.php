<?php
// This file is generated. Do not modify it manually.
return array(
	'blockquote-advanced' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/blockquote-advanced',
		'title' => 'Blockquote',
		'category' => 'theatrum',
		'icon' => 'format-quote',
		'description' => 'A customizable blockquote with an optional cited source line.',
		'textdomain' => 'theatrum-blocks',
		'keywords' => array(
			'quote',
			'blockquote',
			'citation',
			'cite'
		),
		'attributes' => array(
			'addCitation' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'allowedBlocks' => array(
			'theatrum/blockquote-text',
			'theatrum/blockquote-source'
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'color' => array(
				'text' => true,
				'background' => true
			)
		),
		'example' => array(
			'innerBlocks' => array(
				array(
					'name' => 'theatrum/blockquote-text',
					'innerBlocks' => array(
						array(
							'name' => 'core/paragraph',
							'attributes' => array(
								'content' => 'Words can be like X-rays, if you use them properly—they\'ll go through anything. You read and you\'re pierced.'
							)
						)
					)
				),
				array(
					'name' => 'theatrum/blockquote-source',
					'attributes' => array(
						'sourceText' => '— Aldous Huxley, <cite class="theatrum-blockquote-cite">Brave New World</cite>'
					)
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'breadcrumbs' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/breadcrumbs',
		'title' => 'Fancy Breadcrumbs',
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
	'carousel' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/carousel',
		'title' => 'Carousel',
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
				'padding' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			),
			'shadow' => true,
			'filter' => array(
				'duotone' => true
			)
		),
		'attributes' => array(
			'cardWidth' => array(
				'type' => 'string',
				'default' => ''
			),
			'cardWidthUnit' => array(
				'type' => 'string',
				'default' => 'px',
				'enum' => array(
					'px',
					'%',
					'em',
					'rem'
				)
			),
			'gap' => array(
				'type' => 'string',
				'default' => ''
			),
			'gapUnit' => array(
				'type' => 'string',
				'default' => 'px',
				'enum' => array(
					'px',
					'%',
					'em',
					'rem'
				)
			),
			'arrowPosition' => array(
				'type' => 'string',
				'default' => 'outside',
				'enum' => array(
					'outside',
					'inside',
					'hidden'
				)
			),
			'showScrollbar' => array(
				'type' => 'boolean',
				'default' => false
			),
			'arrowBackground' => array(
				'type' => 'boolean',
				'default' => true
			),
			'arrowColor' => array(
				'type' => 'string',
				'default' => ''
			),
			'arrowBackgroundColor' => array(
				'type' => 'string',
				'default' => ''
			),
			'arrowSize' => array(
				'type' => 'string',
				'default' => ''
			),
			'arrowSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
				'enum' => array(
					'px',
					'%',
					'em',
					'rem'
				)
			)
		),
		'allowedBlocks' => array(
			'theatrum/carousel-item'
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
	'list-icons' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/list-icons',
		'textdomain' => 'theatrum-blocks',
		'title' => 'Icon List',
		'category' => 'theatrum',
		'description' => 'An unordered list block with optional icons for each item and customizable icon styling.',
		'icon' => 'list-view',
		'example' => array(
			
		),
		'keywords' => array(
			'list',
			'icon',
			'item'
		),
		'allowedBlocks' => array(
			'theatrum/list-item-icon'
		),
		'providesContext' => array(
			'theatrum/iconSize' => 'iconSize',
			'theatrum/iconSizeUnit' => 'iconSizeUnit',
			'theatrum/iconPosition' => 'iconPosition',
			'theatrum/iconSpacing' => 'iconSpacing',
			'theatrum/iconColor' => 'iconColor',
			'theatrum/hoverOnly' => 'hoverOnly'
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
			'shadow' => true
		),
		'attributes' => array(
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
			'iconAlign' => array(
				'type' => 'string',
				'default' => 'middle',
				'enum' => array(
					'top',
					'middle',
					'bottom'
				)
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
		'name' => 'theatrum/list-thumbnail',
		'title' => 'Thumbnail List',
		'category' => 'theatrum',
		'icon' => 'format-gallery',
		'description' => 'An interactive list with thumbnail images that display when hovering over items. Each item is a nested block with a title, description, and thumbnail image.',
		'textdomain' => 'theatrum-blocks',
		'allowedBlocks' => array(
			'theatrum/list-item-thumbnail'
		),
		'providesContext' => array(
			'theatrum/imageSizeSlug' => 'imageSizeSlug'
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
			'filter' => array(
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
			'verticalAlignment' => array(
				'type' => 'string',
				'default' => 'top',
				'enum' => array(
					'top',
					'center',
					'bottom'
				),
				'description' => 'Vertical alignment of the list-items column against the flip-card thumbnail panel'
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
			),
			'imageSizeSlug' => array(
				'type' => 'string',
				'default' => 'full',
				'description' => 'WP registered image size used to resolve each item\'s thumbnail URL'
			),
			'thumbnailAspectRatio' => array(
				'type' => 'string',
				'default' => 'auto',
				'enum' => array(
					'auto',
					'1',
					'4/3',
					'3/4',
					'16/9',
					'9/16'
				)
			),
			'thumbnailObjectFit' => array(
				'type' => 'string',
				'default' => 'cover',
				'enum' => array(
					'cover',
					'contain',
					'fill'
				)
			),
			'hideDescriptionUntilHover' => array(
				'type' => 'boolean',
				'default' => false
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
	'meta-button' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/meta-button',
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
		'name' => 'theatrum/meta-date',
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
		'name' => 'theatrum/meta-embed',
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
			),
			'allowResponsive' => array(
				'type' => 'boolean',
				'default' => true
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
		'name' => 'theatrum/meta-field',
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
			'isHtml' => array(
				'type' => 'boolean',
				'default' => false
			),
			'fallbackToPostContent' => array(
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
		'name' => 'theatrum/meta-file',
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
		'name' => 'theatrum/meta-gallery',
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
			'columnsTablet' => array(
				'type' => 'number',
				'minimum' => 1,
				'maximum' => 8
			),
			'columnsMobile' => array(
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
			'imageLimit' => array(
				'type' => 'number',
				'minimum' => 1
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
			'customWidth' => array(
				'type' => 'number'
			),
			'customHeight' => array(
				'type' => 'number'
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
	'meta-image' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/meta-image',
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
		'name' => 'theatrum/meta-related',
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
		'name' => 'theatrum/meta-repeater',
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
				'default' => 'p'
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
		'name' => 'theatrum/meta-time',
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
	'performances-list' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/performances-list',
		'title' => 'Performances List',
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
	'popover' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/popover',
		'title' => 'Popover',
		'category' => 'theatrum',
		'icon' => 'info-outline',
		'description' => 'A hover/tap popover. Add a Popover Trigger and a Popover Content block inside — each accepts any blocks you want, like a Group.',
		'textdomain' => 'theatrum-blocks',
		'keywords' => array(
			'popover',
			'tooltip',
			'hover',
			'trigger',
			'media'
		),
		'allowedBlocks' => array(
			'theatrum/popover-trigger',
			'theatrum/popover-content'
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
		'example' => array(
			'innerBlocks' => array(
				array(
					'name' => 'theatrum/popover-trigger',
					'innerBlocks' => array(
						array(
							'name' => 'core/paragraph',
							'attributes' => array(
								'content' => 'Hover me'
							)
						)
					)
				),
				array(
					'name' => 'theatrum/popover-content',
					'innerBlocks' => array(
						array(
							'name' => 'core/paragraph',
							'attributes' => array(
								'content' => 'Popover content'
							)
						)
					)
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'popup' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/popup',
		'title' => 'Popup',
		'category' => 'design',
		'icon' => 'visibility',
		'description' => 'A dialog/popup block. Opened by any core/button linked to it via its HTML Anchor.',
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
			'filter' => array(
				'duotone' => true
			)
		),
		'attributes' => array(
			'dialogLabel' => array(
				'type' => 'string',
				'default' => ''
			),
			'autoOpenDelay' => array(
				'type' => 'number',
				'default' => 0
			),
			'position' => array(
				'type' => 'string',
				'default' => 'center',
				'enum' => array(
					'center',
					'top',
					'right',
					'bottom',
					'left'
				)
			),
			'size' => array(
				'type' => 'string',
				'default' => 'medium',
				'enum' => array(
					'small',
					'medium',
					'large',
					'full'
				)
			)
		),
		'example' => array(
			
		),
		'keywords' => array(
			'modal',
			'dialog',
			'overlay',
			'lightbox',
			'trigger',
			'anchor'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'production-quotes' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/production-quotes',
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
			'filter' => array(
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
	'query-filter' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/query-filter',
		'textdomain' => 'theatrum-blocks',
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
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'typography' => array(
				'fontSize' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			)
		),
		'attributes' => array(
			'queryId' => array(
				'type' => 'number',
				'default' => 0
			),
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
		'style' => 'file:./style-index.css',
		'editorStyle' => 'file:./index.css'
	),
	'query-loop' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/query-loop',
		'title' => 'Theatrum Query Loop',
		'category' => 'theatrum',
		'description' => 'Registers Theatrum\'s post-type-specific core/query variations (production, event, class, blog, artist, supporter, venue loops). Not directly insertable — pick a variation from the core Query Loop block instead. The Credit Loop variation is deprecated and hidden from the inserter.',
		'icon' => 'list-view',
		'keywords' => array(
			'query',
			'loop',
			'production',
			'event',
			'artist'
		),
		'textdomain' => 'theatrum-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./editor.scss',
		'supports' => array(
			'inserter' => false
		)
	),
	'site-option' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/site-option',
		'title' => 'Site Option',
		'category' => 'metablock',
		'description' => 'Display values from WordPress options table. The Staff Member/Board Member variations are deprecated — use the generic block for new content.',
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
			'prependTag' => array(
				'type' => 'string',
				'default' => '',
				'enum' => array(
					'',
					'em',
					'strong',
					'small'
				)
			),
			'append' => array(
				'type' => 'string',
				'default' => ''
			),
			'appendTag' => array(
				'type' => 'string',
				'default' => '',
				'enum' => array(
					'',
					'em',
					'strong',
					'small'
				)
			),
			'metaKey' => array(
				'type' => 'string',
				'default' => ''
			),
			'linkPostTitle' => array(
				'type' => 'boolean',
				'default' => true
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
				'title' => 'Staff Member (Deprecated)',
				'description' => 'Deprecated — display staff member information from WordPress options. Hidden from the inserter; do not use for new content.',
				'icon' => 'admin-users',
				'attributes' => array(
					'memberType' => 'staff'
				),
				'isActive' => array(
					'memberType'
				),
				'scope' => array(
					
				)
			),
			array(
				'name' => 'board',
				'title' => 'Board Member (Deprecated)',
				'description' => 'Deprecated — display board member information from WordPress options. Hidden from the inserter; do not use for new content.',
				'icon' => 'groups',
				'attributes' => array(
					'memberType' => 'board'
				),
				'isActive' => array(
					'memberType'
				),
				'scope' => array(
					
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'slider' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/slider',
		'title' => 'Slider',
		'category' => 'theatrum',
		'icon' => 'images-alt2',
		'description' => 'A fading slideshow with prev/next arrows and dot navigation. Each slide is a Slider Item that can hold any blocks.',
		'textdomain' => 'theatrum-blocks',
		'supports' => array(
			'html' => false,
			'align' => true,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
			),
			'border' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true
			)
		),
		'attributes' => array(
			'autoplay' => array(
				'type' => 'boolean',
				'default' => false
			),
			'autoplaySpeed' => array(
				'type' => 'number',
				'default' => 5000,
				'minimum' => 100,
				'maximum' => 10000
			),
			'arrowPosition' => array(
				'type' => 'string',
				'default' => 'inside',
				'enum' => array(
					'outside',
					'inside',
					'hidden'
				)
			),
			'arrowBackground' => array(
				'type' => 'boolean',
				'default' => true
			),
			'arrowColor' => array(
				'type' => 'string',
				'default' => ''
			),
			'arrowBackgroundColor' => array(
				'type' => 'string',
				'default' => ''
			),
			'arrowSize' => array(
				'type' => 'string',
				'default' => ''
			),
			'arrowSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
				'enum' => array(
					'px',
					'%',
					'em',
					'rem'
				)
			)
		),
		'allowedBlocks' => array(
			'theatrum/slider-item'
		),
		'example' => array(
			
		),
		'keywords' => array(
			'slider',
			'slideshow',
			'carousel',
			'gallery'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
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
			'stickyHeader' => array(
				'type' => 'boolean',
				'default' => false
			),
			'stickyFirstColumn' => array(
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
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css'
	),
	'tabs' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/tabs',
		'title' => 'Tabs',
		'category' => 'design',
		'icon' => 'index-card',
		'description' => 'Horizontal tabs that collapse into a vertical accordion on mobile. Add a tab for each section and give it a heading.',
		'textdomain' => 'theatrum-blocks',
		'attributes' => array(
			'equalWidthTabs' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
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
			'theatrum/tab'
		),
		'example' => array(
			'innerBlocks' => array(
				array(
					'name' => 'theatrum/tab',
					'innerBlocks' => array(
						array(
							'name' => 'theatrum/tab-heading',
							'innerBlocks' => array(
								array(
									'name' => 'core/heading',
									'attributes' => array(
										'level' => 3,
										'content' => 'Synopsis'
									)
								)
							)
						),
						array(
							'name' => 'theatrum/tab-content',
							'innerBlocks' => array(
								array(
									'name' => 'core/paragraph',
									'attributes' => array(
										'content' => 'What the show is about.'
									)
								)
							)
						)
					)
				),
				array(
					'name' => 'theatrum/tab',
					'innerBlocks' => array(
						array(
							'name' => 'theatrum/tab-heading',
							'innerBlocks' => array(
								array(
									'name' => 'core/heading',
									'attributes' => array(
										'level' => 3,
										'content' => 'Cast'
									)
								)
							)
						),
						array(
							'name' => 'theatrum/tab-content',
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
	'term-meta' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/term-meta',
		'title' => 'Term Meta',
		'category' => 'metablock',
		'icon' => 'tag',
		'description' => 'Display metadata for a selected taxonomy term. The Season Producer variation is deprecated — use the generic block for new content.',
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
			'linkToPost' => array(
				'type' => 'boolean',
				'default' => true
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
				'title' => 'Season Producer (Deprecated)',
				'description' => 'Deprecated — display season producer titles from the current post\'s season taxonomy term. Hidden from the inserter; do not use for new content.',
				'attributes' => array(
					'displayType' => 'season-producer',
					'metaKey' => 'season_producers'
				),
				'scope' => array(
					
				)
			)
		)
	),
	'title-advanced' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/title-advanced',
		'textdomain' => 'theatrum-blocks',
		'title' => 'Title (Advanced)',
		'category' => 'text',
		'icon' => 'heading',
		'description' => 'A heading group: the post title as an H1, plus meta-bound subtitle and pretitle lines.',
		'keywords' => array(
			'title',
			'subtitle',
			'pretitle',
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
	'blockquote-source' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/blockquote-source',
		'title' => 'Source',
		'category' => 'theatrum',
		'icon' => 'admin-users',
		'description' => 'The attributed source line for the quote, e.g. —Author, Work Title.',
		'textdomain' => 'theatrum-blocks',
		'parent' => array(
			'theatrum/blockquote-advanced'
		),
		'attributes' => array(
			'sourceText' => array(
				'type' => 'rich-text',
				'source' => 'rich-text',
				'selector' => 'p',
				'default' => '— Author, <cite class="theatrum-blockquote-cite">Work Title</cite>',
				'role' => 'content'
			)
		),
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'anchor' => true,
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
				'text' => true
			)
		),
		'editorScript' => 'file:./index.js'
	),
	'blockquote-text' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/blockquote-text',
		'title' => 'Text',
		'category' => 'theatrum',
		'icon' => 'editor-quote',
		'description' => 'The quoted text, with an optional source URL.',
		'textdomain' => 'theatrum-blocks',
		'parent' => array(
			'theatrum/blockquote-advanced'
		),
		'attributes' => array(
			'citeUrl' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'anchor' => true,
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
				'text' => true
			)
		),
		'editorScript' => 'file:./index.js'
	),
	'carousel-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/carousel-item',
		'title' => 'Carousel Item',
		'category' => 'theatrum',
		'icon' => 'index-card',
		'description' => 'A single card in the carousel. Accepts any blocks, like a Group — commonly an image, heading, and text.',
		'textdomain' => 'theatrum-blocks',
		'parent' => array(
			'theatrum/carousel'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
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
			'shadow' => true
		),
		'editorScript' => 'file:./index.js'
	),
	'list-item-icon' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/list-item-icon',
		'textdomain' => 'theatrum-blocks',
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
			'theatrum/list-icons'
		),
		'usesContext' => array(
			'theatrum/iconSize',
			'theatrum/iconSizeUnit',
			'theatrum/iconPosition',
			'theatrum/iconSpacing',
			'theatrum/iconColor',
			'theatrum/hoverOnly'
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
		'name' => 'theatrum/list-item-thumbnail',
		'textdomain' => 'theatrum-blocks',
		'title' => 'Thumbnail List Item',
		'category' => 'theatrum',
		'description' => 'A single item in a thumbnail list: nested heading/paragraph content plus a thumbnail image.',
		'icon' => 'format-image',
		'keywords' => array(
			'thumbnail',
			'list',
			'item'
		),
		'parent' => array(
			'theatrum/list-thumbnail'
		),
		'allowedBlocks' => array(
			'core/heading',
			'core/paragraph',
			'core/group'
		),
		'usesContext' => array(
			'theatrum/imageSizeSlug'
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
			'thumbnailId' => array(
				'type' => 'number',
				'default' => 106035,
				'description' => 'Media library attachment ID; defaults to the blue-gradient placeholder image'
			),
			'thumbnailUrl' => array(
				'type' => 'string',
				'default' => 'https://chance-theater.s3.us-west-1.amazonaws.com/2026/06/blue-gradient.png'
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
	'popover-content' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/popover-content',
		'title' => 'Popover Content',
		'category' => 'theatrum',
		'icon' => 'visibility',
		'description' => 'The content shown inside the popover. Accepts any blocks, like a Group — commonly an image or video.',
		'textdomain' => 'theatrum-blocks',
		'parent' => array(
			'theatrum/popover'
		),
		'attributes' => array(
			'width' => array(
				'type' => 'string',
				'default' => '300'
			),
			'widthUnit' => array(
				'type' => 'string',
				'default' => 'px'
			)
		),
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'anchor' => true,
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
				'lineHeight' => true
			)
		),
		'editorScript' => 'file:./index.js'
	),
	'popover-trigger' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/popover-trigger',
		'title' => 'Popover Trigger',
		'category' => 'theatrum',
		'icon' => 'index-card',
		'description' => 'The content that reveals the popover on hover or tap. Accepts any blocks, like a Group.',
		'textdomain' => 'theatrum-blocks',
		'parent' => array(
			'theatrum/popover'
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
		'editorScript' => 'file:./index.js'
	),
	'slider-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/slider-item',
		'title' => 'Slider Item',
		'category' => 'theatrum',
		'icon' => 'index-card',
		'description' => 'A single slide in the slider. Accepts any blocks, like a Group — commonly an image and a caption.',
		'textdomain' => 'theatrum-blocks',
		'parent' => array(
			'theatrum/slider'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'anchor' => true,
			'className' => true,
			'customClassName' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradient' => true
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
			)
		),
		'editorScript' => 'file:./index.js'
	),
	'table-body' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Body',
		'name' => 'theatrum/table-body',
		'textdomain' => 'theatrum-blocks',
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
		'editorScript' => 'file:./index.js'
	),
	'table-caption' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Title',
		'name' => 'theatrum/table-caption',
		'textdomain' => 'theatrum-blocks',
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
		'editorScript' => 'file:./index.js'
	),
	'table-cell' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Cell',
		'name' => 'theatrum/table-cell',
		'textdomain' => 'theatrum-blocks',
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
			),
			'verticalAlign' => array(
				'type' => 'string',
				'enum' => array(
					'top',
					'middle',
					'bottom'
				),
				'default' => 'middle'
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
		'editorScript' => 'file:./index.js'
	),
	'table-footer' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Footer',
		'name' => 'theatrum/table-footer',
		'textdomain' => 'theatrum-blocks',
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
		'editorScript' => 'file:./index.js'
	),
	'table-header' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Header',
		'name' => 'theatrum/table-header',
		'textdomain' => 'theatrum-blocks',
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
		'editorScript' => 'file:./index.js'
	),
	'table-heading-cell' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Heading Cell',
		'name' => 'theatrum/table-heading-cell',
		'textdomain' => 'theatrum-blocks',
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
			),
			'verticalAlign' => array(
				'type' => 'string',
				'enum' => array(
					'top',
					'middle',
					'bottom'
				),
				'default' => 'middle'
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
		'editorScript' => 'file:./index.js'
	),
	'table-row' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'title' => 'Table Row',
		'name' => 'theatrum/table-row',
		'textdomain' => 'theatrum-blocks',
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
		'styles' => array(
			array(
				'name' => 'default',
				'label' => 'Default',
				'isDefault' => true
			),
			array(
				'name' => 'subsection-heading',
				'label' => 'Subsection Heading'
			)
		),
		'editorScript' => 'file:./index.js'
	),
	'tab' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/tab',
		'title' => 'Tab',
		'category' => 'theatrum',
		'icon' => 'index-card',
		'description' => 'A single tab: holds a Tab Heading and a Tab Content block. Used inside Tabs.',
		'textdomain' => 'theatrum-blocks',
		'parent' => array(
			'theatrum/tabs'
		),
		'allowedBlocks' => array(
			'theatrum/tab-heading',
			'theatrum/tab-content'
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
		'editorScript' => 'file:./index.js'
	),
	'tab-content' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/tab-content',
		'title' => 'Tab Content',
		'category' => 'theatrum',
		'icon' => 'index-card',
		'description' => 'The panel content for a tab. Accepts any blocks, like a Group.',
		'textdomain' => 'theatrum-blocks',
		'parent' => array(
			'theatrum/tab'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'anchor' => true,
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
				'lineHeight' => true
			)
		),
		'editorScript' => 'file:./index.js'
	),
	'tab-heading' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'theatrum/tab-heading',
		'title' => 'Tab Heading',
		'category' => 'theatrum',
		'icon' => 'editor-textcolor',
		'description' => 'The clickable label for a tab. Holds a paragraph or heading only.',
		'textdomain' => 'theatrum-blocks',
		'parent' => array(
			'theatrum/tab'
		),
		'allowedBlocks' => array(
			'core/paragraph',
			'core/heading'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'anchor' => true,
			'spacing' => array(
				'padding' => true,
				'blockGap' => true
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
			'normalTextColor' => array(
				'type' => 'string'
			),
			'normalBackgroundColor' => array(
				'type' => 'string'
			),
			'hoverTextColor' => array(
				'type' => 'string'
			),
			'hoverBackgroundColor' => array(
				'type' => 'string'
			),
			'activeTextColor' => array(
				'type' => 'string'
			),
			'activeBackgroundColor' => array(
				'type' => 'string'
			)
		),
		'editorScript' => 'file:./index.js'
	)
);
