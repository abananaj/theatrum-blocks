/**
 * Shared "Card Image" inspector controls — used by theatrum/card-expanding and
 * theatrum/card-scroll, whose contents are nested blocks but whose image is a block attribute so
 * it can be sized independently of the content flow.
 *
 * Every setting writes a CSS custom property via get-card-image-vars.js rather than a class, so
 * each block's stylesheet decides what the value means (card-scroll uses the width to drive its
 * reveal, for instance). Consumers supply their own defaults; `showAspectRatio` exists because a
 * card whose panel width animates from zero can't take a ratio-derived height — see card-scroll's
 * README.
 */
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import {
	PanelBody,
	Button,
	TextControl,
	SelectControl,
	ToggleControl,
	FocalPointPicker,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const UNIT_OPTIONS = [
	{ label: '%', value: '%' },
	{ label: 'px', value: 'px' },
	{ label: 'em', value: 'em' },
	{ label: 'rem', value: 'rem' },
];

// Blocks whose height has nothing to resolve a percentage against pass their own list — see the
// `heightUnits` prop.
export const ABSOLUTE_UNIT_OPTIONS = UNIT_OPTIONS.filter(
	( unit ) => unit.value !== '%'
);

const ASPECT_RATIO_OPTIONS = [
	{ label: __( 'Auto (use Height)', 'theatrum-blocks' ), value: 'auto' },
	{ label: __( 'Square (1:1)', 'theatrum-blocks' ), value: '1' },
	{ label: __( 'Standard (4:3)', 'theatrum-blocks' ), value: '4/3' },
	{ label: __( 'Portrait (3:4)', 'theatrum-blocks' ), value: '3/4' },
	{ label: __( 'Widescreen (16:9)', 'theatrum-blocks' ), value: '16/9' },
	{ label: __( 'Vertical (9:16)', 'theatrum-blocks' ), value: '9/16' },
];

const OBJECT_FIT_OPTIONS = [
	{ label: __( 'Cover (crop to fill)', 'theatrum-blocks' ), value: 'cover' },
	{
		label: __( 'Contain (fit within, may letterbox)', 'theatrum-blocks' ),
		value: 'contain',
	},
	{ label: __( 'Fill (stretch to fill)', 'theatrum-blocks' ), value: 'fill' },
];

/**
 * @param {Object}   props
 * @param {Object}   props.attributes        Block attributes.
 * @param {Function} props.setAttributes     Block `setAttributes`.
 * @param {Object}   props.defaults          The block's own attribute defaults, used for "reset
 *                                           all" and for deciding what counts as a changed value.
 * @param {boolean}  [props.showAspectRatio] Offer the Aspect Ratio control (default true).
 * @param {boolean}  [props.showWidth]       Offer the Width control (default true). A block whose
 *                                           image always fills its frame edge-to-edge — nothing
 *                                           for a narrower image to do — passes `false`.
 * @param {Array}    [props.heightUnits]     Units the Height control offers. Defaults to all of
 *                                           them; a block whose height must be definite passes
 *                                           ABSOLUTE_UNIT_OPTIONS instead.
 * @param {string}   [props.heightHelp]      Help text for Height, since what the height governs
 *                                           differs per block.
 */
export default function CardImageControls( {
	attributes,
	setAttributes,
	defaults,
	showAspectRatio = true,
	showWidth = true,
	heightHelp,
	heightUnits = UNIT_OPTIONS,
} ) {
	const {
		useFeaturedImage,
		mediaId,
		mediaUrl,
		mediaAlt,
		imageSizeSlug,
		imageWidth,
		imageWidthUnit,
		imageHeight,
		imageHeightUnit,
		imageAspectRatio,
		imageObjectFit,
		imageFocalPoint,
	} = attributes;

	// Registered WP image sizes (Thumbnail/Medium/Large/Full + custom), the same source
	// core/image's own resolution dropdown uses.
	const imageSizeOptions = useSelect( ( select ) => {
		const sizes = select( blockEditorStore ).getSettings().imageSizes || [];
		return sizes.map( ( { slug, name } ) => ( {
			label: name,
			value: slug,
		} ) );
	}, [] );

	// These are static blocks, so the chosen resolution has to be baked into `mediaUrl` at edit
	// time (there's no render.php to resolve it later) — re-resolve whenever either the
	// attachment or the requested size changes. Same approach as theatrum/list-item-thumbnail.
	const media = useSelect(
		( select ) => ( mediaId ? select( 'core' ).getMedia( mediaId ) : null ),
		[ mediaId ]
	);

	useEffect( () => {
		if ( ! media ) {
			return;
		}
		const sizes = media.media_details?.sizes || {};
		const resolvedUrl =
			sizes[ imageSizeSlug ]?.source_url || media.source_url || mediaUrl;
		if ( resolvedUrl && resolvedUrl !== mediaUrl ) {
			setAttributes( { mediaUrl: resolvedUrl } );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ media, imageSizeSlug ] );

	const onSelectImage = ( selected ) => {
		const sizeData =
			selected.sizes?.[ imageSizeSlug ] || selected.sizes?.full;
		setAttributes( {
			mediaId: selected.id,
			mediaUrl: sizeData?.url || selected.url,
			mediaAlt: selected.alt || '',
		} );
	};

	const clearImage = () =>
		setAttributes( { mediaId: 0, mediaUrl: '', mediaAlt: '' } );

	// Height is meaningless while a ratio is deriving it, so it hides rather than sitting there
	// having no effect. Blocks without a ratio control always show it.
	const showHeight = ! showAspectRatio || imageAspectRatio === 'auto';

	// A unit a block no longer offers is still kept in the list while it's the one in use, so
	// existing content shows what it's actually set to rather than an empty select.
	const heightUnitOptions = heightUnits.some(
		( unit ) => unit.value === imageHeightUnit
	)
		? heightUnits
		: [
				...heightUnits,
				{ label: imageHeightUnit, value: imageHeightUnit },
		  ];

	// With the featured image on, whatever is picked here is only the fallback for posts that
	// haven't got one — say so on the button rather than in a note nobody reads.
	let mediaButtonLabel;
	if ( useFeaturedImage ) {
		mediaButtonLabel = mediaUrl
			? __( 'Replace Fallback Image', 'theatrum-blocks' )
			: __( 'Select Fallback Image', 'theatrum-blocks' );
	} else {
		mediaButtonLabel = mediaUrl
			? __( 'Replace Image', 'theatrum-blocks' )
			: __( 'Select Image', 'theatrum-blocks' );
	}

	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Card Image', 'theatrum-blocks' ) }
				initialOpen={ true }
			>
				<ToggleControl
					label={ __(
						"Use the post's featured image",
						'theatrum-blocks'
					) }
					help={ __(
						'Shows the featured image of the post this card is rendering — each queried post in turn inside a Query Loop. Posts with no featured image fall back to the image selected below.',
						'theatrum-blocks'
					) }
					checked={ !! useFeaturedImage }
					onChange={ ( value ) =>
						setAttributes( { useFeaturedImage: value } )
					}
				/>

				<MediaUploadCheck>
					<MediaUpload
						onSelect={ onSelectImage }
						allowedTypes={ [ 'image' ] }
						value={ mediaId }
						render={ ( { open } ) => (
							<Button
								onClick={ open }
								variant="primary"
								style={ {
									width: '100%',
									justifyContent: 'center',
									marginBottom: '8px',
								} }
							>
								{ mediaButtonLabel }
							</Button>
						) }
					/>
				</MediaUploadCheck>

				{ mediaUrl && (
					<>
						<img
							src={ mediaUrl }
							alt={ mediaAlt }
							style={ {
								maxWidth: '100%',
								height: 'auto',
								borderRadius: '4px',
								marginBottom: '8px',
							} }
						/>
						<TextControl
							label={ __( 'Alt Text', 'theatrum-blocks' ) }
							help={ __(
								'Describe the image for screen readers. Leave empty if it is purely decorative.',
								'theatrum-blocks'
							) }
							value={ mediaAlt }
							onChange={ ( value ) =>
								setAttributes( { mediaAlt: value } )
							}
						/>
						<Button
							onClick={ clearImage }
							variant="secondary"
							isDestructive
							style={ {
								width: '100%',
								justifyContent: 'center',
							} }
						>
							{ __( 'Remove Image', 'theatrum-blocks' ) }
						</Button>
					</>
				) }
			</PanelBody>

			<ToolsPanel
				label={ __( 'Image Size & Fit', 'theatrum-blocks' ) }
				resetAll={ () =>
					setAttributes( {
						imageSizeSlug: defaults.imageSizeSlug,
						imageWidth: defaults.imageWidth,
						imageWidthUnit: defaults.imageWidthUnit,
						imageHeight: defaults.imageHeight,
						imageHeightUnit: defaults.imageHeightUnit,
						imageAspectRatio: defaults.imageAspectRatio,
						imageObjectFit: defaults.imageObjectFit,
						imageFocalPoint: undefined,
					} )
				}
			>
				{ showWidth && (
					<ToolsPanelItem
						hasValue={ () => imageWidth !== defaults.imageWidth }
						label={ __( 'Width', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( {
								imageWidth: defaults.imageWidth,
								imageWidthUnit: defaults.imageWidthUnit,
							} )
						}
						isShownByDefault={ true }
					>
						<div
							style={ {
								display: 'flex',
								gap: '8px',
								alignItems: 'flex-end',
							} }
						>
							<TextControl
								label={ __( 'Width', 'theatrum-blocks' ) }
								type="number"
								value={ imageWidth }
								onChange={ ( value ) =>
									setAttributes( { imageWidth: value } )
								}
								style={ { flex: 1 } }
							/>
							<SelectControl
								label={ __( 'Unit', 'theatrum-blocks' ) }
								hideLabelFromVision
								value={ imageWidthUnit }
								options={ UNIT_OPTIONS }
								onChange={ ( value ) =>
									setAttributes( { imageWidthUnit: value } )
								}
								style={ { width: '80px' } }
							/>
						</div>
					</ToolsPanelItem>
				) }

				{ showAspectRatio && (
					<ToolsPanelItem
						hasValue={ () =>
							imageAspectRatio !== defaults.imageAspectRatio
						}
						label={ __( 'Aspect Ratio', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( {
								imageAspectRatio: defaults.imageAspectRatio,
							} )
						}
						isShownByDefault={ true }
					>
						<SelectControl
							label={ __( 'Aspect Ratio', 'theatrum-blocks' ) }
							help={ __(
								'The shape the image is cropped to. Choose Auto to set an explicit height instead.',
								'theatrum-blocks'
							) }
							value={ imageAspectRatio }
							options={ ASPECT_RATIO_OPTIONS }
							onChange={ ( value ) =>
								setAttributes( { imageAspectRatio: value } )
							}
						/>
					</ToolsPanelItem>
				) }

				{ showHeight && (
					<ToolsPanelItem
						hasValue={ () => imageHeight !== defaults.imageHeight }
						label={ __( 'Height', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( {
								imageHeight: defaults.imageHeight,
								imageHeightUnit: defaults.imageHeightUnit,
							} )
						}
						isShownByDefault={ true }
					>
						<div
							style={ {
								display: 'flex',
								gap: '8px',
								alignItems: 'flex-end',
							} }
						>
							<TextControl
								label={ __( 'Height', 'theatrum-blocks' ) }
								help={ heightHelp }
								type="number"
								value={ imageHeight }
								onChange={ ( value ) =>
									setAttributes( { imageHeight: value } )
								}
								style={ { flex: 1 } }
							/>
							<SelectControl
								label={ __( 'Unit', 'theatrum-blocks' ) }
								hideLabelFromVision
								value={ imageHeightUnit }
								options={ heightUnitOptions }
								onChange={ ( value ) =>
									setAttributes( { imageHeightUnit: value } )
								}
								style={ { width: '80px' } }
							/>
						</div>
					</ToolsPanelItem>
				) }

				<ToolsPanelItem
					hasValue={ () =>
						imageObjectFit !== defaults.imageObjectFit
					}
					label={ __( 'Object Fit', 'theatrum-blocks' ) }
					onDeselect={ () =>
						setAttributes( {
							imageObjectFit: defaults.imageObjectFit,
						} )
					}
					isShownByDefault={ true }
				>
					<SelectControl
						label={ __( 'Object Fit', 'theatrum-blocks' ) }
						value={ imageObjectFit }
						options={ OBJECT_FIT_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { imageObjectFit: value } )
						}
					/>
				</ToolsPanelItem>

				{ mediaUrl && imageObjectFit !== 'fill' && (
					<ToolsPanelItem
						hasValue={ () => !! imageFocalPoint }
						label={ __( 'Focal Point', 'theatrum-blocks' ) }
						onDeselect={ () =>
							setAttributes( { imageFocalPoint: undefined } )
						}
						isShownByDefault={ true }
					>
						<FocalPointPicker
							label={ __( 'Focal Point', 'theatrum-blocks' ) }
							help={ __(
								'Which part of the image to keep in frame when it is cropped.',
								'theatrum-blocks'
							) }
							url={ mediaUrl }
							value={ imageFocalPoint || { x: 0.5, y: 0.5 } }
							onChange={ ( value ) =>
								setAttributes( { imageFocalPoint: value } )
							}
						/>
					</ToolsPanelItem>
				) }

				<ToolsPanelItem
					hasValue={ () => imageSizeSlug !== defaults.imageSizeSlug }
					label={ __( 'Resolution', 'theatrum-blocks' ) }
					onDeselect={ () =>
						setAttributes( {
							imageSizeSlug: defaults.imageSizeSlug,
						} )
					}
					isShownByDefault={ true }
				>
					<SelectControl
						label={ __( 'Resolution', 'theatrum-blocks' ) }
						help={ __(
							'The size of image file to load — smaller sizes load faster.',
							'theatrum-blocks'
						) }
						value={ imageSizeSlug }
						options={ imageSizeOptions }
						onChange={ ( value ) =>
							setAttributes( { imageSizeSlug: value } )
						}
					/>
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);
}
