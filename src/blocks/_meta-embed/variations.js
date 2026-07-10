import { __ } from '@wordpress/i18n';

/**
 * Block variations for Meta Embed.
 *
 * youtube: reads a meta key whose value is a YouTube URL,
 *          embeds via youtube-nocookie.com iframe.
 */
const variations = [
	{
		name: 'meta-youtube',
		title: __( 'YouTube Video', 'theatrum-blocks' ),
		description: __(
			'Embed a YouTube video from a URL stored in post meta.',
			'theatrum-blocks'
		),
		icon: 'video-alt3',
		attributes: { embedType: 'youtube' },
		scope: [ 'inserter', 'transform' ],
	},
];

export default variations;
