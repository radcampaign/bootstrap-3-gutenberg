import memize from 'memize';
import ClassNamesConcat from 'classnames';
import WPIcons from '../util/WPIconsDict.js';

import { __ } from 'wp.i18n';
import { createElement as el } from 'wp.element';
import { Fragment } from 'wp.element';
import {
	InspectorControls,
	//InnerBlocks,
} from 'wp.editor';
import InnerBlocks from '../components/columns-inner-blocks';

import {
	PanelBody,
	RangeControl,
	CheckboxControl,
} from 'wp.components';

import { withState } from 'wp.compose';


class Columns {

	blockLibrary() {
		if (typeof window.RAD === 'undefined') {
			throw new Error('This block requires the global RAD');
		}

		return window.RAD.blockLibrary;
	}

	name() {
		return 'bootstrap-columns';
	}

	title() {
		return __('Bootstrap Columns');
	}

	icon() {
		return WPIcons.get('columns');
	}

	category() {
		return 'bootstrap-blocks';
	}

	blockAttributes() {
		return {
			columns: {
				type: 'number',
				default: 2,
			},
			className: {
				type: "string",
			},
			wrapContainer: {
				type: "boolean",
				default: false,
			}
		};
	}

	save(props) {
		let attributes = props.attributes;
		let columns = attributes.columns,
				wrapContainer = attributes.wrapContainer;
		let content = InnerBlocks.Content;
		let contentElement = el(content, null);

		return this.containerize(
			wrapContainer,
			el(
				"div",
				{
					className: 'row has-'.concat(columns, "-columns"),
				},
				contentElement
			)
		);
	}

	getColumnsTemplateFunc() {
		let columnsNum = (columns) => {
			return _.times(columns, () => {
				return [this.blockLibrary().getBlockTag('bootstrap-column'), {'something': 'new'}];
			});
		};

		return memize(columnsNum);
	}

	edit(props) {
		let attributes = props.attributes,
				className = props.className;

		let columns = attributes.columns,
				classes = ClassNamesConcat(className, 'has-'.concat(columns,"-columns")),
				wrapContainer = attributes.wrapContainer;


		let editor = el(
			Fragment,
			null,
			this.inspectorControlsElement(props),
			this.containerize(
				wrapContainer,
				el(
					"div",
					{
						className: classes
					},
					this.innerBlocksElement(columns, props.clientId)
				)
			)
		);

		return editor;
	}

	containerize(toWrap, element) {
		if (toWrap) {
			element = el("div", {className: "container-fluid"}, element);
		}
		return element;
	}

	inspectorControlsElement(props) {
		let attributes = props.attributes;
		let columns = attributes.columns;
		let setAttributes = props.setAttributes;
		let wrapContainer = attributes.wrapContainer;

		return el(
			InspectorControls,
			null,
			el(
				PanelBody,
				{
					title: __('Number of Columns'),
				},
				el(
					RangeControl,
					{
						value: columns,
						label: __('Number of Columns'),
						onChange(nextColumns) {
							setAttributes({
								columns: nextColumns,
							});
						},
						min:2,
						max: 6
					}
				)
			),
			el(
				PanelBody,
				{
					title: __('Add Container?'),
					initialOpen: false,
				},
				el(
					CheckboxControl,
					{
						value: wrapContainer,
						help: __('A container in Bootstrap adds extra padding around the columns.'),
						checked: wrapContainer,
						label: __('Wrap the row in a Container?'),
						heading: __('Wrap Container'),
						onChange(isChecked) {
							setAttributes({'wrapContainer': isChecked});
						},
					}
				)
			)
		);
	}

	innerBlocksElement(columns, clientId) {
		let getColumnsTemplate = this.getColumnsTemplateFunc();
		let columnsTemplate = getColumnsTemplate(columns);

		let element = el(
			InnerBlocks,
			{
				template: columnsTemplate,
				templateLock: "all",
				allowedBlocks: [this.blockLibrary().getBlockTag('bootstrap-column')],
				clientId
			}
		);

		return element;
	}

	config() {
		let that = this;
		return {
			title: this.title(),
			icon: this.icon(),
			category: this.category(),
			attributes: this.blockAttributes(),
			description: __('A block that displays content in mutiple bootstrap columns'),
			supports: {
				align: ['wide', 'full'],
				html: false
			},
			save: that.save.bind(that),
			edit: that.edit.bind(that),
		};
	}
}

export default new Columns();
