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
                    message: 'UI模式',
                    choices: [{
                        name: '无',
                        value: 'default',
                        checked: true
                    }, {
                        name: 'html',
                        value: 'html'
                    }, {
                        name: 'android',
                        value: 'android'
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
                console.log(chalk.green(`cd ${name}`))
                console.log(chalk.green('npm i'))
                console.log(chalk.black.bgGreen('enjoy!'))
            }
            process.exit(1)
        })
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
