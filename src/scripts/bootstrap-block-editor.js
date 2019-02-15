/**
 * Registers our custom Bootstrap 4 blocks
 */
// lets make sure lodash is required
if (typeof window._ === 'undefined') {
	window._ = require('lodash');
}

// let set up a custom global
window.RAD = {};

// utils
import BlockLibrary from './util/BlockLibrary.js';
// save our block library globally
window.RAD.blockLibrary = BlockLibrary;

// let import our blocks
import Column from './blocks/Column.js';
import Columns from './blocks/Columns.js';
import Button from './blocks/Button.js';

// lets register all of our blocksour blocks
[Button, Column,Columns].forEach((block) => {
  window.RAD.blockLibrary.registerBlock(block);
});

// this basically closes the libary
window.RAD.blockLibrary.registerBlocks();
