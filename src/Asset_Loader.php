<?php
/**
 * Loads all of our project assets
 */
namespace RAD_BOOTSTRAP_3;

class Asset_Loader {
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

	/**
	 * Storage for our registerd style handles
	 * @var array
	 */
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
		'wp-compose',
		'wp-viewport',
		'wp-data',
		'wp-keycodes',
		'wp-components'
	];

	/**
	 * Constructs our class
	 * @return static
	 */
	public function __construct() {
		$this->plugin_url = get_plugin_url();
		$this->path = get_plugin_path();

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
		if ( file_exists($manifest) ) {
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
	protected function prefixHandle( $script = '' ) {
		return join('/', [$this->tagPrefix, $script]);
	}

	/**
	 * Public accessor for prefix handle
	 * @see prefixHandle
	 */
	public function getAssetHandle( $script = '' ) {
		return $this->prefixHandle( $script );
	}

	/**
	 * Registers our assets with our $registeredAssets storage and wordpress
	 * @return void
	 */
	public function registerAssets() {
		$this->readManifest();
		foreach ( $this->assetMap as $handle => $file ) {
			$handle = $this->prefixHandle($handle);
			$url = $this->makeDistributionFileUrl($file);

			// put js in registeredAssets and use wp_register_script
			if ( false !== strpos($file, '.js') ) {
				\wp_register_script($handle, $url, $this->scriptDeps, $this->version);
				$this->registeredAssets[] = $handle;
			}

			// put css in registeredStyleAssets and use wp_register_script
			if ( false !== strpos($file, '.css') ) {
				\wp_register_style($handle, $url, [], $this->version, 'all');
				$this->registeredStyleAssets[] = $handle;
			}
		}
	}

	/**
	 * Checks if the handle has been registered with scripts
	 * @param  string  $handle the handle to check
	 * @return boolean
	 */
	protected function isRegisteredJS( $handle = '' ) {
		return in_array( $handle, $this->registeredAssets );
	}

	/**
	 * Checks if the handle has been registered with styles
	 * @param  string  $handle the handle to check
	 * @return boolean
	 */
	protected function isRegisteredStyle( $handle = '' ) {
		return in_array( $handle, $this->registeredStyleAssets );
	}

	/**
	 * Enqueue a js script with this function
	 * @param  handle $handle the registered handle for the script
	 * @param  boolean $auto_prefix  whether or not too add our prefixer before checking
	 * @return boolean
	 */
	public function enqueueJS( $handle = '', $auto_prefix = true ) {
		if ( true === $auto_prefix ) {
			$handle = $this->prefixHandle( $handle );
		}

		if ( $this->isRegisteredJS( $handle ) ) {
			\wp_enqueue_script( $handle );
			return true;
		}

		return false;
	}

	/**
	 * Enqueue a style with this function
	 * @param  string $handle the registered handle for the style
	 * @param  boolean $auto_prefix  whether or not too add our prefixer before checking
	 * @return boolean
	 */
	public function enqueueStyle( $handle = '', $auto_prefix = true ) {
		if ( true === $auto_prefix ) {
			$handle = $this->prefixHandle( $handle );
		}

		if ( $this->isRegisteredStyle( $handle ) ) {
			\wp_enqueue_style( $handle );
			return true;
		}

		return false;
	}

	/**
	 * Enqueues all of the assets registered
	 * @return [type] [description]
	 */
	public function enqueueAssets() {
		foreach ( $this->registeredAssets as $handle ) {
			\wp_enqueue_script($handle);
		}

		foreach ( $this->registeredStyleAssets as $handle ) {
			\wp_enqueue_style($handle);
		}
	}

	/**
	 * Initializes our plugin by registering our assets and then if we opt to, will
	 * automatically enqueue all of our assets
	 * @param  boolean $auto_enqueue  whether or not to auto_enqueu all of our assets when the loader initializes
	 * @return static
	 */
	public static function initialize( $auto_enqueue = false ) {
		$instance = self::getInstance();

		if ( true === $auto_enqueue ) {
			$instance->enqueueAssets();
		}

		return $instance;
	}

	/**
	 * Singleton construct to get our stored instance
	 * @return static
	 */
	protected static function getInstance() {
		if ( is_null(self::$instance) ) {
			self::$instance = new static();
		}

		return self::$instance;
	}

	/**
	 * Helper logging function for debugging
	 * @return void
	 */
	private function log() {
		if (defined( 'WP_DEBUG') && true !== WP_DEBUG ) {
			return;
		}

		$args = func_get_args();
		if ( ! empty($args) ) {
			foreach ( $args as $arg ) {
				if ( ! is_string($arg) ) {
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
