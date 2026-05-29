import { useBlockProps } from '@wordpress/block-editor';

/**
 * v1: Save before inline styles were moved to CSS.
 * All layout and transition styles were rendered as inline styles;
 * animationSpeed was stored as a data attribute instead of a CSS variable.
 */
const v1 = {
	save( { attributes } ) {
		const {
			items,
			thumbnailWidth,
			thumbnailWidthUnit,
			thumbnailHeight,
			thumbnailHeightUnit,
			itemHeight,
			itemHeightUnit,
			thumbnailPosition,
			animationSpeed,
		} = attributes;

		// Old save passed the block class name explicitly, resulting in it
		// appearing twice in the output (once from useBlockProps.save(), once
		// from the className prop). The deprecated entry must reproduce that
		// so block validation can match stored content.
		const blockProps = useBlockProps.save( {
			className: `wp-block-chance-thumbnail-list thumbnail-position-${ thumbnailPosition }`,
			'data-animation-speed': animationSpeed,
		} );

		if ( ! items || items.length === 0 ) {
			return null;
		}

		return (
			<div { ...blockProps }>
				<div
					className="thumbnail-list-wrapper"
					style={ {
						display: 'grid',
						gridTemplateColumns: 'auto 1fr',
						gap: '2rem',
						alignItems: 'start',
					} }
				>
					<div className="list-items">
						{ items.map( ( item, index ) => (
							<div
								key={ item.id }
								className="list-item"
								data-index={ index }
								style={ {
									height: `${ itemHeight }${ itemHeightUnit }`,
									padding: '1rem',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									borderBottom: '1px solid currentColor',
									cursor: 'pointer',
									transition: `color ${ animationSpeed }s ease`,
								} }
							>
								<div
									className="item-title"
									style={ { fontWeight: 'bold', fontSize: '1.1rem' } }
								>
									{ item.title }
								</div>
								{ item.description && (
									<div
										className="item-description"
										style={ {
											fontSize: '0.9rem',
											opacity: 0.7,
											marginTop: '0.25rem',
										} }
									>
										{ item.description }
									</div>
								) }
							</div>
						) ) }
					</div>

					<div
						className="thumbnail-container"
						style={ {
							width: `${ thumbnailWidth }${ thumbnailWidthUnit }`,
							height: `${ thumbnailHeight }${ thumbnailHeightUnit }`,
							position: 'relative',
							perspective: '1000px',
							transformStyle: 'preserve-3d',
						} }
					>
						{ items.map( ( item, index ) => (
							<img
								key={ `${ item.id }-thumbnail` }
								className={ `thumbnail thumbnail-${ index }` }
								src={ item.thumbnailUrl }
								alt={ item.thumbnailAlt }
								data-index={ index }
								style={ {
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									position: 'absolute',
									top: 0,
									left: 0,
									backfaceVisibility: 'hidden',
									transition: `transform ${ animationSpeed }s ease`,
								} }
							/>
						) ) }
					</div>
				</div>
			</div>
		);
	},
};

export default [ v1 ];
