const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
require("babel-polyfill");
require("raf/polyfill");

module.exports = {
    entry: ['raf/polyfill', 'babel-polyfill', './bundle/app.js'],
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        ]
    },
    plugins: [
        //new UglifyJsPlugin({sourceMap: true}),
        new webpack.ProvidePlugin({
            "React": "react",

        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        })
    ],
    devtool: 'source-map',
};
