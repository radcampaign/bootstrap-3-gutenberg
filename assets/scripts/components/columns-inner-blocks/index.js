/**
 * Most of this is an overwrite of @wordpress/editor/src/componenets/inner-blocks
 * so that we could import our own block-list and our own block-list block
 * and put our grid classes in the right place
 */

import classnames from 'classnames';
import { createElement as el } from 'wp.element';
import { withViewportMatch } from 'wp.viewport';
import { Component, createContext } from 'wp.element';
import { withSelect, withDispatch } from 'wp.data';
import {
	synchronizeBlocksWithTemplate as _synchronizeBlocksWithTemplate,
	withBlockContentContext
} from 'wp.blocks';
const isShallowEqual = wp.isShallowEqual;
import { compose } from 'wp.compose';
// import { BlockList } from 'wp.editor';
import BlockList from './block-list.js';
// import {
// 	withBlockEditContext
// } from '@wordpress/editor/build-module/components/block-edit/context';

class ColumnsInnerBlocks extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			templateInProcess: !! this.props.template,
		};
		this.updateNestedSettings();
	}

	getTemplateLock() {
		const {
			templateLock,
			parentLock,
		} = this.props;
		return templateLock === undefined ? parentLock : templateLock;
	}

	componentDidMount() {
		const { innerBlocks } = this.props.block;
		// only synchronize innerBlocks with template if innerBlocks are empty or a locking all exists
		if ( innerBlocks.length === 0 || this.getTemplateLock() === 'all' ) {
			this.synchronizeBlocksWithTemplate();
		}
		if ( this.state.templateInProcess ) {
			this.setState( {
				templateInProcess: false,
			} );
		}
	}

	componentDidUpdate( prevProps ) {
		let { template, block } = this.props;
		let { innerBlocks } = block;

		this.updateNestedSettings();
		// only synchronize innerBlocks with template if innerBlocks are empty or a locking all exists
		if ( innerBlocks.length === 0 || this.getTemplateLock() === 'all') {
			let hasTemplateChanged = !_.isEqual( template, prevProps.template );
			if ( hasTemplateChanged ) {
				this.synchronizeBlocksWithTemplate();
			}
		}
	}

	/**
	 * Called on mount or when a mismatch exists between the templates and
	 * inner blocks, synchronizes inner blocks with the template, replacing
	 * current blocks.
	 */
	synchronizeBlocksWithTemplate() {
		const { template, block, replaceInnerBlocks } = this.props;
		const { innerBlocks } = block;

		// Synchronize with templates. If the next set differs, replace.
		const nextBlocks = _synchronizeBlocksWithTemplate( innerBlocks, template );
		if ( ! _.isEqual( nextBlocks, innerBlocks	) ) {
			replaceInnerBlocks( nextBlocks );
		}
	}

	updateNestedSettings() {
		const {
			blockListSettings,
			allowedBlocks,
			updateNestedSettings,
		} = this.props;

		const newSettings = {
			allowedBlocks,
			templateLock: this.getTemplateLock(),
		};

		if ( ! isShallowEqual( blockListSettings, newSettings ) ) {
			updateNestedSettings( newSettings );
		}
	}

	render() {
		const {
			clientId,
			isSmallScreen,
			isSelectedBlockInRoot,
		} = this.props;
		const { templateInProcess } = this.state;

		const classes = classnames( 'editor-inner-blocks', {
			'has-overlay': isSmallScreen && ! isSelectedBlockInRoot,
		} );

		return el(
			"div",
			{
				className: classes,
			},
			!templateInProcess && el(BlockList, {
				rootClientId: clientId
			})
		);
	}
}

ColumnsInnerBlocks = compose( [
	// withBlockEditContext(function (context, props) {
	// 	let mapper = _.pick(context, ['clientId']);
	// 	if (mapper.clientId === null) {
	// 		context.clientId = props.clientId;
	// 		return _.pick(props, ['clientId']);
	// 	}
	//   return mapper;
	// }),
	withViewportMatch( { isSmallScreen: '< medium' } ),
	withSelect( ( select, ownProps ) => {
		const {
			isBlockSelected,
			hasSelectedInnerBlock,
			getBlock,
			getBlockListSettings,
			getBlockRootClientId,
			getTemplateLock,
		} = select( 'core/editor' );

		const { clientId } = ownProps;
		const rootClientId = getBlockRootClientId( clientId );
		let selectors = {
			isSelectedBlockInRoot: isBlockSelected( clientId ) || hasSelectedInnerBlock( clientId ),
			block: getBlock( clientId ),
			blockListSettings: getBlockListSettings( clientId ),
			parentLock: getTemplateLock( rootClientId ),
		};

		return selectors;
	} ),
	withDispatch( ( dispatch, ownProps ) => {
		const {
			replaceBlocks,
			insertBlocks,
			updateBlockListSettings,
		} = dispatch( 'core/editor' );
		const { block, clientId, templateInsertUpdatesSelection = true } = ownProps;

		return {
			replaceInnerBlocks( blocks ) {
				const clientIds = _.map( block.innerBlocks, 'clientId' );
				if ( clientIds.length ) {
					replaceBlocks( clientIds, blocks );
				} else {
					insertBlocks( blocks, undefined, clientId, templateInsertUpdatesSelection );
				}
			},
			updateNestedSettings( settings ) {
				dispatch( updateBlockListSettings( clientId, settings ) );
			},
		};
	} ),
] )( ColumnsInnerBlocks );

ColumnsInnerBlocks.Content = withBlockContentContext(function (_ref) {
	let BlockContent = _ref.BlockContent;
	return el(BlockContent, null);
});


export default ColumnsInnerBlocks;
