"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var electron_1 = require("electron");
var child_process_1 = require("child_process");
var path = require("path");
var fs = require("fs");
var Bluebird = require("bluebird");
var ReadFile = Bluebird.promisify(fs.readFile);
var ReadDir = Bluebird.promisify(fs.readdir);
var State = Bluebird.promisify(fs.stat);
var bin_1 = require("./bin");
electron_1.ipcMain.on('closeWindow', function (event, arg) {
    var win = electron_1.BrowserWindow.fromWebContents(event.sender);
    win.close();
});
electron_1.ipcMain.on('minimizeWindow', function (event, arg) {
    var win = electron_1.BrowserWindow.fromWebContents(event.sender);
    win.minimize();
});
electron_1.ipcMain.on('openSelectFolderDialog', function (event, arg) {
    var win = electron_1.BrowserWindow.fromWebContents(event.sender);
    var path = electron_1.dialog.showOpenDialog(win, {
        title: '选择文件夹',
        filters: [{ name: 'Image', extensions: ['jpg', 'png'] }],
        properties: ['openDirectory']
    });
    event.returnValue = path;
});
electron_1.ipcMain.on('errorDialog', function (event, arg) {
    var win = electron_1.BrowserWindow.fromWebContents(event.sender);
    if (arg[0] == 1) {
        electron_1.dialog.showErrorBox('路径错误', '源路径不存在或路径不正确，再试一次');
        return;
    }
    if (arg[0] == 2) {
        electron_1.dialog.showErrorBox('路径错误', '输出路径不存在或路径不正确，再试一次');
        return;
    }
});
electron_1.ipcMain.on('startWatermark', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
    var win, filesArr, _loop_1, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                win = electron_1.BrowserWindow.fromWebContents(event.sender);
                filesArr = [];
                return [4 /*yield*/, GetFileNames(filesArr, arg.source)];
            case 1:
                _a.sent();
                _loop_1 = function (i) {
                    var fullPath = path.join(arg.source, filesArr[i]);
                    var target = path.join(arg.target, filesArr[i]);
                    var cp = child_process_1.spawn(bin_1.watermark64, [arg.type.toString(), fullPath, target, arg.text]);
                    cp.on('close', function (code) {
                        if (code == 0) {
                            event.sender.send('markFinish', { total: filesArr.length, current: i + 1, code: code });
                        }
                        else {
                            electron_1.dialog.showErrorBox('处理遇到问题', "\u56FE\u7247\uFF1A" + fullPath + " \u672A\u5B8C\u6210\u5904\u7406\u3002");
                        }
                    });
                };
                for (i = 0; i < filesArr.length; i++) {
                    _loop_1(i);
                }
                return [2 /*return*/];
        }
    });
}); });
function GetFileNames(arr, dir) {
    return __awaiter(this, void 0, void 0, function () {
        var files, i, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ReadDir(dir)];
                case 1:
                    files = _a.sent();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < files.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, State(path.join(dir, files[i]))];
                case 3:
                    data = _a.sent();
                    if (data.isFile()) {
                        if (files[i].endsWith('.jpg') || files[i].endsWith('.png')) {
                            arr.push(files[i]);
                        }
                    }
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
