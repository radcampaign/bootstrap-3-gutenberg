<?php
/**
 * Creates a settings page for our plugin
 */
namespace RAD_BOOTSTRAP_3;

class Settings {
	/**
	 * Instance storage for our class
	 * @var static
	 */
	public static $instance = null;

	protected $key_prefix = 'radBBlocks';

	protected $page_id = 'rad-bootstrap-3';

	protected $capability = 'manage_options';

	/**
	 * Saves our settings
	 * @var array
	 */
	protected $settings = [];

	/**
	 * storage for our managed settings keys
	 * @var array
	 */
	protected $settings_keys = [];

	/**
	 * Constructs our class by retrieving our settings and storing them
	 * in cache
	 */
	protected function __construct() {
		$this->settings_keys = [
			$this->prefixSetting('load_bootstrap_styles_editor'),
			$this->prefixSetting('load_bootstrap_styles_frontend')
		];

		foreach ($this->settings_keys as $key) {
			$tmp = \get_option( $key );

			// these options will be turned on by default
			if ( $tmp === false ) {
				\add_option( $key, 'on' );
				$tmp = 'on';
			}

			$this->settings[ $key ] = $tmp;
		}
	}

	/**
	 * Retrieves an option setting from cache
	 * @param  string $key string the option setting
	 * @return mixed
	 */
	public function getSetting($key = '') {
		return $this->getArg($this->settings, $key);
	}

	/**
	 * Quick access to let the application know whether or not to load
	 * bootstrap on the front end
	 * @return boolean
	 */
	public static function loadBootstrapOnFrontEnd() {
		$instance = self::getInstance();
		return $instance->getSetting( $instance->prefixSetting('load_bootstrap_styles_frontend') ) === 'on';
	}

	/**
	 * Quick access to let the application know whether or not to load
	 * bootstrap on the back end
	 * @return [type] [description]
	 */
	public static function loadBootstrapInEditor() {
		$instance = self::getInstance();
		return $instance->getSetting( $instance->prefixSetting('load_bootstrap_styles_editor') ) === 'on';
	}

	/**
	 * Provides the menu for the settings
	 * @return void
	 */
	public function settingsMenu() {
		\add_menu_page(
			'Bootstrap 3 Block Settings',
			'Bootstrap 3 Block Settings',
			$this->capability,
			$this->page_id,
			[$this, 'settingsPage']
		);
	}

	/**
	 * The callback for our settings page
	 * @see  settingsMenu
	 * @return void
	 */
	public function settingsPage() {
		if ( ! current_user_can( $this->capability) ) {
			return;
		}

		$messages_key = $this->prefixSetting('messages');
		if ( isset( $_GET['settings-updated'] ) ) {
		 	// add settings saved message with the class of "updated"
		 	add_settings_error( $messages_key, 'wporg_message', __( 'Settings Saved', get_text_domain() ), 'updated' );
		 }

		settings_errors( $messages_key );
		?>
		<div class="wrap">
			 <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			 <form action="options.php" method="post">
			 	<?php \settings_fields( $this->key_prefix ); ?>

			 	<?php \do_settings_sections( $this->page_id ); ?>

			 	<div class="submit-section" style="margin-top: 20px;">
			 		<?php \submit_button( 'Save Settings' ); ?>
			 	</div>
			 </form>
		</div>
		<?php
	}

	/**
	 * Init for our settings page
	 * @return void
	 */
	public function settingsInit() {
		$this->registerSettings();
		$this->registerSettingsSections();
		$this->registerSettingsFields();
	}

	/**
	 * Registers our settings
	 * @see  settingInit
	 * @return void
	 */
	protected function registerSettings() {
		foreach ($this->settings_keys as $key) {
			\register_setting( $this->key_prefix, $key );
		}
	}

	/**
	 * Registers our settings sections for the settings page
	 * @see  settingsInit
	 * @return void
	 */
	protected function registerSettingsSections() {
		\add_settings_section(
			$this->prefixSetting('section_load_bootstrap'),
			__( 'Load Bootstrap into block Editor', get_text_domain()),
			[$this, 'settingsSection'],
			$this->page_id
		);
	}

