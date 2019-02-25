import _ from 'lodash';
import ClassNamesConcat from 'classnames';
import WPIcons from '../util/WPIconsDict.js';

const __ = wp.i18n.__;
const { applyFilters } = wp.hooks;
const el = wp.element.createElement;
const { Fragment } = wp.element;
const {
	InspectorControls,
	InnerBlocks,
	BlockControls,
} = wp.editor;
const {
	PanelBody,
	RangeControl,
	SelectControl,
	Button,
	Toolbar,
	Dropdown,
	IconButton,
} = wp.components;
const { withState } = wp.compose;

class Column {

	constructor() {
		this.breaksize_options = applyFilters('rad-bootstrap-column-breakpoint-options', [
			{label: 'Extra Small', value: 'xs'},
			{label: 'Small', value: 'sm'},
			{label: 'Medium', value: 'md'},
			{label: 'Large', value: 'lg'}
		]);
	}

	name() {
		return 'bootstrap-column';
	}

	title() {
		return __('Bootstrap Column');
	}

	icon() {
		return WPIcons.get('column');
	}

	category() {
		return 'bootstrap-blocks';
	}

	edit(props) {
		let attributes = props.attributes;

		return el(
			Fragment,
			null,
			this.inspectorControlsElement(props),
			this.blockControls(props, props.isSelected),
			el(
				'div',
				{
					className: 'col-editor'
				},
				// this.editColHeader(attributes),
				el(
					InnerBlocks,
					{
						templateLock: false
					}
				)
			)
		);
	}

	editColHeader(attributes) {
		let size = attributes.size,
				breakSize = attributes.breakSize;

		return el(
			'div',
			{
				className: 'bootstrap-column-controls'
			},
			__('column: size=' + size + '; breakpoint=' + breakSize)
		);
	}

	columnClass(attributes) {
		let size = attributes.size,
				breakSize = attributes.breakSize;
		return 'col-' + breakSize + '-' + size;
	}

	inspectorControlsElement(props) {
		let attributes = props.attributes,
				setAttributes = props.setAttributes;

		return el(
			InspectorControls,
			null,
			el(
				PanelBody,
				{
					title: __('Column Width'),
				},
				this.rangeControl(attributes, setAttributes)
			),
			el(
				PanelBody,
				{
					title: __('Breakpoint'),
				},
				this.breakSizeControl(attributes, setAttributes)
			)
		);
	}

	breakSizeControl(attributes, setAttributes, showHelp = true) {
		let breakSize = attributes.breakSize;
		return el(
			SelectControl,
			{
				value: breakSize,
				label: __('Choose Breakpoint'),
				options: this.breaksize_options,
				help: showHelp && __('In Boostrap, breakpoint is the screen width under which the columns will "break" from being aligned next to each other to which the column will stack underneath or above it\'s sibling columns.'),
				onChange(nextBreak) {
					setAttributes({
						breakSize: nextBreak
					});
				}
			}
		);
	}

	rangeControl(attributes, setAttributes, showHelp = true) {
		let size = attributes.size;

		return el(
			'div',
			{className: 'bootstrap-column-rangecontrol'},
			el(
				RangeControl,
				{
					label: __('Column Width'),
					value: size,
					onChange(nextSize) {
						setAttributes({
							size: nextSize,
						});
					},
					min: 1,
					max: 12,
					help: showHelp && __('Bootstrap is based on a twelve column grid. The column width size is how many columns this column will expand across. Thus a value of 6 means that the column will span 50% of the width.'),
				}
			)
		);
	}

	blockControls(props, active = false) {
		return el(
			BlockControls,
			{
				isActive: active
			},
			this.rangeControlDropDown(props),
			this.breakSizeControlDropDown(props)
		);
	}

	breakSizeControlDropDown(props) {
		let that = this,
				attributes = props.attributes,
				setAttributes = props.setAttributes;

		let menuButtons = this.breaksize_options.map((option) => {
			return el(
				Button,
				{
					className: "components-menu-item__button editor-block-settings-menu__control",
					onClick: ()=> {
						setAttributes({breakSize: option.value});
					}
				},
				__(option.label)
			);
		});

		return el(
			Toolbar,
			null,
			el(
				Dropdown,
				{
					className: 'rad-breasize-control',
					contentClassName: "rad-dropdown",
					position: "bottom right",
					renderContent(dref) {
						return el(
							"div",
							{
								role: "menu",
								"aria-orientation": "vertical",
								className: "editor-block-settings-menu__content"
							},
							menuButtons
						);
					},
					renderToggle(dref) {
						return that.dropDownButton(
							__("Breakpoint"),
							dref.onToggle,
							dref.isOpen
						);
					}
				}
			)
		);
	}

	rangeControlDropDown(props) {
		let that = this,
				attributes = props.attributes,
				setAttributes = props.setAttributes;

		return el(
			Toolbar,
			null,
			el(
				Dropdown,
				{
					className: "rad-range-control",
					contentClassName: "rad-popover",
					position: "bottom right",
					renderContent(dref) {
						return el(
							'div',
							{},
							that.rangeControl(attributes, setAttributes, false)
						);
					},
					renderToggle(dref) {
						return that.dropDownButton(
							__("Width"),
							dref.onToggle,
							dref.isOpen
						);
					},
				}
			)
		);
	}

	dropDownButton(content, onClick, expanded) {
		return el(
			Button,
			{
				onClick,
				"aria-expanded": expanded,
			},
			content
		);
	}

	save(props) {
		return el(
			"div",
			{
				className: this.columnClass(props.attributes)
			},
			el(InnerBlocks.Content, null)
		);
	}

	blockAttributes() {
		return {
			size: {
				type: 'number',
				default: 6
			},
			breakSize: {
				type: 'string',
				default: 'xs'
			}
		}
	}

	config() {
		let that = this;
		return {
			title: that.title(),
			icon: that.icon(),
			description: __('A single bootstrap column'),
			category: that.category(),
			attributes: that.blockAttributes(),
			supports: {
				inserter: false,
				reusable: false,
				html: false
			},
			edit: withState({'something': null})(that.edit.bind(that)),
			save(props) {
				return that.save(props);
			}
		};
	}
}

export default new Column();
