import { ipcMain, BrowserWindow, IpcMessageEvent, dialog } from 'electron';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as Bluebird from 'bluebird';
const ReadFile = Bluebird.promisify(fs.readFile);
const ReadDir: Function = Bluebird.promisify(fs.readdir);
const State = Bluebird.promisify(fs.stat);

import { watermark64 } from './bin';

ipcMain.on('closeWindow', (event: IpcMessageEvent, arg: object) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.close();
});
ipcMain.on('minimizeWindow', (event: IpcMessageEvent, arg: object) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.minimize();
});
ipcMain.on('openSelectFolderDialog', (event: IpcMessageEvent, arg: object) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const path = dialog.showOpenDialog(win, {
    title: '选择文件夹',
    filters: [{ name: 'Image', extensions: ['jpg', 'png'] }],
    properties: ['openDirectory']
  });
  event.returnValue = path;
});
ipcMain.on('errorDialog', (event: IpcMessageEvent, arg: Array<any>) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (arg[0] == 1) {
    dialog.showErrorBox('路径错误', '源路径不存在或路径不正确，再试一次');
    return;
  }
  if (arg[0] == 2) {
    dialog.showErrorBox('路径错误', '输出路径不存在或路径不正确，再试一次');
    return;
  }
});

ipcMain.on('startWatermark', async (event: IpcMessageEvent, arg: { type: number; source: string; target: string; text: string }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const filesArr: string[] = [];
  await GetFileNames(filesArr, arg.source);
  for (let i = 0; i < filesArr.length; i++) {
    const fullPath = path.join(arg.source, filesArr[i]);
    const target = path.join(arg.target, filesArr[i]);
    const cp = spawn(watermark64, [arg.type.toString(), fullPath, target, arg.text]);
    cp.on('close', code => {
      if (code == 0) {
        event.sender.send('markFinish', { total: filesArr.length, current: i + 1, code: code });
      } else {
        dialog.showErrorBox('处理遇到问题', `图片：${fullPath} 未完成处理。`);
      }
    });
  }
});

async function GetFileNames(arr: string[], dir: string) {
  const files: string[] = await ReadDir(dir);
  for (let i = 0; i < files.length; i++) {
    const data = await State(path.join(dir, files[i]));
    if (data.isFile()) {
      if (files[i].endsWith('.jpg') || files[i].endsWith('.png')) {
        arr.push(files[i]);
      }
    }
  }
}
