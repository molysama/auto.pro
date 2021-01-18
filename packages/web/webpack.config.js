const path = require('path')
module.exports = {
    entry: path.resolve('./src/source.js'),
    output: {
        path: path.resolve('./src'),
        filename: 'index.js',
        library: 'AutoWeb',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    mode: 'production'
}