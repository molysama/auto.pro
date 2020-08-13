'use strict';

export interface Option {
    ui?: string[]
    encode?: {
        key: string
        exclude?: string[]
    }
}

const CryptoJS = require("crypto-js")

export class AutoProWebpackPlugin {

    option: Option

    constructor(option: Option) {
        this.option = option
    }

    apply(compiler) {
        const ui = this.option.ui || []
        const encode = this.option.encode
        const excludeEncode = encode?.exclude || []

        compiler.hooks.emit.tap('AutoProWebpackPlugin', function (compilation) {

            for (let filename in compilation.assets) {
                let sourceFileName = filename.split('.')[0]
                let source = compilation.assets[filename].source()

                let result = ''
                // 如果ui数组里包含有该文件名，则为其头部添加"ui";
                if (ui.includes(sourceFileName)) {
                    result = '"ui";'
                }
                result += source

                if (encode && !excludeEncode.includes(sourceFileName)) {
                    try {
                        result = CryptoJS.AES.encrypt(
                            CryptoJS.enc.Utf8.parse(result),
                            CryptoJS.enc.Utf8.parse(encode.key), {
                            mode: CryptoJS.mode.ECB,
                            padding: CryptoJS.pad.Pkcs7,
                        }).toString()

                    } catch (error) {
                        console.log('加密失败', error)
                    }
                }

                // 重建文件
                compilation.assets[filename] = {
                    source: function () {
                        return result
                    },
                    size: function () {
                        return result.length
                    }
                }

            }
        })

    }
}

module.exports = AutoProWebpackPlugin;
