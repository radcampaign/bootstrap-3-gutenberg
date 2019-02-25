/**
 * We are going to inject a little jquery to fix some bad behavior
 */

import $ from 'jquery';
const editor_dispatcher = wp.data.dispatch('core/editor');
const editor_selector = wp.data.select('core/editor');

$(document).ready(() => {
	let editorColumnsSelector = 'div.wp-block.editor-block-list__block[data-type="rad-bootstrap-blocks/bootstrap-columns"]';

	/**
	 * There is this kinda stupid problem in the editor where there is a full width div at the
	 * top of each block that when hovered just shows the insertion-point button for
	 * adding blocks to the editor. This kinda messes with usability on columns since
	 * it will look like the column is being hovered on but when clicked nothing happens.
	 * this is a patch for that
	 */
	$('#wpbody').delegate(editorColumnsSelector + ' > div.editor-block-list__insertion-point', 'click', function (ev) {
		if ($(ev.target).parents('button').length === 0) {
			let blockID = ev.target.closest(editorColumnsSelector).id;
			blockID = blockID.replace('block-','');
			editor_dispatcher.selectBlock(blockID, -1);
			editor_dispatcher.autosave();
		}
	});
});
