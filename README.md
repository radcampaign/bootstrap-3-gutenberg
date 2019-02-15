# Bootstrap 4 Gutenberg Blocks
This plugin inserts bootstrap 4 style grid layout blocks to the gutenberg editor.

## Requirements
This only works if the front end theme is based on bootstrap 4 and that you are loading your bootstrap theme css into the gutenberg editor. To do this use
```
add_action('enqueue_block_editor_assets', function () {
    // register your theme css here
    wp_enqueue_style('example-handle', 'https://example.com/wp-content/theme/example/example.css');
});
```
