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
let next = undefined
let createType = 1;
console.log(11)
if (list.length) {
    const hasProject = list.some(e => {          // 判断在当前文件夹中是否有和项目名一致的文件夹
        const fileName = path.resolve(process.cwd(), e)
        return projectName === e && fs.statSync(fileName).isDirectory()
    })
    console.log(12)
    if (hasProject) {
        console.log(13)
        const list = [{
            name: 'cover',
            message: `项目${projectName}已经存在，是否覆盖？`,
            type: 'confirm',
            prefix: '⚙️',
            default: true
        }]
        console.log(14)
        next = inquirer.prompt(list).then(({ cover }) => {
            console.log(21)
            if (cover) {
                createType = 2
                return Promise.resolve(projectName);
            } else {
                next = undefined
                console.log('停止创建')
            }
            console.log(22)
        })
    } else if (projectName === rootName) {
        console.log(15)
        const list = [{
            name: 'buildCurrent',
            message: '当前文件名称和项目名称一致，是否直接创建项目？',
            type: 'confirm',
            default: true
        }]
        next = inquirer.prompt(list).then(({ buildCurrent }) => {
            console.log(23)
            if (buildCurrent) {
                createType = 3
                return Promise.resolve(projectName);
            } else {
                next = undefined
                console.log('停止创建')
            }
            console.log(24)
        })
        console.log(16)
    } else {
        console.log(17)
        next = Promise.resolve(projectName);
    }
} else if (projectName === rootName) {
    console.log(18)
    const list = [{
        name: 'buildCurrent',
        message: '当前文件名称和项目名称一致，是否直接创建项目？',
        type: 'confirm',
        default: true
    }]
    next = inquirer.prompt(list).then(({ buildCurrent }) => {
        console.log(25)
        if (buildCurrent) {
            createType = 4
            return Promise.resolve(projectName);
        } else {
            next = undefined
            console.log('停止创建')
        }
        console.log(26)
    })
    console.log(19)
} else {
    console.log(110)
    next = Promise.resolve(projectName);
    console.log(111)
}
console.log(112)
next && build()
function build() {
    console.log(113)
    next.then(async e => {
        console.log(31, next)
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
        console.log('temp', tempObj[frame])
        const spinner = ora('downloading template...')

        const downloadObj = list.find(e => { return e.value === tempObj[frame] })
        const downloadPath = `direct:${downloadObj.url}#${downloadObj.branch}`
        switch (createType) {
            case 2: // 覆盖项目
                let files = fs.readdirSync(e)
                for (var i = 0; i < files.length; i++) {
                    let newPath = path.join(e, files[i]);
                    let stat = fs.statSync(newPath)
                    if (stat.isDirectory()) {
                        //如果是文件夹就递归下去
                        removeDir(newPath);
                    } else {
                        //删除文件
                        fs.unlinkSync(newPath);
                    }
                }
                spinner.start()
                download(downloadPath, e, { clone: true }, (err) => {
                    if (err) {
                        spinner.fail()
                        console.error(err,
                            chalk.red(`${err}download template fail,please check your network connection and try again`))
                        process.exit(1)
                    }
                    spinner.succeed()
                })
                break;
            case 3: // 项目名和文件夹名一致，且为非空文件夹
                console.log(3, e)
                removeDir(`./`)
                // spinner.start()
                // download(downloadPath, e, { clone: true }, (err) => {
                //     if (err) {
                //         spinner.fail()
                //         console.error(err,
                //             chalk.red(`${err}download template fail,please check your network connection and try again`))
                //         process.exit(1)
                //     }
                //     spinner.succeed()
                // })
                break;
            case 4: // 项目名和文件夹名一致，且为空文件夹
                console.log(4, e)
                fs.rmdirSync(e)
                // spinner.start()
                // download(downloadPath, e, { clone: true }, (err) => {
                //     if (err) {
                //         spinner.fail()
                //         console.error(err,
                //             chalk.red(`${err}download template fail,please check your network connection and try again`))
                //         process.exit(1)
                //     }
                //     spinner.succeed()
                // })
                break;
            default:
                // fs.mkdirSync(e)
                console.log(1, e)
                spinner.start()
                download(downloadPath, e, { clone: true }, (err) => {
                    if (err) {
                        spinner.fail()
                        console.error(err,
                            chalk.red(`${err}download template fail,please check your network connection and try again`))
                        process.exit(1)
                    }
                    spinner.succeed()
                })
                break;
        }
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
    fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉
}