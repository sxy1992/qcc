#!/usr/bin/env node

const http = 'https://github.com/2dust/v2rayNG/releases'
// 需要用到的第三方模块
const program = require('commander')
const glob = require('glob')
const chaik = require('chalk')
const cfonts = require('cfonts')
const inquirer = require('inquirer')
// 内部模块
const fs = require('fs')
const path = require('path')

program.usage('请输入项目名称')
    .parse(process.argv)

let projactName = program.rawArgs[2]

if (!projactName) {
    program.help()
    return
}


const list = glob.sync('*')  // 遍历当前文件夹下的文件
let next = null, rootName = path.basename(process.cwd()) // 获取当前文件夹的名称
if (list.length) {
    if (list.some(e => {
        const fileName = path.resolve(process.cwd(), e)
        const isDir = fs.statSync(fileName).isDirectory()  // fs.state 方法是判断是否有这个资源，isDirectory是判断是否是一个文件夹
        return projactName === e && isDir  // 输入的名称是否是当前文件夹
    })) {
        // 当前文件夹中有与项目名称一致的文件夹，反馈至用户是否覆盖
        const list = [
            {
                name: 'cover',
                message: `项目${projactName}已经存在，是否覆盖？`,
                type: 'confirm',
                prefix: '🏆',
                default: true
            }
        ]
        next = inquirer.prompt(list).then(e => {
            if (e.cover) {
                console.log(`已覆盖${projactName}`)
                return Promise.resolve(projactName)
            } else {
                console.log('停止')
                next = undefined
                // return false
            }
        })
    }
} else if (rootName === projactName) {
    // 当前文件夹为空，且项目名称与当前文件夹名称一致
    rootName = '.'
    const list = [
        {
            name: 'buildCurrent',
            message: '当前文件名称和项目名称一致，是否直接创建项目？',
            type: 'confirm',
            default: true
        }
    ]
    next = inquirer.prompt(list).then(e => {
        return Promise.resolve(e.buildCurrent ? '.' : projactName)
    })

} else {
    // 正常逻辑，创建一个用户输入的项目
    rootName = projactName
    next = Promise.resolve(projactName)
}
next && build()

function build() {
    next.then(e => {
        const list = [{
            type: 'list',
            message: '请选择一种水果:',
            name: 'fruit',
            prefix: '🍎',
            choices: [
                "🍎  Apple",
                "🍐  Pear",
                "🍌  Banana"
            ],
            filter: function (val) {
                return val.toLowerCase();
            }
        }];
        inquirer.prompt(list).then(t => {
            console.log(t)
        })
    })
}