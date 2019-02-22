const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebPackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const _ = require('lodash');

const wplib = [
  'blocks',
  'components',
  'date',
  'editor',
  'element',
  'i18n',
  'utils',
  'data',
  'viewport',
  'keycodes'
];

let externals = {
	backbone: 'Backbone',
	jquery: 'jQuery',
	lodash: 'lodash',
	moment: 'moment',
	react: 'React',
	'react-dom': 'ReactDOM',
	tinymce: 'tinymce',
}

wplib.forEach((lib) => {
	externals[`@wordpress/${lib}`] = `wp.${lib}`;
});

module.exports = {
	entry: {
		'bootstrap-block-editor': [
			'./assets/scripts/bootstrap-block-editor.js',
			'./assets/styles/bootstrap-block-editor.scss'
		],
		'bootstrap-styles': [
			'./assets/styles/bootstrap.scss'
		]
	},
	externals,
	output: {
		filename: 'bootstrap-block-editor-[hash].js',
		path: path.resolve(__dirname, 'dist')
	},
	 module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			}
		]
	},
	plugins: [
		new CleanWebPackPlugin(['dist']),
		new ManifestPlugin(),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].[hash].css',
			chunkFilename: '[id].[hash].css',
		})
	]
};
