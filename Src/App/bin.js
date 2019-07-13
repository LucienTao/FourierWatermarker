"use strict";
exports.__esModule = true;
var path = require("path");
var os = require("os");
var platform = os.platform();
exports.basePath = path.resolve(__dirname, '../bin').replace('app.asar', 'app.asar.unpacked');
var getBin = function (name) {
    if (platform === 'win32') {
        name = name + '.exe';
    }
    return path.resolve(exports.basePath, name);
};
exports.watermark64 = getBin('watermark64');
