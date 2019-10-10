#!/usr/bin/env node
'use strict';

var fs = require('fs')

var chalk = require('chalk')
var program = require('commander')
var inquirer = require('inquirer')
var symbols = require('log-symbols')
var download = require('download-git-repo')

const {logWithSpinner, stopSpinner, failSpinner} = require('./spinner')

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

program.parse(process.argv)

module.exports = cli;

function cli() {
    // TODO
}
