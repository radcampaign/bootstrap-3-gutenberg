/**
 * These is a dictionary to retrieve svg icons extracted
 * from the wp gutenberg source code
 */
const el = wp.element.createElement;

class WPIconsDict {
	column() {
		return el('svg', {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 24 24"
			},
			el('path', {
				fill: "none",
				d: "M0 0h24v24H0V0z"
			}),
			el('path', {
				d: "M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z"
			})
		);
	}

	columns() {
		return el('svg', {
				viewBox: "0 0 24 24",
				xmlns: "http://www.w3.org/2000/svg"
			},
			el('path', {
				fill: "none",
				d: "M0 0h24v24H0V0z"
			}),
			el('g',
				null,
				el('path', {
					d: "M21 4H3L2 5v14l1 1h18l1-1V5l-1-1zM8 18H4V6h4v12zm6 0h-4V6h4v12zm6 0h-4V6h4v12z"
				})
			)
		);
	}

	button() {
		return el('svg', {
				viewBox: "0 0 24 24",
				xmlns: "http://www.w3.org/2000/svg"
			},
			el("path", {
				fill: "none",
				d: "M0 0h24v24H0V0z"
			}),
			el("g",
				null,
				el(
					'path',
					{
						d: "M19 6H5L3 8v8l2 2h14l2-2V8l-2-2zm0 10H5V8h14v8z"
					}
				)
			)
		);
	}

	get(tag) {
		if (typeof this[tag] !== 'undefined') {
			return this[tag]();
		}
		return null;
	}
}

export default new WPIconsDict;
