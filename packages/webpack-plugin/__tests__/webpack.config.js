
const path = require('path')
const AutoProWebpackPlugin = require('..')

module.exports = {
    entry: {
        first: path.resolve(__dirname, 'first.js'),
        second: path.resolve(__dirname, 'second.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        // filename: '[name].[chunkhash].js'
    },
    plugins: [
        new AutoProWebpackPlugin({
            ui: ['second'],
            encode: {
                key: 'SecretPassphrase'
            }
        }),
    ]
}