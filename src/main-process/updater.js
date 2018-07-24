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
    dialog.showErrorBox('Error in auto-updater: ', error == null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
        title: 'No Updates',
        message: 'Current version is up-to-date.'
    })
    
    updater.enabled = true
    updater = null
})

// export this to MenuItem click callback
function checkForUpdates (menuItem, focusedWindow, event) {
    updater         = menuItem
    updater.enabled = false
    autoUpdater.checkForUpdates()
}

module.exports.checkForUpdates = checkForUpdates
