import { registerBlockType } from '@wordpress/blocks';
import {
  InspectorControls,
  useBlockProps,
} from '@wordpress/block-editor';
import {
  PanelBody,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

const TAXONOMY_OPTIONS = [
  { label: __('Season', 'theatrum-blocks'), value: 'season' },
  { label: __('Series', 'theatrum-blocks'), value: 'series' },
  { label: __('Tags', 'theatrum-blocks'), value: 'post_tag' },
];

const TAXONOMY_PARAM_MAP = {
  season: 'season',
  series: 'series',
  post_tag: 'tag',
};

const TAXONOMY_LABEL_MAP = {
  season: __('Season', 'theatrum-blocks'),
  series: __('Series', 'theatrum-blocks'),
  post_tag: __('Tag', 'theatrum-blocks'),
};

function Edit({ attributes, setAttributes }) {
  const {
    filterType,
    taxonomy,
    paramName,
    label,
    showLabel,
    allLabel,
    layout,
  } = attributes;

  const blockProps = useBlockProps({
    className: `query-filter query-filter--${layout}`,
  });

  function handleFilterTypeChange(value) {
    setAttributes({ filterType: value });
  }

  function handleTaxonomyChange(value) {
    setAttributes({
      taxonomy: value,
      paramName: TAXONOMY_PARAM_MAP[value] ?? value,
      label: TAXONOMY_LABEL_MAP[value] ?? label,
    });
  }

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Filter Settings', 'theatrum-blocks')}>
          <SelectControl
            label={__('Filter Type', 'theatrum-blocks')}
            value={filterType}
            options={[
              {
                label: __('Taxonomy', 'theatrum-blocks'),
                value: 'taxonomy',
              },
              {
                label: __('Sort Order', 'theatrum-blocks'),
                value: 'orderby',
              },
            ]}
            onChange={handleFilterTypeChange}
          />

          {filterType === 'taxonomy' && (
            <SelectControl
              label={__('Taxonomy', 'theatrum-blocks')}
              value={taxonomy}
              options={TAXONOMY_OPTIONS}
              onChange={handleTaxonomyChange}
            />
          )}

          <TextControl
            label={__('Label', 'theatrum-blocks')}
            value={label}
            onChange={(value) =>
              setAttributes({ label: value })
            }
          />

          <ToggleControl
            label={__('Show label', 'theatrum-blocks')}
            checked={showLabel}
            onChange={(value) =>
              setAttributes({ showLabel: value })
            }
          />

          {filterType === 'taxonomy' && (
            <TextControl
              label={__('"All" option label', 'theatrum-blocks')}
              value={allLabel}
              onChange={(value) =>
                setAttributes({ allLabel: value })
              }
            />
          )}

          <TextControl
            label={__('URL parameter name', 'theatrum-blocks')}
            value={paramName}
            onChange={(value) =>
              setAttributes({ paramName: value })
            }
            help={__('The GET param used in the URL, e.g. ?season=2024', 'theatrum-blocks')}
          />

          <SelectControl
            label={__('Layout', 'theatrum-blocks')}
            value={layout}
            options={[
              {
                label: __('Horizontal', 'theatrum-blocks'),
                value: 'horizontal',
              },
              {
                label: __('Vertical', 'theatrum-blocks'),
                value: 'vertical',
              },
            ]}
            onChange={(value) =>
              setAttributes({ layout: value })
            }
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="query-filter__preview">
          <span className="query-filter__preview-icon">⚙</span>
          <span className="query-filter__preview-text">
            {filterType === 'orderby'
              ? __('Sort Order filter', 'theatrum-blocks')
              : `${label} filter (${taxonomy})`}
          </span>
        </div>
      </div>
    </>
  );
}

registerBlockType(metadata.name, {
  edit: Edit,
  save: () => null,
});
