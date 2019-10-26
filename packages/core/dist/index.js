'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isFunction = function (val) { return typeof val === 'function'; };

var needCap;
var needService;
var baseWidth = 1280;
var baseHeight = 720;




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
var plugins = [];
function use(plugin, option) {
    if (plugins.indexOf(plugin) !== -1) {
        return;
    }
    else if (isFunction(plugin)) {
        plugin(option);
    }
    else if (isFunction(plugin.install)) {
        plugin.install(option);
    }
    return plugins.push(plugin);
}
exports.isPause = false;
function pause() {
    exports.isPause = true;
}
function resume() {
    exports.isPause = false;
}
function getWidth(value) {
    if (value === void 0) { value = 1; }
    return Math.floor(exports.width * value);
}
function getHeight(value) {
    if (value === void 0) { value = 1; }
    return Math.floor(exports.height * value);
}
function index (param) {
    if (param === void 0) { param = {}; }
    needCap = param.needCap === true ? true : false;
    needService = param.needService === true ? true : false;
    baseWidth = param.baseWidth || baseWidth;
    baseHeight = param.baseHeight || baseHeight;
    exports.screenType = baseWidth >= baseHeight ? 'w' : 'h';
    exports.isRoot = typeof $shell != 'undefined' && $shell.checkAccess && $shell.checkAccess('root') || false;
    var max = typeof device != 'undefined' ? Math.max(device.width, device.height) : 0;
    var min = typeof device != 'undefined' ? Math.min(device.width, device.height) : 0;
    exports.width = exports.screenType === 'w' ? max : min;
    exports.height = exports.screenType === 'w' ? min : max;
    exports.scale = Math.min(exports.width / baseWidth, exports.height / baseHeight);
    threads && threads.start && threads.start(function () {
        if (needCap) {
            var _a = exports.screenType === 'w' ? [exports.width, exports.height] : [exports.height, exports.width], w = _a[0], h = _a[1];
            if (!requestScreenCapture(w, h)) {
                toast("请求截图失败");
                exit();
            }
        }
        if ((needService || !exports.isRoot) && auto.service == null) {
            app.startActivity({
                action: "android.settings.ACCESSIBILITY_SETTINGS"
            });
        }
    });
}

exports.cap = cap;
exports.default = index;
exports.getHeight = getHeight;
exports.getWidth = getWidth;
exports.pause = pause;
exports.resume = resume;
exports.use = use;
