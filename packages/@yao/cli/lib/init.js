const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const { clearConsole } = require('./util/clearConsole.js')
const templates = require('./util/templates');
const { chalk, log, error, logWithSpinner, stopSpinner } = require('@yao/cli-shared-utils')
const validateProjectName = require('validate-npm-package-name')
const download = require('download-git-repo')

async function init(template, projectName) {
  const hasTemplate = Object.keys(templates).includes(template)

  if (!hasTemplate) {
    error(`Invalid template: "${template}"`)
    process.exit(1);
  }

  // select a template
  const currentTemplate = await selectTemplate(template)

  // check the projectName folder is exist and do something
  const cwd = process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')

  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn))
    })
    process.exit(1)
  }

  if (fs.existsSync(targetDir)) {
    await clearConsole()
    if (inCurrent) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: `Generate project in current directory?`
        }
      ])
      if (!ok) {
        return
      }
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Merge', value: 'merge' },
            { name: 'Cancel', value: false }
          ]
        }
      ])
      if (!action) {
        return
      } else if (action === 'overwrite') {
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
        await fs.remove(targetDir)
      }
    }
  }

  // download template and Generate
  downloadAndGenerate(currentTemplate, targetDir, projectName)
}

module.exports = (...args) => {
  return init(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    process.exit(1)
  })
}

/**
 * select a template
 * @param {*} template 
 */
async function selectTemplate(template) {
  const currentTemplate = templates[template]
  const choicesList = Object.keys(currentTemplate).map(item => { return { name: item, value: currentTemplate[item] } })
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: `Pick a template:`,
      choices: choicesList
    }
  ])
  return action;
}

/**
 * Download a generate from a template repo.
 *
 * @param {String} template
 */

function downloadAndGenerate(template, targetDir, projectName) {
  logWithSpinner("downloading template...");
  download(template, targetDir, { clone: true }, err => {
    stopSpinner();
    if (err) error("Failed to download repo " + template + ": " + err.message.trim());

    log(`To get started:\n  ${chalk.green('cd ' + projectName + '\n  yarn install')}`)
  })
}
