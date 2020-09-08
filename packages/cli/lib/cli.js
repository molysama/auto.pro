#!/usr/bin/env node
'use strict';

var fs = require('fs')
var path = require('path')
var exec = require('child_process').exec

var chalk = require('chalk')
var program = require('commander')
var inquirer = require('inquirer')
var symbols = require('log-symbols')
var download = require('download-git-repo')
var chalkLink = chalk.hex('#54CC7C')

const jsc = 'org.mozilla.javascript.tools.jsc.Main -opt 1 -nosource -encoding UTF-8'

const { logWithSpinner, stopSpinner, failSpinner } = require('./spinner')

program
    .version(require('../package').version)

program
    .command('create <app-name>')
    .description('初始化一个auto.pro项目')
    .action(async (name, cmd) => {
        if (fs.existsSync(name)) {
            console.log(symbols.error, chalk.red(`${name} 已存在`))
            process.exit(1)
        }
        console.log()
        const answer = await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'mode',
                    message: '选择模板',
                    choices: [{
                        name: '默认',
                        value: 'default',
                        checked: true
                    }, {
                        name: 'HTML',
                        value: 'html'
                    }]
                }
            ])
        logWithSpinner(`Download UI template: ${answer.mode}`)
        download(`molysama/auto-template-${answer.mode}`, name, function (err) {
            if (err) {
                failSpinner()
                console.log(chalk.red(err))
            } else {
                stopSpinner()
                console.log(`模板下载完毕，接下来用vscode打开${chalk.black.bgGreen(name)}目录`)
                console.log(`执行${chalk.black.bgGreen(' npm i ')}安装依赖\n`)
                console.log(chalk.bold('相关链接'))
                console.log(chalkLink('wiki说明'), 'https://github.com/molysama/auto.pro/wiki')
                console.log(chalkLink('QQ群'), 'https://qm.qq.com/cgi-bin/qm/qr?k=0QGU0lmFq_6LusJ8rOVmgUtlrU26DRAS&jump_from=webapi')
                console.log(chalk.black.bgGreen(` (^・ω・^ ) `))
            }
            process.exit(1)
        })
    })

program.command('doc')
    .description('显示相关文档和联系方式')
    .action((name, cmd) => {
        console.log(chalkLink('auto文档'), 'http://docs.autojs.org')
        console.log(chalkLink('wiki说明'), 'https://github.com/molysama/auto.pro/wiki')
        console.log(chalkLink('脚本大全'), 'https://github.com/snailuncle/autojsDemo')
        console.log(chalkLink('QQ群'), 'https://qm.qq.com/cgi-bin/qm/qr?k=0QGU0lmFq_6LusJ8rOVmgUtlrU26DRAS&jump_from=webapi')
    })

program
    .command('dex <file-name>')
    .description('将JS转成dex')
    .action((name, cmd) => {

        const filePath = path.resolve(process.cwd(), name)
        const dir = path.resolve(filePath, '..')
        const basename = path.basename(filePath, '.js')
        const extname = path.extname(filePath)

        if (extname !== '.js') {
            console.log(chalk.red(`${basename}不是js文件`))
            process.exit(1)
        }

        if (!fs.existsSync(filePath)) {
            console.log(chalk.red(`${basename}.js不存在`))
            process.exit(1)
        }

        const orgPath = path.resolve(__dirname, '..')
        const classPath = `java -cp ${orgPath} ${jsc} ${filePath}`
        logWithSpinner(`转换${basename}.js为${basename}.dex`)

        exec(classPath, (err, stdout, stderr) => {
            if (err || stderr) {
                failSpinner()
                console.log(chalk.red(err || stderr))
                process.exit(1)
            } else {
                const dxPath = path.resolve(__dirname, 'dx.jar')
                const dxCmd = `java -jar ${dxPath} --dex --output=${path.resolve(dir, basename + '.dex')} ${dir}/./${basename}.class`
                exec(dxCmd, (err, stdout, stderr) => {
                    if (err || stderr) {
                        failSpinner()
                        console.log(chalk.red(err || stderr))
                    } else {
                        stopSpinner()
                    }
                    process.exit(1)
                })
            }

        })
    })

program.parse(process.argv)

module.exports = cli;

function cli() {
    // TODO
}
