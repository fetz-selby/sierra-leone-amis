const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: "./index.js",
    output: {
        path: __dirname+'/build',
        filename: "app.bundle.js"
    },
    devServer: {
        inline: false,
        contentBase: "./build",
    },
    target : 'node',
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' },
            { test: /\.js$/, use: 'babel-loader' }
        ]
    },
    externals : [nodeExternals()],
    plugins: [new CopyWebpackPlugin([
        {from : './resources/jokes.csv', to:'./resources/jokes.csv'}
    ])]
};