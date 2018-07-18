/**
 * @package     Joomlatools Dashboard
 * @copyright   Copyright (C) 2018 Timble CVBA. (http://www.timble.net)
 * @license     GNU GPLv3 <http://www.gnu.org/licenses/gpl.html>
 * @link        http://www.joomlatools.com
 */

const path = require('path')
const glob = require('glob')
const log = require('electron-log');
const isDevMode = process.execPath.match(/[\\/]electron/);

import { app, shell, BrowserWindow } from 'electron';
import { enableLiveReload } from 'electron-compile';
import { autoUpdater } from "electron-updater"

//-------------------------------------------------------------------
// Logging
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

if (isDevMode) enableLiveReload();

function initialize () {

    loadMainProcesses()

    const createWindow = async () => {
        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: false
            }
        })

        // Load dashboard remote URL
        mainWindow.loadURL('https://dashboard.joomlatools.com')

        // Launch full screen
        mainWindow.maximize()

        // Handle download and external URL
        var handleRedirect = (event, url) => {
            if(url != mainWindow.webContents.getURL())
            {
                if (url.includes('download'))
                {
                    // Initiates a download of the resource at url without navigating
                    event.preventDefault();
                    mainWindow.webContents.downloadURL(url);
                }
                else if (url.startsWith('http'))
                {
                    // Open external URL with the default browser
                    event.preventDefault();
                    shell.openExternal(url);
                }
            }
        }

        // Handle opening of new window
        mainWindow.webContents.on('new-window', handleRedirect)

        // Open the DevTools (workaround for https://github.com/electron/electron/issues/12438)
        mainWindow.webContents.once('dom-ready', () => {
            if (isDevMode) {
                mainWindow.webContents.openDevTools()
            }
        })

        // Emitted when the window is closed.
        mainWindow.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null;
        })
    }

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', function() {
        // Create default window
        createWindow();
        
        // Auto-update
        autoUpdater.checkForUpdatesAndNotify();
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    })

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow();
        }
    });

}


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

//-------------------------------------------------------------------
// Load JS files in the main-process directory
//-------------------------------------------------------------------
function loadMainProcesses () {
    const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
    files.forEach((file) => { require(file) })

    require(path.join(__dirname, 'main-process/updater.js'))
}

initialize()
