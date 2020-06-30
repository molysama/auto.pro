'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var CryptoJS = require("crypto-js");
var AutoProWebpackPlugin = /** @class */ (function () {
    function AutoProWebpackPlugin(option) {
        this.option = option;
    }
    AutoProWebpackPlugin.prototype.apply = function (compiler) {
        var ui = this.option.ui || [];
        var encode = this.option.encode;
        compiler.hooks.emit.tap('AutoProWebpackPlugin', function (compilation) {
            var _loop_1 = function (filename) {
                var sourceFileName = filename.split('.')[0];
                var source = compilation.assets[filename].source();
                var result = '';
                // 如果ui数组里包含有该文件名，则为其头部添加"ui";
                if (ui.includes(sourceFileName)) {
                    result += '"ui";';
                }
                result += source;
                if (encode) {
                    try {
                        result = CryptoJS.AES.encrypt(source, encode.key, {
                            mode: CryptoJS.mode.ECB,
                            padding: encode.type === 'pck5' ? CryptoJS.pad.Pkcs5 : CryptoJS.pad.Pkcs7,
                        }).toString();
                    }
                    catch (error) {
                        console.log('加密失败', error);
                    }
                }
                // 重建文件
                compilation.assets[filename] = {
                    source: function () {
                        return result;
                    },
                    size: function () {
                        return result.length;
                    }
                };
            };
            for (var filename in compilation.assets) {
                _loop_1(filename);
            }
        });
    };
    return AutoProWebpackPlugin;
}());
exports.AutoProWebpackPlugin = AutoProWebpackPlugin;
module.exports = AutoProWebpackPlugin;
