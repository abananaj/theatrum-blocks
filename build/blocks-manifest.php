<?php
// This file is generated. Do not modify it manually.
return array(
	'artist-credits' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/artist-credits',
		'title' => 'Artist Credits',
		'category' => 'widgets',
		'description' => 'Display a list of artist credits for a production',
		'textdomain' => 'artist-credits',
		'icon' => 'list-view',
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
			
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'block-dynamic' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'create-block/block-dynamic',
		'version' => '0.1.0',
		'title' => 'Block Dynamic',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Example dynamic block scaffolded with Create Block tool.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'block-dynamic',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'block-static' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'create-block/block-static',
		'version' => '0.1.0',
		'title' => 'Static Block',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Example static block scaffolded with Create Block tool.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'block-static',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'board-member' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/board-member',
		'title' => 'Board Member',
		'category' => 'widgets',
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
		'category' => 'common',
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
		'category' => 'widgets',
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
		'category' => 'widgets',
		'description' => 'Display a featured production or event as a card with featured image background and overlaid title',
		'icon' => 'cover-image',
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
			'openInNewWindow' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'innerBlocks' => array(
			
		),
		'textdomain' => 'cover-card',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'meta-button' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-button',
		'title' => 'Meta Button',
		'category' => 'widgets',
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
		'category' => 'chance',
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
			)
		),
		'textdomain' => 'meta-date',
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
		'category' => 'widgets',
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
	'meta-gallery' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-gallery',
		'title' => 'Meta Gallery',
		'category' => 'media',
		'description' => 'Display a gallery of images from a post meta or ACF gallery field by entering a key',
		'icon' => 'format-gallery',
		'supports' => array(
			'html' => false,
			'align' => array(
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
			'keyInput' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageSize' => array(
				'type' => 'string',
				'default' => 'large'
			),
			'columns' => array(
				'type' => 'number',
				'default' => 3
			),
			'linkTo' => array(
				'type' => 'string',
				'default' => 'none'
			),
			'imageCrop' => array(
				'type' => 'boolean',
				'default' => true
			),
			'showCaption' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'textdomain' => 'meta-gallery',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'meta-image' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-image',
		'title' => 'Meta Image',
		'category' => 'media',
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
	'meta-repeater' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/meta-repeater',
		'title' => 'Meta Repeater',
		'category' => 'chance',
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
		'category' => 'chance',
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
		'category' => 'common',
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
				'default' => 'Show More'
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
	'production-credits' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/production-credits',
		'title' => 'Production Credits',
		'category' => 'widgets',
		'description' => 'Display credits for the current production',
		'icon' => 'list-view',
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
			
		),
		'textdomain' => 'meta-date',
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
		'category' => 'widgets',
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
	'production-quotes' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/production-quotes',
		'title' => 'Production Quotes',
		'category' => 'widgets',
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
	'site-option' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/site-option',
		'title' => 'Site Option',
		'category' => 'widgets',
		'description' => 'Display a value from the WordPress options table',
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
			)
		),
		'textdomain' => 'site-option',
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
		'category' => 'widgets',
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
			)
		),
		'textdomain' => 'staff-member',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'term-meta' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'chance/term-meta',
		'title' => 'Term Meta',
		'category' => 'chance',
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
			)
		),
		'textdomain' => 'term-meta',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	)
);
