
const CryptoJS = require("crypto-js")
const fs = require('fs')
const path = require('path')

var decode = CryptoJS.AES.decrypt(fs.readFileSync(path.resolve(__dirname, 'dist/first.js'), 'utf8'), 'SecretPassphrase', {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
}).toString(CryptoJS.enc.Utf8)

fs.writeFileSync(path.resolve(__dirname, 'dist/decode.js'), decode)