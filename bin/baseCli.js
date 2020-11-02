#!/usr/bin/env node

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

program.usage('请输入项目名称').parse(process.argv)
let projectName = program.rawArgs[2]
if (!projectName) return program.help()

const list = glob.sync('*')                      // 遍历当前文件夹下的文件
const rootName = path.basename(process.cwd())    // 获取当前文件夹的名称
let next = null
let createType = 1
if (list.length) {                               // 当前文件夹中有文件
    const hasProject = list.some(e => {          // 判断在当前文件夹中是否有和项目名一致的文件夹
        const fileName = path.resolve(process.cwd(), e)
        return fs.statSync(fileName).isDirectory()
    })
    if (hasProject) {                            // 当前文件夹中有和项目名一致的文件夹
        createType = 2
        createProjectCoverChildren(projectName)
    } else if (projectName === rootName) {       // 当前文件夹名和项目名一致
        createType = 3
        createProjectCoverSelf()
    } else {
        createNewProject(projectName)
    }
} else {                                         // 当前文件夹下无文件
    if (projectName === rootName) {              // 当前文件夹名和项目名一致
        createType = 4
        createProjectInSelf()
    } else {                                     // 项目名和文件夹名不一致，直接创建
        createNewProject(projectName)
    }
}

function createNewProject(name) {
    next = Promise.resolve(name)
}

function createProjectCoverChildren(name) {
    console.log('覆盖子目录')
    next = Promise.resolve(name)
}

async function createProjectCoverSelf() {
    console.log('覆盖自己(有文件)')
    const list = [{
        name: 'cover',
        message: `项目${projectName}已经存在，是否覆盖？`,
        type: 'confirm',
        prefix: '⚙️',
        default: true
    }]
    const { cover } = await inquirer.prompt(list)
    if (cover) removeDir(path.resolve(process.cwd(), projectName))
    next = Promise.resolve(projectName)
}
function createProjectInSelf() {
    console.log('覆盖自己(无文件)')
}


next && build()

async function build() {
    const rtn = await next
    console.log('rtn', rtn)
}