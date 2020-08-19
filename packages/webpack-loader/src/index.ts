
module.exports = function (source) {
    return source.replace(/\((\s*<[\s\S]*?>\s*)\)/gm, (word, match) => { return '(`' + match.replace(/\{\{(.*?)\}\}/gm, '${$1}') + '`)' })
}