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

if (list.length) {                               // 当前文件夹中有文件
    if (projectName === rootName) {              // 当前文件夹名和项目名一致
        createProjectCoverSelf()
    } else {                                     // 项目名和文件夹名不一致，直接创建
        createNewProject()
    }
} else {                                         // 当前文件夹下无文件
    if (projectName === rootName) {              // 当前文件夹名和项目名一致
        createProjectInSelf()
    } else {                                     // 项目名和文件夹名不一致，直接创建
        createNewProject()
    }
}

function createNewProject() {
    console.log('create new')
}
async function createProjectCoverSelf() {
    console.log('create')
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
    console.log('create in self')
}

