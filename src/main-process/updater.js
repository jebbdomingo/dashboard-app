/**
 * @package     Joomlatools Dashboard
 * @copyright   Copyright (C) 2018 Timble CVBA. (http://www.timble.net)
 * @license     GNU GPLv3 <http://www.gnu.org/licenses/gpl.html>
 * @link        http://www.joomlatools.com
 */

const { dialog }      = require('electron')
const { autoUpdater } = require('electron-updater')

let updater

autoUpdater.on('error', (error) => {
    dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

// export this to MenuItem click callback
function checkForUpdates (menuItem, focusedWindow, event) {
    updater         = menuItem
    updater.enabled = false

    dialog.showMessageBox({
        type: 'info',
        title: 'Check for updates',
        message: 'Do you want to check for updates now?',
        buttons: ['Sure', 'No']
    }, (buttonIndex) => {
        if (buttonIndex === 0) {
            autoUpdater.checkForUpdates()
        } else {
            updater.enabled = true
            updater = null
        }
    })
}
module.exports.checkForUpdates = checkForUpdates
