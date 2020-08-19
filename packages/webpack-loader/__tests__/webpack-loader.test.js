'use strict';

const convertMethod = require('..')
const expect = require('expect')

describe('webpack-loader', () => {
    it('convert tests', () => {

        const str = `

var a = layout(

   <head> 
<title>在线正则表达式测试</title>
<meta {{abc}} http-equiv="Content-Type" content="text/html; charset=GBK">
<meta http-equiv="Content-Language" content="zh-CN">  {{def}}

</head>)
var b = layout(123456abc)

const c = layout(<title>abc</title>)
var d = 123
        
        `
        const target = `

var a = layout(\`

   <head> 
<title>在线正则表达式测试</title>
<meta \${abc} http-equiv="Content-Type" content="text/html; charset=GBK">
<meta http-equiv="Content-Language" content="zh-CN">  \${def}

</head>\`)
var b = layout(123456abc)

const c = layout(\`<title>abc</title>\`)
var d = 123
        
        `

        const result = convertMethod(str)

        console.log(result)
        expect(result).toEqual(target)

    });


});