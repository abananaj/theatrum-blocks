const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

// Extra standalone editor scripts (not blocks) to include in the script build.
const extraEntries = {
	'meta-variations': path.resolve( __dirname, 'src/meta-variations.js' ),
	'popup-trigger-variation': path.resolve(
		__dirname,
		'src/popup-trigger-variation.js'
	),
	'style-book': path.resolve( __dirname, 'src/style-book.js' ),
	'block-color': path.resolve( __dirname, 'src/block-color.js' ),
	formats: path.resolve( __dirname, 'src/formats/index.js' ),
};

function withExtraEntries( config ) {
	const original = config.entry;
	return {
		...config,
		entry: async () => {
			const resolved =
				typeof original === 'function' ? await original() : original;
			return { ...resolved, ...extraEntries };
		},
	};
}

// With --experimental-modules, defaultConfig is [scriptConfig, moduleConfig].
// We only add the extras to scriptConfig (index 0); moduleConfig handles ES modules.
if ( Array.isArray( defaultConfig ) ) {
	module.exports = [
		withExtraEntries( defaultConfig[ 0 ] ),
		defaultConfig[ 1 ],
	];
} else {
	module.exports = withExtraEntries( defaultConfig );
}
