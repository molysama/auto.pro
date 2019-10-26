"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var isRoot;
exports.isRoot = isRoot;
var needCap;
var needService;
var baseWidth = 1280;
var baseHeight = 720;
var width;
exports.width = width;
var height;
exports.height = height;
var scale;
exports.scale = scale;
var screenType;
exports.screenType = screenType;
function cap(path) {
    if (!needCap) {
        throw 'cap仅当needCap为真值时可用';
    }
    if (path) {
        return captureScreen(path);
    }
    else {
        return captureScreen();
    }
}
exports.cap = cap;
var plugins = [];
function use(plugin, option) {
    if (plugins.indexOf(plugin) !== -1) {
        return;
    }
    else if (utils_1.isFunction(plugin)) {
        plugin(option);
    }
    else if (utils_1.isFunction(plugin.install)) {
        plugin.install(option);
    }
    return plugins.push(plugin);
}
exports.use = use;
var isPause = false;
exports.isPause = isPause;
function pause() {
    exports.isPause = isPause = true;
}
exports.pause = pause;
function resume() {
    exports.isPause = isPause = false;
}
exports.resume = resume;
function getWidth(value) {
    if (value === void 0) { value = 1; }
    return Math.floor(width * value);
}
exports.getWidth = getWidth;
function getHeight(value) {
    if (value === void 0) { value = 1; }
    return Math.floor(height * value);
}
exports.getHeight = getHeight;
function default_1(param) {
    if (param === void 0) { param = {}; }
    needCap = param.needCap === true ? true : false;
    needService = param.needService === true ? true : false;
    baseWidth = param.baseWidth || baseWidth;
    baseHeight = param.baseHeight || baseHeight;
    exports.screenType = screenType = baseWidth >= baseHeight ? 'w' : 'h';
    exports.isRoot = isRoot = typeof $shell != 'undefined' && $shell.checkAccess && $shell.checkAccess('root') || false;
    var max = typeof device != 'undefined' ? Math.max(device.width, device.height) : 0;
    var min = typeof device != 'undefined' ? Math.min(device.width, device.height) : 0;
    exports.width = width = screenType === 'w' ? max : min;
    exports.height = height = screenType === 'w' ? min : max;
    exports.scale = scale = Math.min(width / baseWidth, height / baseHeight);
    threads && threads.start && threads.start(function () {
        if (needCap) {
            var _a = screenType === 'w' ? [width, height] : [height, width], w = _a[0], h = _a[1];
            if (!requestScreenCapture(w, h)) {
                toast("请求截图失败");
                exit();
            }
        }
        if ((needService || !isRoot) && auto.service == null) {
            app.startActivity({
                action: "android.settings.ACCESSIBILITY_SETTINGS"
            });
        }
    });
}
exports.default = default_1;
