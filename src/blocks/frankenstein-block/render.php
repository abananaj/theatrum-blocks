<?php
/**
 * Render.php - Frankenstein Block
 *
 * Combines:
 * - Dynamic rendering (server-side PHP)
 * - Inner blocks (nested content)
 * - Block supports (styling)
 * - Interactivity (client-side behavior)
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 *
 * @package block-development-examples
 */

// Generates a unique id for aria-controls.
$unique_id = wp_unique_id( 'frankenstein-' );

// Adds the global state for interactivity.
wp_interactivity_state(
	'frankenstein-block',
	array(
		'isDark'    => false,
		'darkText'  => esc_html__( 'Switch to Light', 'block-development-examples' ),
		'lightText' => esc_html__( 'Switch to Light', 'block-development-examples' ),
		'themeText' => esc_html__( 'Switch to Dark', 'block-development-examples' ),
	)
);

?>

<?php /* @phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped */ ?>
<div
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="frankenstein-block"
	<?php echo wp_interactivity_data_wp_context( array( 'isOpen' => false ) ); ?>
	data-wp-watch="callbacks.logIsOpen"
	data-wp-class--dark-theme="state.isDark"
>
	<button
		data-wp-on--click="actions.toggleTheme"
		data-wp-text="state.themeText"
		style="margin-bottom: 1rem;"
	></button>

	<button
		data-wp-on--click="actions.toggleOpen"
		data-wp-bind--aria-expanded="context.isOpen"
		aria-controls="<?php echo esc_attr( $unique_id ); ?>"
		style="margin-right: 0.5rem;"
	>
		<?php esc_html_e( 'Toggle Content', 'block-development-examples' ); ?>
	</button>

	<?php if ( ! empty( $attributes['content'] ) ) : ?>
		<p>
			<?php echo wp_kses_post( $attributes['content'] ); ?>
		</p>
	<?php endif; ?>

	<div
		id="<?php echo esc_attr( $unique_id ); ?>"
		data-wp-bind--hidden="!context.isOpen"
	>
		<?php echo wp_kses_post( $content ); ?>
	</div>
</div>
<?php /* @phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped */ ?>
