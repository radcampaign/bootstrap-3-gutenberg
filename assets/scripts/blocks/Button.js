import ClassNamesConcat from 'classnames';
import WPIcons from '../util/WPIconsDict.js';

const __ = wp.i18n.__;
const el = wp.element.createElement;
const { Fragment } = wp.element;
const { applyFilters } = wp.hooks;
const {
	InspectorControls,
	InnerBlocks,
	URLInput,
	RichText,
} = wp.editor;
const {
	PanelBody,
	SelectControl,
	CheckboxControl
} = wp.components;

class Button {
	name() {
		return 'button';
	}

	category() {
		return 'bootstrap-blocks';
	}

	blockAttributes() {
		return {
			style: {
				type: "string",
				default: "btn-default"
			},
			size: {
				type: "string",
				default: ""
			},
			url: {
				type: "string",
				source: 'attribute',
				attribute: 'href',
				default: '',
				selector: 'a',
			},
			target: {
				type: "string",
				default: "_blank"
			},
			content: {
				type: "string",
				source: "html",
				selector: 'a'
			}
		};
	}

	edit(props) {
		let setAttributes = props.setAttributes;

		return el(
			Fragment,
			null,
			this.inspectorControls(props),
			el(
				RichText,
				{
					tagName: 'div',
					style: {"display": "inline-block"},
					value: props.attributes.content,
					className: this.btnClasses(props.attributes),
					onChange(nextContent) {
						setAttributes({"content": nextContent});
					},
					formattingControls: []
				}
			)
		);
	}

	inspectorControls(props) {
		let attributes = props.attributes;
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
			{},
			this.styleSelector(attributes, setAttributes),
			this.sizeSelector(attributes, setAttributes),
			this.urlInput(attributes, setAttributes),
			this.targetSelector(attributes, setAttributes),
		);
	}

	urlInput(attributes, setAttributes) {
		let url = attributes.url;

		return el(
			URLInput,
			{
				title: __('Button Link'),
				value: url,
				onChange(nextLink) {
					setAttributes({
						'url': nextLink
					});
				},
				style: {width: '100%'},
			}
		);
	}

	targetSelector(attributes, setAttributes) {
		let target = attributes.target;

		return el(
			CheckboxControl,
			{
				value: target === "_blank",
				label: __('open in New Tab'),
				onChange(isChecked) {
					let conf = {'target': ""};
					if (isChecked) {
						conf.target = "_blank";
					}
					setAttributes(conf);
				},
			}
		);
	}

	styleSelector(attributes, setAttributes) {
		let style  = attributes.style;

		let default_options = [{label: __('default'), value: 'btn-default'}];

		let style_options = applyFilters('rad-bootstrap-button-styles', [
			{label: __('primary'), value: 'btn-primary'},
			{label: __('success'), value: 'btn-success'},
			{label: __('info'), value: 'btn-info'},
			{label: __('warning'), value: 'warning'},
			{label: __('danger'), value: 'danger'},
			{label: __('link'), value: 'link'},
		]);

		return el(
			SelectControl,
			{
				value: style,
				label: __('Button Style'),
				options: default_options.concat(style_options),
				onChange(nextStyle) {
					setAttributes({
						'style': nextStyle
					});
				}
			}
		);
	}

	sizeSelector(attributes, setAttributes) {
		let size  = attributes.size;
		let default_options = [{label: __('default'), value: ''}];
		let size_options = applyFilters('rad-bootstrap-button-sizes', [
			{label: __('large'), value: 'btn-lg'},
			{label: __('small'), value: 'btn-sm'},
			{label: __('extra small'), value: 'btn-xs'},
		]);

		return el(
			SelectControl,
			{
				value: size,
				label: __('Button Size'),
				options: default_options.concat(size_options),
				onChange(nextSize) {
					setAttributes({
						'size': nextSize
					});
				}
			}
		);
	}

	btnClasses(attributes) {
		let size = attributes.size,
				style = attributes.style;

		return ClassNamesConcat('btn', size, style);
	}

	save(props) {
		return el('p', {}, el(
			RichText.Content,
			{
				className: this.btnClasses(props.attributes),
				href: props.attributes.url,
				target: props.attributes.target,
				tagName: "a",
				value: props.attributes.content
			}
		));
	}

	icon() {
		return WPIcons.get('button');
	}

	config() {
		let that = this;
		return {
			title: __('Bootstrap Button'),
			description: __("Inserts a boostrap styled button"),
			icon: that.icon(),
			category: that.category(),
			attributes: that.blockAttributes(),
			supports: {
				align: true,
				alignWide: false
			},
			edit(props) {
				return that.edit(props);
			},
			save(props) {
				return that.save(props);
			}
		}
	}
}

export default new Button();
