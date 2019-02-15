# Bootstrap 3 Gutenberg Blocks
This plugin inserts bootstrap 3 style grid layout block and a button block to the gutenberg editor.

## Requirements
### Wordpress
This plugin is intedended for Wordpress 5.x and up. This will not work on sites that do not utilize WordPress's new Gutenberg block editor.

### Bootstrap
This only works if the front end theme is based on bootstrap 3 and that you are loading your bootstrap theme css into the gutenberg editor. To do this you must add something like the following snippet to your theme's `functions.php`:

```
add_action('enqueue_block_editor_assets', function () {
    // register your theme css here
    wp_enqueue_style('example-handle', 'https://example.com/wp-content/theme/example/example.css');
});
```
