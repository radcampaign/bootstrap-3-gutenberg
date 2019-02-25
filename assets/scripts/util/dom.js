/**
 * Exports a bunch of functions we can use for finding blocks
 */

/**
 * Taken from the @wordpress/editor/build-module/utils/dom.js. Given a client
 * block id, this gets the document node for that block.
 *
 * @param {string} clientId Block client ID.
 * @return {Element} Block DOM node.
 */
export function getBlockDOMNode(clientId) {
	return document.querySelector('[data-block="' + clientId + '"]');
};
