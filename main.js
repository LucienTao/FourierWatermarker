"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
require("./Src/App/messageCenter");
var win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 300,
        height: 800,
        maximizable: false,
        minimizable: false,
        hasShadow: false,
        resizable: false,
        show: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        transparent: true
    });
    win.loadFile(path.join(__dirname, 'Src/View', 'index.html'));
    // win.webContents.openDevTools();
    win.once('ready-to-show', function () {
        win.show();
    });
    win.on('closed', function () {
        win = null;
    });
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
