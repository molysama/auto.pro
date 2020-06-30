
const path = require('path')
const AutoProWebpackPlugin = require('..')

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'index.js'),
        second: path.resolve(__dirname, 'second.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        new AutoProWebpackPlugin({
            ui: ['second'],
            // encode: {
            //     key: 'Secret Passphrase'
            // }
        }),
    ]
}