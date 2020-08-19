"use strict";
module.exports = function (source) {
    return source.replace(/\((\s*<[\s\S]*?>\s*)\)/gm, function (word, match) { return '(`' + match.replace(/\{\{(.*?)\}\}/gm, '${$1}') + '`)'; });
};
