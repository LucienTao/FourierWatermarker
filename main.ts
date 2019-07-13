import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import './Src/App/messageCenter';

let win: BrowserWindow;
function createWindow() {
  win = new BrowserWindow({
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
  win.once('ready-to-show', () => {
    win.show();
  });
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
