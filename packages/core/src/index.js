"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var ctx = {
    provides: {}
};
function inject(key, defaultValue) {
    if (ctx) {
        var provides = ctx.provides;
        if (key in provides) {
            // TS doesn't allow symbol as index type
            return provides[key];
        }
        else if (defaultValue !== undefined) {
            return defaultValue;
        }
    }
}
exports.inject = inject;
/**
 *
 * @param {number | 1280} param.baseWidth 脚本制作时的宽度基准值
 * @param {number | 720} param.baseHeight 脚本制作时的高度基准值
 * @param {boolean | true} param.needCap 是否需要截图权限
 */
function default_1(param) {
    if (param === void 0) { param = {}; }
    var needCap = param.needCap === false ? false : true;
    var baseWidth = param.baseWidth || 1280;
    var baseHeight = param.baseHeight || 720;
    var screenType = baseWidth >= baseHeight ? 'w' : 'h';
    var isRoot = typeof $shell != 'undefined' && $shell.checkAccess && $shell.checkAccess('root') || false;
    var max = typeof device != 'undefined' ? Math.max(device.width, device.height) : 0;
    var min = typeof device != 'undefined' ? Math.min(device.width, device.height) : 0;
    var width = screenType === 'w' ? max : min;
    var height = screenType === 'w' ? min : max;
    var scale = Math.min(width / baseWidth, height / baseHeight);
    threads && threads.start && threads.start(function () {
        if (needCap) {
            var _a = screenType === 'w' ? [width, height] : [height, width], w = _a[0], h = _a[1];
            if (!requestScreenCapture(w, h)) {
                toast("请求截图失败");
                exit();
            }
        }
        if ((param.needService || !isRoot) && auto.service == null) {
            app.startActivity({
                action: "android.settings.ACCESSIBILITY_SETTINGS"
            });
        }
    });
    var core = {
        isRoot: isRoot,
        width: width,
        height: height,
        scale: scale,
        plugins: [],
        screenType: screenType,
        cap: function (path) {
            if (!needCap) {
                throw 'cap仅当needCap为真值时可用';
            }
            if (path) {
                return captureScreen(path);
            }
            else {
                return captureScreen();
            }
        },
        provide: function (key, value) {
            ctx.provides[key] = value;
        },
        use: function (plugin, option) {
            if (option === void 0) { option = {}; }
            if (this.plugins.indexOf(plugin) != -1) {
                return core;
            }
            if (utils_1.isFunction(plugin)) {
                plugin(core, option);
            }
            else if (utils_1.isFunction(plugin.install)) {
                plugin.install(core, option);
            }
            this.plugins.push(plugin);
            return core;
        },
        getWidth: function (value) {
            if (value === void 0) { value = 1; }
            return Math.floor(this.width * value);
        },
        getHeight: function (value) {
            if (value === void 0) { value = 1; }
            return Math.floor(this.height * value);
        }
    };
    return core;
}
exports.default = default_1;
