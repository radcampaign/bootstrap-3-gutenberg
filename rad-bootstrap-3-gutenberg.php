<?php
/*
Plugin Name: Rad Bootstrap 3 Gutenberg Blocks
Plugin URI:
Description: Simple blocks for adding Bootstrap 3 features to the gutenberg editor
Author: Rad Campaign
Version: 1.0.0
Author URI: http://radcampaign.com
textdomain: rad-bootstrap-block
 */
namespace RAD_BOOTSTRAP_3;

defined( 'ABSPATH' ) or die( 'Direct Access Not Allowed' );

/**
 * Provides a way for our classes to find the url of the plugin
 * @see  Asset_Loader
 * @return string
 */
function get_plugin_url() {
	return \plugin_dir_url(__FILE__);
}

/**
 * Provides a way for our classes to find a way to the root plugin directory
 * @see  Asset_loader
 * @return string
 */
function get_plugin_path() {
	return \plugin_dir_path(__FILE__);
}

/**
 * provides an easy way to retrieve the text domain of the plugin
 * @return string
 */
function get_text_domain() {
	return 'rad-bootstrap-block';
}

require_once( get_plugin_path() . '/lib/autoload.php');

/*
  Set up our settings page and settings
 */
$settings = Settings::getInstance();

add_action('admin_menu', function () use ( $settings ) {
	$settings->settingsMenu();
});

add_action('admin_init', function () use ( $settings ) {
	$settings->settingsInit();
});

/**
 * Load all of our assets when the block enqueue action is called
 */
add_action( 'enqueue_block_editor_assets', function () {
	$loader = Asset_Loader::initialize();
	$loader->enqueueJS( 'bootstrap-block-editor.js' );
	$loader->enqueueStyle( 'bootstrap-block-editor.css' );

	// if we are to load the bootstrap styles in the editor, this will
	// do that.
	if ( Settings::loadBootstrapInEditor() ) {
		$loader->enqueueStyle( 'bootstrap-styles.css' );
	}
});

/**
 * If load on the front end, lets load our bootstrap styles
 * on the front end
 */
if ( Settings::loadBootstrapOnFrontEnd() ) {
	add_action( 'wp_enqueue_scripts', function () {
		$loader = Asset_Loader::initialize();
		$loader->enqueueStyle( 'bootstrap-styles.css' );
	});
}

/**
 * Adds a new block category to the block editor
 */
add_filter('block_categories', function ( $categories ) {
	return array_merge($categories, [
		[
			'slug'  =>  'bootstrap-blocks',
			'title' => __('Bootstrap Blocks', 'rad-bootstrap-block')
		]
	]);
}, 10);
