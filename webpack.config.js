var path = require("path");
var webpack = require('webpack');
var BundleTracker = require("webpack-bundle-tracker");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');

module.exports ={
    entry: {
        background: "./src/js/background/main.js",
        popup: "./src/js/popup/app.js",
        capture: "./src/js/capture/app.js",
        capture_select_content: "./src/js/content/capture/select/app.js",
        content: "./src/js/content/app.js",
    },
    output: {
        path: './dist/',
        filename: "js/[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: ['transform-object-rest-spread']
                }
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("css!less")
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: "file-loader?name=/img/[hash].[ext]"
            },
            {
                test:/\.(png)|(jpg)$/,
                loader: 'url-loader?limit=8192'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }

        ]
    },

    plugins: [
        new CommonsChunkPlugin('js/init.js'),
        new ExtractTextPlugin("css/[name].css"),
        new webpack.DefinePlugin({
          'process.env': {
              NODE_ENV: JSON.stringify('production')
          }
        }),
        new uglifyJsPlugin({compress: {warnings: false}}),
        new CopyPlugin([{ from: 'public'}]),
	      new HtmlWebpackPlugin({
            chunks: ['popup'],
            filename: './popup.html',
	          template: 'template/popup.html'
        }),
        new HtmlWebpackPlugin({
            chunks: ['capture'],
            filename: './capture.html',
	          template: 'template/capture.html'
        })
    ]

};
