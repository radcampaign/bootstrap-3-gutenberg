=== Rad Bootstrap 3 Blocks ===
Contributors: jdiamonte
Tags: Bootstrap 3, Gutenberg, block editor
Requires at least: 5.0
Tested up to: 5.0
Requires PHP: 5.6
Stable tag: 1.2.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html

This plugin inserts bootstrap 3 style grid layout block and a button block to the gutenberg editor.

== Description ==
This plugin is intedended for Wordpress 5.x and up. This will not work on sites that do not utilize WordPress's new Gutenberg block editor.

== USAGE ==
Once activated, simply click on the "Add Block" button and scroll down to see the new category "Bootstrap Blocks". To add a Bootstrap styled button, click "Bootstrap Button." To add Bootstrap Columns, click "Bootstrap Columns".

Columns and containers can be configured in the Settings sidebar. Be sure to have that sidebar open to get the full experience. If you click on the "container" block of the columns, you can add more or remove columns in the range selector. To change the width of the column, click on the column and change the "Column Width"  in the settings panel. Since bootstrap is a responsive framework, you can change at what screen to "break" column into full width. This means that the columns will stack on top of each other at smaller screens. As a visual cue of the width and breaksize, the column in the editor will display the css "class" that it is configured for. Thus, "col-xs-6" means that it is a column that is 6 columns wide (out of 12) and will break only if the screen is extra small.

== Installation ==
Upon activation of the plugin, there will be a "Bootstrap 3 Block Settings" page added to the sidebar. This page has two configuration options which are by default enabled. These configuration options tell the plugin whether to load the required Bootstrap 3 styles in the block editor and or in your front end theme. If you already have bootstrap loaded in your theme and in the block editor, then you will want to turn these off. If you do not, however, you can include these here.

This plugin will not load all of Bootstrap. It will only load the parts of Bootstrap needed by the added blocks in the editor. For this version of the plugin, this will include the grid layout styles as well as the button styles.
