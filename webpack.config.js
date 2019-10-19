'use strict';

// External Modules
const Path = require('path');
const NodeExternals = require('webpack-node-externals');

// Constants
const TYPESCRIPT_IGNORE = /(?:node_modules)$/;

module.exports =
{
	mode: 'development',
	entry:
	{
		index: './src/Modules/index.ts'
	},
	target: 'node',
	resolve:
	{
		extensions: [ '.js', '.ts', '.json' ],
		alias:
		{
			root: __dirname + '/',
			src: __dirname + '/src',
			common: Path.join(__dirname, '../Common')
		}
	},
	output:
	{
		filename: '[name].js',
		path: Path.resolve(__dirname, './'),
		libraryTarget: 'umd',
		globalObject: 'this'
	},
	watch: true,
	module:
	{
		rules:
		[
			{
				loader: 'ts-loader',
				test: /\.tsx?$/,
				exclude: TYPESCRIPT_IGNORE
			}
		]
	},
	externals:
	[
		NodeExternals()
	]
};