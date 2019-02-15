import memize from 'memize';
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
  CheckboxControl
} = wp.components;

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
        default: true,
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
        return [this.blockLibrary().getBlockTag('bootstrap-column')];
      });
    };

    return memize(columnsNum);
  }

  edit(props) {
    let attributes = props.attributes,
        className = props.className;

    let columns = attributes.columns,
        classes = ClassNamesConcat(className, 'has-'.concat(columns,"-columns"), 'row'),
        wrapContainer = attributes.wrapContainer;

    return el(
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
          this.innerBlocksElement(columns)
        )
      )
    );
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
        null,
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
        ),
        el(
          CheckboxControl,
          {
            value: wrapContainer,
            help: __('whether to wrap the row in a container.'),
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

  innerBlocksElement(columns) {
    let getColumnsTemplate = this.getColumnsTemplateFunc();
    let columnsTemplate = getColumnsTemplate(columns);

    let element = el(
      InnerBlocks,
      {
        template: columnsTemplate,
        templateLock: "all",
        allowedBlocks: [this.blockLibrary().getBlockTag('bootstrap-column')],
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
      save(props) {
        return that.save(props);
      },
      edit(props) {
        return that.edit(props);
      },
    };
  }
}

export default new Columns();
