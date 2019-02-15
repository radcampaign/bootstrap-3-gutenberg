<?php
/*
Plugin Name: Bootstrap 3 Gutenberg Blocks
Plugin URI:
Description: Simple blocks for adding Bootstrap 3 features to the gutenberg editor
Author: Rad Campaign
Version: 0.0
Author URI: http://radcampaign.com
 */
namespace BOOTSTRAP_4_GUTENBERG;

class Loader {

	/**
	 * Our plugin version
	 * @var string
	 */
	protected $version = '0.0';

	/**
	 * For where our distribution files are
	 * @var string
	 */
	protected $distributionPath = 'dist';

	/**
	 * Suffix used for registering script handles
	 * @var string
	 */
	protected $tagPrefix = 'radBlocks';

	/**
	 * Storage for our plugin url
	 * @var string
	 */
	protected $plugin_url = '';

	/**
	 * Storage for our plugin path
	 * @var string
	 */
	protected $path = '';

	/**
	 * Singleton storage for our class instance
	 * @var null
	 */
	protected static $instance = null;

	/**
	 * result of reading our manifest
	 * @var array
	 */
	protected $assetMap = [];

	/**
	 * Storage for our registered asset handles
	 * @var array
	 */
	protected $registeredAssets = [];

	protected $registeredStyleAssets = [];

	/**
	 * All of the scripts that we develop here will require these scripts
	 * @var array
	 */
	protected $scriptDeps = [
		'lodash',
		'wp-blocks',
		'wp-element',
		'wp-editor',
		'wp-compose'
	];

	/**
	 * Constructs our class
	 * @return static
	 */
	public function __construct() {
		$this->plugin_url = \plugin_dir_url(__FILE__);
		$this->path = dirname(__FILE__);

		// on construct lets register all of our assets
		$this->registerAssets();
	}

	/**
	 * Reads our manifest and finds the handles and the actual new files and saves
	 * their association in assetMap
	 * @return void
	 */
	protected function readManifest() {
		$manifest = join('/', [$this->path, $this->distributionPath, 'manifest.json']);
		if (file_exists($manifest)) {
			$this->assetMap = json_decode(file_get_contents($manifest), TRUE);
			// throw an error if json decode failed
			if (json_last_error() !== JSON_ERROR_NONE) {
				throw new \Exception('DECODING the manifest failed');
			}
			return;
		}

		// thorw an error if we could not find the manifest
		throw new \Exception('Could not find manifest');
	}

	/**
	 * Makes the file url
	 * @param  string $filename
	 * @return the plugin destination url of the script
	 */
	protected function makeDistributionFileUrl($filename = '') {
		return join('/', [$this->plugin_url, $this->distributionPath, $filename]);
	}

	/**
	 * makes the script handle by applying our suffix
	 * @param  string $script the string filename of the script
	 * @return string
	 */
	protected function prefixHandle($script = '') {
		return join('/', [$this->tagPrefix, $script]);
	}

	/**
	 * Registers our assets with our $registeredAssets storage and wordpress
	 * @return void
	 */
	public function registerAssets() {
		$this->readManifest();
		foreach ($this->assetMap as $handle => $file) {
			$handle = $this->prefixHandle($handle);
			$url = $this->makeDistributionFileUrl($file);

			// put js in registeredAssets and use wp_register_script
			if (strpos($file, '.js') !== false) {
				\wp_register_script($handle, $url, $this->scriptDeps, $this->version);
				$this->registeredAssets[] = $handle;
			}

			// put css in registeredStyleAssets and use wp_register_script
			if (strpos($file, '.css') !== false) {
				\wp_register_style($handle, $url, [], $this->version, 'all');
				$this->registeredStyleAssets[] = $handle;
			}
		}
	}

	/**
	 * Enqueues all of the assets registered
	 * @return [type] [description]
	 */
	public function enqueueAssets() {
		foreach ($this->registeredAssets as $handle) {
			\wp_enqueue_script($handle);
		}

		foreach ($this->registeredStyleAssets as $handle) {
			\wp_enqueue_style($handle);
		}
	}

	/**
	 * Initializes our plugin by registering our assets and then enqueuing them
	 * @return void
	 */
	public static function initialize() {
		$instance = self::getInstance();
		$instance->enqueueAssets();
	}

	/**
	 * Singleton construct to get our stored instance
	 * @return static
	 */
	protected static function getInstance() {
		if (is_null(self::$instance)) {
			self::$instance = new static();
		}

		return self::$instance;
	}

	/**
	 * Helper logging function for debugging
	 * @return void
	 */
	private function log() {
		$args = func_get_args();
		if (!empty($args)) {
			foreach ($args as $arg) {
				if (!is_string($arg)) {
					error_log(json_encode($arg, JSON_PRETTY_PRINT));
					continue;
				}

				error_log($arg);
			}
			return;
		}

		error_log('[]');
	}
}

add_action('enqueue_block_editor_assets', function () {
	Loader::initialize();
});

/**
 * Adds a new category
 */
add_filter('block_categories', function ($categories) {
	return array_merge($categories, [
		[
			'slug' => 'bootstrap-blocks',
			'title' => __('Bootstrap Blocks', 'bootstrap-blocks')
		]
	]);
}, 10);
