const fs = require('fs-extra')
const path = require('path');
const inquirer = require('inquirer')

const {
  log,
  error
} = require('@yao/cli-shared-utils')

const TYPE_MAP = ['component', 'view', 'store', 'router', 'axios', 'config', 'api']

async function generate(template, type, name, options = {}) {
  /**
   * 自动生成模板中是否存在该类型的模板
   */
  const hasType = TYPE_MAP.includes(type)
  if (!hasType) {
    error(`Invalid type: "${type}"`)
    process.exit(1);
  }

  // check the dir folder is exist and do something
  const cwd = process.cwd()
  const targetDir = path.resolve(cwd, options.dir || '.')

  // 是否存在目录
  if (!fs.existsSync(targetDir)) {
    fs.mkdir(targetDir, function (error) {
      if (error) {
        error(error);
        process.exit(1);
      }
    })
  }
}

module.exports = (...args) => {
  return generate(...args).catch(err => {
    error(err)
    process.exit(1)
  })
}