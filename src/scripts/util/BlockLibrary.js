/**
 * this will keep track of all of our blocks
 */
import BlockName from '../util/BlockName.js';
const { registerBlockType } = wp.blocks;

class BlockLibrary {
  constructor() {
    // our blocks dictionary
    this.blocks = [];
  }

  registerBlock(block) {
    let name = block.name();
    let _block = this.getBlockByName(name);
    if (_block !== null) {
      console.error('Block ' + name + ' already exists', _block);
      throw new Error('Block ' + name + ' already exists');
      return;
    }

    let tag = BlockName(name);
    this.blocks.push({name, tag, block});
  }

  registerBlocks() {
    this.blocks.forEach((block) => {
      registerBlockType(block.tag, block.block.config());
    });
  }

  getBlockTag(name) {
    let block = this.getBlockByName(name);
    if (block === null) {
      console.warn('Block of name ' + name + ' could not be found');
      return null;
    }

    return block.tag;
  }

  getBlockByName(name) {
    return this._retBlock(_.find(this.blocks, {name}));
  }

  getBlockByTag(tag) {
    return this._retBlock(_.find(this.block, {tag}));
  }

  _retBlock(block) {
    if (typeof block === 'undefined') {
      return null;
    }

    return block;
  }
}

export default new BlockLibrary;
