
const path = require('path')
const AutoProWebpackPlugin = require('..')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = {
    entry: {
        1: path.resolve(__dirname, '1.js'),
        2: path.resolve(__dirname, '2.js'),
        3: path.resolve(__dirname, '3.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        // filename: '[name].[chunkhash].js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: '@auto.pro/webpack-loader'
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new AutoProWebpackPlugin({
            ui: ['2', '3'],
            encode: {
                key: 'SecretPassphrase',
                exclude: ['1', '3']
            }
        }),
    ]
}