	/**
	 * Registers our settings fields
	 * @return void
	 */
	protected function registerSettingsFields() {
		$key = $this->prefixSetting('load_bootstrap_styles_editor');
		\add_settings_field(
			$key,
			__('Load Bootrap in the Block Editor'),
			[$this, 'checkbox'],
			$this->page_id,
			$this->prefixSetting('section_load_bootstrap'),
			[
				'label'       => __('Load bootstrap in block editor'),
				'id'          => $key,
				'description' => __('Click here to enable the loading of the bootstrap container and button styles in the block editor.'),
				'value'       => $this->getSetting($key) === 'on'
			]
		);

		$key = $this->prefixSetting('load_bootstrap_styles_frontend');
		\add_settings_field(
			$key,
			__('Load Bootrap on front end'),
			[$this, 'checkbox'],
			$this->page_id,
			$this->prefixSetting('section_load_bootstrap'),
			[
				'label'       => __('Load bootstrap on in your theme'),
				'id'          => $key,
				'description' => __('Click here to enable the loading of the bootstrap container and button styles in your theme front end.'),
				'value'       => $this->getSetting($key) === 'on'
			]
		);
	}

	/**
	 * Helper for retrieving data from an associative array without
	 * throwing an error or warning
	 * @param  array  $args assoc array
	 * @param  string $key  the key to attrieve
	 * @return mixed        The value or null on failure - or null if it is the value lol
	 */
	protected function getArg($args = [], $key = '') {
		return isset( $args[$key] ) ? $args[$key] : null;
	}

	/**
	 * A simple checkbox for our settings page
	 * @param  array $args  the arguments passed fill values in the checkbox display
	 * @return void
	 */
	public function checkbox( $args ) {
		$label = $this->getArg($args, 'label');
		$id = $this->getArg($args, 'id');
		$name = $this->getArg($args, 'name');
		if ( empty($name) ) {
			$name = $id;
		}

		$description = $this->getArg($args, 'description');
		$value = true === $this->getArg($args, 'value');
		?>
		<div>
			<input
				type="checkbox"
				<?php if ( ! empty($name) ): ?> name="<?php echo $name; ?>" <?php endif; ?>
				<?php if ( ! empty($id) ): ?> id="<?php echo $id; ?>" <?php endif; ?>
				<?php if ( $value ): ?> checked <?php endif; ?>
			> <label for="<?php echo $id; ?>"> <?php echo __( $label, get_text_domain() ); ?> </label>
		</div>
		<?php if ( !empty($description) ): ?>
			<p class="small"><em><?php echo __( $description, get_text_domain() ); ?></em></p>
		<?php endif; ?>
		<?php
	}

	/**
	 * The callback for our settings section
	 * @see  settingsInit
	 * @param  array $args  arguments passed to the callback
	 * @return void
	 */
	public function settingsSection( $args ) {
		?>
			<p id="<?php echo esc_attr( $args['id'] ); ?>"><?php esc_html_e( 'Tell us where to load Bootstrap. If you already have bootstrap loded in your theme and in the block editor, then you will want to turn these off. If you do not however, you can include these here. This will not load ALL of bootstrap. This will only load the parts of bootstrap that are needed by our blocks. In this version, we have blocks for columns and buttons. Thus we cherry-picked the column styles and button styles from bootstrap and packaged them here nicely.', get_text_domain() ); ?></p>
		<?php
	}

	/**
	 * Prefixes our settings key
	 * @param  string $key the key we will be using in the database
	 * @return string
	 */
	public function prefixSetting( $key = '' ) {
		return join( '_', [$this->key_prefix, $key] );
	}

	/**
	 * Singleton instance creator
	 * @return static
	 */
	public static function getInstance() {
		if (is_null(self::$instance)) {
			self::$instance = new static();
		}

		return self::$instance;
	}
}
