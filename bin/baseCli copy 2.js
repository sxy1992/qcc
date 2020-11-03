#!/usr/bin/env node

// 需要用到的第三方模块
const program = require('commander')
const glob = require('glob')
const chalk = require('chalk')
const CFonts = require('cfonts')
const inquirer = require('inquirer')
const download = require('download-git-repo')
const ora = require('ora')
// 内部模块
const fs = require('fs')
const path = require('path')

program.usage('请输入项目名称').parse(process.argv)
let projectName = program.rawArgs[2]
if (!projectName) return program.help()

const list = glob.sync('*')                      // 遍历当前文件夹下的文件
let rootName = path.basename(process.cwd())    // 获取当前文件夹的名称
let next = null
CFonts.say('loading', {
    font: 'block',
    align: 'left',
    colors: ['#f80'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
});
if (list.length) {
    const hasProject = list.some(e => {          // 判断在当前文件夹中是否有和项目名一致的文件夹
        const fileName = path.resolve(process.cwd(), e)
        return projectName === e && fs.statSync(fileName).isDirectory()
    })
    if (hasProject) {
        const list = [{
            name: 'cover',
            message: `项目${projectName}已经存在，是否覆盖？`,
            type: 'confirm',
            prefix: '⚙️',
            default: true
        }]
        inquirer.prompt(list).then(({ cover }) => {
            if (cover) {
                console.log('remove')
                // rootName = projectName;
                return next = Promise.resolve(projectName);
                console.log('next', next)
            } else {
                console.log('停止创建')
            }
        })
    } else if (projectName === rootName) {
        const list = [{
            name: 'buildCurrent',
            message: '当前文件名称和项目名称一致，是否直接创建项目？',
            type: 'confirm',
            default: true
        }]
        inquirer.prompt(list).then(({ buildCurrent }) => {
            if (buildCurrent) {
                console.log('remove self')
                // rootName = projectName;
                return next = Promise.resolve(projectName);
                console.log('next', next)
            } else {
                console.log('停止创建')
            }
        })
    } else {
        next = Promise.resolve(projectName);
    }
} else if (projectName === rootName) {
    const list = [{
        name: 'buildCurrent',
        message: '当前文件名称和项目名称一致，是否直接创建项目？',
        type: 'confirm',
        default: true
    }]
    inquirer.prompt(list).then(({ buildCurrent }) => {
        if (buildCurrent) {
            console.log('remove self')
            // rootName = projectName;
            return next = Promise.resolve(projectName);
            console.log('next', next)
        } else {
            console.log('停止创建')
        }
    })
} else {
    next = Promise.resolve(projectName);
}
// run()
// async function run() {
//     if (list.length) {
//         const hasProject = list.some(e => {          // 判断在当前文件夹中是否有和项目名一致的文件夹
//             const fileName = path.resolve(process.cwd(), e)
//             return projectName === e && fs.statSync(fileName).isDirectory()
//         })
//         if (hasProject) {
//             const list = [{
//                 name: 'cover',
//                 message: `项目${projectName}已经存在，是否覆盖？`,
//                 type: 'confirm',
//                 prefix: '⚙️',
//                 default: true
//             }]
//             const { cover } = await inquirer.prompt(list)
//             if (cover) {
//                 console.log('remove')
//                 // rootName = projectName;
//                 next = Promise.resolve(projectName);
//                 console.log('next', next)
//             } else {
//                 console.log('停止创建')
//             }
//         } else if (projectName === rootName) {
//             const list = [{
//                 name: 'buildCurrent',
//                 message: '当前文件名称和项目名称一致，是否直接创建项目？',
//                 type: 'confirm',
//                 default: true
//             }]
//             const { buildCurrent } = await inquirer.prompt(list)
//             if (buildCurrent) {
//                 console.log('remove self')
//                 // rootName = projectName;
//                 next = Promise.resolve(projectName);
//                 console.log('next', next)
//             } else {
//                 console.log('停止创建')
//             }
//         } else {
//             next = Promise.resolve(projectName);
//         }
//     } else if (projectName === rootName) {
//         const list = [{
//             name: 'buildCurrent',
//             message: '当前文件名称和项目名称一致，是否直接创建项目？',
//             type: 'confirm',
//             default: true
//         }]
//         const { buildCurrent } = await inquirer.prompt(list)
//         if (buildCurrent) {
//             console.log('remove self')
//             rootName = projectName;
//             next = Promise.resolve(projectName);
//         } else {
//             console.log('停止创建')
//         }
//     } else {
//         next = Promise.resolve(projectName);
//     }
// }

next && build()

async function build() {
    console.log('next', next)
    const e = await next
    console.log(e)
    if (!e) return
    const frameList = [{
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
    const list = [
        {
            key: 1,
            frame: 'vue',
            name: 'Ant-Design + JSX 版本 + Vue3.0',
            value: 'vue1',
            url: 'https://github.com/LuckyWinty/create-repo-cli.git',
            branch: 'master'
        }, {
            key: 2,
            frame: 'vue',
            name: 'Ant-Design + Vue2.5x 稳定版本',
            value: 'vue2',
            url: 'https://github.com/LuckyWinty/create-repo-cli.git',
            branch: 'master'
        }, {
            key: 3,
            frame: 'vue',
            name: 'Element-UI + Vue2.5x',
            value: 'vue3',
            url: 'https://github.com/LuckyWinty/create-repo-cli.git',
            branch: 'master'
        }, {
            key: 4,
            frame: 'react',
            name: 'react111',
            value: 'react1',
            url: 'https://github.com/LuckyWinty/create-repo-cli.git',
            branch: 'master'
        }, {
            key: 5,
            frame: 'react',
            name: 'react222',
            value: 'react2',
            url: 'https://github.com/LuckyWinty/create-repo-cli.git',
            branch: 'master'
        }, {
            key: 6,
            frame: 'angular',
            name: 'agggggggg',
            value: 'ag1',
            url: 'https://github.com/LuckyWinty/create-repo-cli.git',
            branch: 'master'
        }, {
            key: 7,
            frame: 'angular',
            name: 'agggg',
            value: 'ag2',
            url: 'https://github.com/LuckyWinty/create-repo-cli.git',
            branch: 'master'
        }
    ]
    const { frame } = await inquirer.prompt(frameList)
    const tempObj = await inquirer.prompt([{
        type: 'list',
        message: `请选择要使用的${frame}模板`,
        name: `${frame}`,
        prefix: '📦',
        choices: list.filter(e => { return e.frame === frame }),
        filter: function (val) {
            return val.toLowerCase();
        }
    }])
    fs.mkdirSync(e)
    console.log('temp', tempObj[frame])
}