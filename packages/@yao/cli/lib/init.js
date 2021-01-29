const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const { clearConsole } = require('./util/clearConsole.js')
const templates = require('./util/templates');
const { chalk, error, logWithSpinner, stopSpinner } = require('@yao/cli-shared-utils')
const validateProjectName = require('validate-npm-package-name')
const download = require('download-git-repo')

async function create(template, projectName) {
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

  // download template
  logWithSpinner("downloading template...");
  await new Promise((resolve, reject) => {
    download(currentTemplate, targetDir, { clone: true }, err => {
      stopSpinner();
      if (err) {
        // TODO
        console.log('err', err)
        process.exit(1)
        return reject(err)
        process.exit(1)
      }
      resolve()
    })
  })
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    process.exit(1)
  })
}

// select a template
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

async function downloadAndGenerate(template, projectName) {
  logWithSpinner("downloading template...");

  download(template, projectName, { clone: true }, (err) => {
    stopSpinner();
    if (err) {
      error("Failed to download repo " + template + ": " + err.message.trim());
    } else {
      reSetting();
    }
  });
}