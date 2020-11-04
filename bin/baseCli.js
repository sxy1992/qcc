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

const fileList = glob.sync('*')                      // 遍历当前文件夹下的文件
let rootName = path.basename(process.cwd())    // 获取当前文件夹的名称
let next = undefined
let createType = 1;
if (fileList.length) {
    const hasProject = fileList.some(e => {          // 判断在当前文件夹中是否有和项目名一致的文件夹
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
        next = inquirer.prompt(list).then(({ cover }) => {
            if (cover) {
                createType = 2
                return Promise.resolve(projectName);
            } else {
                next = undefined
            }
        })
    } else if (projectName === rootName) {
        const list = [{
            name: 'buildCurrent',
            message: '当前文件名称和项目名称一致，是否直接创建项目？',
            type: 'confirm',
            default: true
        }]
        next = inquirer.prompt(list).then(({ buildCurrent }) => {
            if (buildCurrent) {
                createType = 3
                return Promise.resolve('.');
            } else {
                next = undefined
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
    next = inquirer.prompt(list).then(({ buildCurrent }) => {
        if (buildCurrent) {
            createType = 4
            return Promise.resolve('.');
        } else {
            next = undefined
        }
    })
} else {
    next = Promise.resolve(projectName);
}
next && build()
function build() {
    next.then(async e => {
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
        const downloadList = [
            {
                key: 1,
                frame: 'vue',
                name: 'Ant-Design + JSX 版本',
                value: 'vue1',
                url: 'https://github.com/sxy1992/antd-jsx.git',
                branch: 'master'
            }, {
                key: 2,
                frame: 'vue',
                name: 'Ant-Design + Vue2.5x 稳定版本',
                value: 'vue2',
                url: 'https://github.com/sxy1992/qcc.git',
                branch: 'main'
            }, {
                key: 3,
                frame: 'vue',
                name: 'Ant-Design + Vue3.0版本',
                value: 'vue3',
                url: 'https://github.com/vueComponent/ant-design-vue.git',
                branch: 'next'
            }, {
                key: 4,
                frame: 'react',
                name: 'Ant-Design + React',
                value: 'react1',
                url: 'https://github.com/ant-design/ant-design.git',
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
            choices: downloadList.filter(e => { return e.frame === frame }),
            filter: function (val) {
                return val.toLowerCase();
            }
        }])
        const downloadObj = downloadList.find(k => { return k.value === tempObj[frame] })
        const downloadPath = `direct:${downloadObj.url}#${downloadObj.branch}`
        if (createType === 2) {
            removeDir(e)
        } else if (createType === 3) {
            try {
                removeDir(path.resolve(process.cwd()))
            } catch (err) {

            }
        }
        downLoadTemplate(downloadPath, e)

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
    fs.rmdirSync(dir) //如果文件夹是空的，就将自己删除掉
}

function downLoadTemplate(path, pro) {
    const spinner = ora('模板下载中...')
    spinner.start()
    download(path, pro, { clone: true }, (err) => {
        if (err) {
            spinner.fail()
            console.error(err,
                chalk.red(`${err}download template fail,please check your network connection and try again`))
            process.exit(1)
        }
        spinner.succeed()
    })
}