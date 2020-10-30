const program = require('commander')
const http = 'https://github.com/2dust/v2rayNG/releases'

program.usage('请输入项目名称')
    .parse(process.argv)

let name = program.rawArgs[2]
console.log(name)
