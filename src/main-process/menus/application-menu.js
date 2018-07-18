/**
 * @package     Joomlatools Dashboard
 * @copyright   Copyright (C) 2018 Timble CVBA. (http://www.timble.net)
 * @license     GNU GPLv3 <http://www.gnu.org/licenses/gpl.html>
 * @link        http://www.joomlatools.com
 */

const { Menu, MenuItem, app, shell } = require('electron')
const path = require('path')
const { checkForUpdates } = require(path.join(__dirname, '../updater.js'))

let template = [
    {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'}
        ]
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'}
        ]
    },
    {
        role: 'window',
        submenu: [
            {role: 'minimize'},
            {role: 'close'}
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click () {
                    shell.openExternal('https://www.joomlatools.com/blog/2018/06/joomlatools-dashboard-beta-is-here/')
                }
            },
            {
                label: 'Documentation',
                click () {
                    shell.openExternal(
                        `https://help.joomlatools.com/`
                        )
                }
            },
            new MenuItem({label: 'Software Update', click: checkForUpdates})
        ]
    }
]

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    })

    // Edit menu
    template[1].submenu.push(
        {type: 'separator'},
        {
            label: 'Speech',
            submenu: [
                {role: 'startspeaking'},
                {role: 'stopspeaking'}
            ]
        }
    )

    // Window menu
    template[3].submenu = [
        {role: 'close'},
        {role: 'minimize'},
        {role: 'zoom'},
        {type: 'separator'},
        {role: 'front'}
    ]
} else {
    template.unshift({
        label: 'File',
        submenu: [
            {role: 'quit'}
        ]
    })
}

// Create default menu
app.once('ready', () => {
    if (Menu.getApplicationMenu()) return

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
})