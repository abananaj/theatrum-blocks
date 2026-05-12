import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, BlockControls, MediaUpload, MediaPlaceholder, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, Button, ToolbarButton, ToggleControl, SelectControl, RangeControl, ToolbarGroup } from '@wordpress/components';
import { useState, Fragment } from '@wordpress/element';
import edit from './edit';
import save from './save';
import './editor.scss';

registerBlockType('chance/cover-carousel', {
  title: 'Cover Carousel',
  icon: 'images-alt2',
  category: 'common',
  attributes: {
    items: {
      type: 'array',
      default: []
    },
    currentSlide: {
      type: 'number',
      default: 0
    },
    minHeight: {
      type: 'number',
      default: 300
    },
    minHeightUnit: {
      type: 'string',
      default: 'px'
    },
    contentPosition: {
      type: 'string',
      default: 'center'
    },
    showIndicators: {
      type: 'boolean',
      default: true
    },
    indicatorStyle: {
      type: 'string',
      default: 'dots'
    },
    showArrows: {
      type: 'boolean',
      default: true
    },
    arrowStyle: {
      type: 'string',
      default: 'light'
    },
    autoplay: {
      type: 'boolean',
      default: false
    },
    autoplaySpeed: {
      type: 'number',
      default: 5000
    },
    transitionType: {
      type: 'string',
      default: 'fade'
    },
    transitionSpeed: {
      type: 'number',
      default: 500
    }
  },
  edit,
  save
});
