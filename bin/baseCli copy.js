#!/usr/bin/env node

const http = 'https://github.com/2dust/v2rayNG/releases'
// 需要用到的第三方模块
const program = require('commander')
const glob = require('glob')
const chalk = require('chalk')
const cfonts = require('cfonts')
const inquirer = require('inquirer')
const download = require('download-git-repo')
const ora = require('ora')
// 内部模块
const fs = require('fs')
const path = require('path')
// 应用文件
// const download = require('../lib/download')

program.usage('请输入项目名称')
    .parse(process.argv)

let projectName = program.rawArgs[2]

if (!projectName) {
    program.help()
    return
}

const list = glob.sync('*')  // 遍历当前文件夹下的文件
let next = null, rootName = path.basename(process.cwd()) // 获取当前文件夹的名称
if (list.length) {
    if (list.some(e => {
        const fileName = path.resolve(process.cwd(), e)
        const isDir = fs.statSync(fileName).isDirectory()  // fs.state 方法是判断是否有这个资源，isDirectory是判断是否是一个文件夹
        return projectName === e && isDir  // 输入的名称是否是当前文件夹
    })) {
        // 当前文件夹中有与项目名称一致的文件夹，反馈至用户是否覆盖
        const list = [
            {
                name: 'cover',
                message: `项目${projectName}已经存在，是否覆盖？`,
                type: 'confirm',
                prefix: '🏆',
                default: true
            }
        ]
        next = inquirer.prompt(list).then(e => {
            if (e.cover) {
                console.log(`已覆盖${projectName}`)
                removeDir(path.resolve(process.cwd(), projectName))
                return Promise.resolve(projectName)
            } else {
                console.log('停止')
                next = undefined
                // return false
            }
        })
    } else {
        // 正常逻辑，创建一个用户输入的项目
        rootName = projectName
        next = Promise.resolve(projectName)
    }
} else if (rootName === projectName) {
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
        return Promise.resolve(e.buildCurrent ? '.' : projectName)
    })

} else {
    // 正常逻辑，创建一个用户输入的项目
    rootName = projectName
    next = Promise.resolve(projectName)
}

next && build()

function build() {
    next.then(e => {
        // 若取消创建，直接return
        if (!e) return
        const list = [{
            type: 'list',
            message: '请选择项目依赖的框架语言:',
            name: 'frame',
            prefix: '📦',
            choices: [
                "Vue",
                "React",
                "Angular"
            ],
            filter: function (val) {
                return val.toLowerCase();
            }
        }];
        const vueList = [{
            type: 'list',
            message: '请选择要使用的vue模板:',
            name: 'vue',
            prefix: '📦',
            choices: [
                {
                    key: '1',
                    name: 'Ant-Design + JSX 版本 + Vue3.0',
                    value: 'ant3'
                }, {
                    key: '2',
                    name: 'Ant-Design + Vue2.5x 稳定版本',
                    value: 'ant2'
                }, {
                    key: '3',
                    name: 'Element-UI + Vue2.5x',
                    value: 'ele2'
                }
            ]
        }], reactList = [{
            type: 'list',
            message: '请选择要使用的React模板:',
            name: 'React',
            prefix: '📦',
            choices: [
                {
                    key: '1',
                    name: 'Ant-Design + JSX 版本 + React3.0',
                    value: 'ant3'
                }, {
                    key: '2',
                    name: 'Ant-Design + React2.5x 稳定版本',
                    value: 'ant2'
                }, {
                    key: '3',
                    name: 'Element-UI + React2.5x',
                    value: 'ele2'
                }
            ],
            filter: function (val) {
                return val.toLowerCase();
            }
        }], agList = [{
            type: 'list',
            message: '请选择要使用的ag模板:',
            name: 'ag',
            prefix: '📦',
            choices: [
                {
                    key: '1',
                    name: 'Ant-Design + JSX 版本 + ag3.0',
                    value: 'ant3'
                }, {
                    key: '2',
                    name: 'Ant-Design + ag2.5x 稳定版本',
                    value: 'ant2'
                }, {
                    key: '3',
                    name: 'Element-UI + ag2.5x',
                    value: 'ele2'
                }
            ],
            filter: function (val) {
                return val.toLowerCase();
            }
        }];
        inquirer.prompt(list).then(t => {
            let tempList = []
            console.log(t.frame)
            switch (t.frame) {
                case 'vue':
                    tempList = vueList
                    break;
                case 'react':
                    tempList = reactList
                    break;
                default:
                    tempList = agList
                    break;
            }
            inquirer.prompt(tempList).then(i => {
                console.log('i', i)
                console.log('projectName', projectName)
                if (projectName !== '.') {
                    fs.mkdirSync(projectName)
                }
                // download('vueComponent/ant-design-vue.git#master', 'test/tmp', function (err) {
                //     console.log(err)
                // })
                const spinner = ora('downloading template...')
                spinner.start()
                const downloadPath = `direct:https://github.com/LuckyWinty/create-repo-cli.git#master`
                download(downloadPath, projectName, { clone: true }, (err) => {
                    if (err) {
                        spinner.fail()
                        console.error(err,
                            chalk.red(`${err}download template fail,please check your network connection and try again`))
                        process.exit(1)
                    }
                    chalk.green('创建成功:)')
                    spinner.succeed()
                })
            })
        })
    })
}
function removeDir(dir) {
    let files = fs.readdirSync(dir)
    for (var i = 0; i < files.length; i++) {
        let newPath = path.join(dir, files[i]);
        let stat = fs.statSync(newPath)
        if (stat.isDirectory()) {
            //如果是文件夹就递归下去
            removeDir(newPath);
        } else {
            //删除文件
            fs.unlinkSync(newPath);
        }
    }
    fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉
}