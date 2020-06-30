'use strict';

export interface Option {
    ui?: string[]
    encode?: {
        key: string
        type: 'pck7' | 'pck5'
    }
}

const CryptoJS = require("crypto-js")

export class AutoProWebpackPlugin {

    option: Option

    constructor(option: {
        ui?: string[]
        encode?: {
            key: string
            type: 'pck7' | 'pck5'
        }

    }) {
        this.option = option
    }

    apply(compiler) {
        const ui = this.option.ui || []
        const encode = this.option.encode

        compiler.hooks.emit.tap('AutoProWebpackPlugin', function (compilation) {

            for (let filename in compilation.assets) {
                let sourceFileName = filename.split('.')[0]
                let source = compilation.assets[filename].source()
                let result = ''
                // 如果ui数组里包含有该文件名，则为其头部添加"ui";
                if (ui.includes(sourceFileName)) {
                    result += '"ui";'
                }
                result += source

                if (encode) {
                    try {
                        result = CryptoJS.AES.encrypt(source, encode.key, {
                            mode: CryptoJS.mode.ECB,
                            padding: encode.type === 'pck5' ? CryptoJS.pad.Pkcs5 : CryptoJS.pad.Pkcs7,
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
