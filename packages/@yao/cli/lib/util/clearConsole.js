const getVersions = require('./getVersions')
const {
  chalk,
  semver,
  clearConsole
} = require('@yao/cli-shared-utils')

const getGlobalInstallCommand = require('./getGlobalInstallCommand')

exports.generateTitle = async function (checkUpdate) {
  const { current, latest, error } = await getVersions()
  let title = chalk.bold.blue(`Yao CLI v${current}`)

  if (error) {
    title += '\n' + chalk.red('Failed to check for updates')
  }

  if (checkUpdate && !error && semver.gt(latest, current)) {
    let upgradeMessage = `New version available ${chalk.magenta(current)} → ${chalk.green(latest)}`

    try {
      const command = getGlobalInstallCommand()
      let name = require('../../package.json').name
      if (semver.prerelease(latest)) {
        name += '@next'
      }

      if (command) {
        upgradeMessage +=
          `\nRun ${chalk.yellow(`${command} ${name}`)} to update!`
      }
    } catch (e) { }

    const upgradeBox = require('boxen')(upgradeMessage, {
      align: 'center',
      borderColor: 'green',
      dimBorder: true,
      padding: 1
    })

    title += `\n${upgradeBox}\n`
  }

  return title
}

exports.clearConsole = async function clearConsoleWithTitle(checkUpdate) {
  const title = await exports.generateTitle(checkUpdate)
  clearConsole(title)
}
