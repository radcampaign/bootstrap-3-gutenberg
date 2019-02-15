import ClassNamesConcat from 'classnames';
import WPIcons from '../util/WPIconsDict.js';

const __ = wp.i18n.__;
const el = wp.element.createElement;
const { Fragment } = wp.element;
const {
	InspectorControls,
	InnerBlocks,
} = wp.editor;
const {
	PanelBody,
	RangeControl,
	SelectControl,
	Button,
	Popover,
} = wp.components;

class Column {
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
		return el(
			Fragment,
			null,
			this.inspectorControlsElement(props),
			el(
				'div',
				{
					className: ClassNamesConcat('col-editor', this.columnClass(props.attributes))
				},
				el(
					'div',
					{
						className: 'bootstrap-column-controls'
					},
					 this.columnClass(props.attributes)
				),
				el(
					InnerBlocks,
					{
						templateLock: false
					}
				)
			)
		);
	}

	columnClass(attributes) {
		let size = attributes.size,
				breakSize = attributes.breakSize;
		return 'col-' + breakSize + '-' + size;
	}

	inspectorControlsElement(props) {
		return el(
			InspectorControls,
			null,
			el(
				PanelBody,
				null,
				this.attributeElements(props)
			)
		);
	}

	attributeElements(props) {
		let attributes = props.attributes,
				setAttributes = props.setAttributes;

		return el(
			'div',
			{className: 'bootstrap-column-attribute-editor'},
			this.rangeControl(attributes, setAttributes),
			this.breakSizeControl(attributes, setAttributes)
		);
	}

	breakSizeControl(attributes, setAttributes) {
		let breakSize = attributes.breakSize;
		return el(
			SelectControl,
			{
				value: breakSize,
				label: __('Break Size'),
				options: [
					{label: 'Extra Small', value: 'xs'},
					{label: 'Small', value: 'sm'},
					{label: 'Medium', value: 'md'},
					{label: 'Large', value: 'lg'}
				],
				onChange(nextBreak) {
					setAttributes({
						breakSize: nextBreak
					});
				}
			}
		);
	}

	rangeControl(attributes, setAttributes) {
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
					max: 12
				}
			),

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
			edit(props) {
				return that.edit(props);
			},
			save(props) {
				return that.save(props);
			}
		};
	}
}

export default new Column();
