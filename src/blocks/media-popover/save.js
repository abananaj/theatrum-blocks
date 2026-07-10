import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const {
		mediaUrl,
		mediaAlt,
		mediaType,
		linkType,
		linkUrl,
		linkPageId,
		linkTarget,
		width,
		widthUnit,
		alignment,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `align${
			alignment
				? alignment.charAt( 0 ).toUpperCase() + alignment.slice( 1 )
				: ''
		}`,
	} );

	// Generate unique ID for scoped CSS
	const blockId =
		blockProps.id ||
		`media-popover-${ Math.random().toString( 36 ).substr( 2, 9 ) }`;

	// Determine link target and href
	let linkHref = '';
	let linkTargetAttr = '';
	let linkRel = '';

	if ( linkType === 'url' ) {
		linkHref = linkUrl;
		linkTargetAttr = linkTarget ? '_blank' : '_self';
		linkRel = linkTarget ? 'noopener noreferrer' : '';
	} else if ( linkType === 'page' && linkPageId ) {
		linkHref = `?p=${ linkPageId }`;
		linkTargetAttr = linkTarget ? '_blank' : '_self';
	}

	const scopedCSS = `
		#${ blockId } .media-popover-trigger {
			cursor: pointer;
			position: relative;
			display: inline-block;
		}

		#${ blockId } .media-popover-content {
			position: absolute;
			bottom: 100%;
			left: 50%;
			transform: translateX(-50%);
			background: white;
			border: 1px solid #ddd;
			border-radius: 8px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			padding: 12px;
			margin-bottom: 10px;
			width: ${ width }${ widthUnit };
			opacity: 0;
			visibility: hidden;
			transition: opacity 0.3s ease, visibility 0.3s ease;
			z-index: 1000;
			pointer-events: none;
		}

		#${ blockId } .media-popover-trigger:hover .media-popover-content {
			opacity: 1;
			visibility: visible;
			pointer-events: auto;
		}

		#${ blockId } .media-popover-content::after {
			content: '';
			position: absolute;
			top: 100%;
			left: 50%;
			transform: translateX(-50%);
			border: 6px solid transparent;
			border-top-color: #ddd;
		}

		#${ blockId } .media-popover-content::before {
			content: '';
			position: absolute;
			top: 100%;
			left: 50%;
			transform: translateX(-50%);
			border: 5px solid transparent;
			border-top-color: white;
			margin-left: -5px;
		}

		#${ blockId } .media-popover-content img,
		#${ blockId } .media-popover-content video {
			width: 100%;
			height: auto;
			display: block;
			border-radius: 4px;
		}
	`;

	return (
		<div { ...blockProps } id={ blockId }>
			<style>{ scopedCSS }</style>
			<div
				className="media-popover-trigger"
				style={ { display: 'inline-block' } }
			>
				{ linkHref ? (
					<a
						href={ linkHref }
						target={ linkTargetAttr }
						rel={ linkRel }
						className="media-popover-trigger-inner"
					>
						<InnerBlocks.Content />
					</a>
				) : (
					<div className="media-popover-trigger-inner">
						<InnerBlocks.Content />
					</div>
				) }
				{ mediaUrl && (
					<div className="media-popover-content">
						{ mediaType === 'video' ? (
							<video
								src={ mediaUrl }
								controls
								style={ {
									width: '100%',
									height: 'auto',
									display: 'block',
									borderRadius: '4px',
								} }
							/>
						) : (
							<img
								src={ mediaUrl }
								alt={ mediaAlt || 'Popover media' }
								style={ {
									width: '100%',
									height: 'auto',
									display: 'block',
									borderRadius: '4px',
								} }
							/>
						) }
					</div>
				) }
			</div>
		</div>
	);
}
