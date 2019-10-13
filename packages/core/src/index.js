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
 * @param {'w' | 'h' | undefined} screenType 期望的屏幕类型，默认为横屏'w'，设为undefined时将无屏幕信息，影响截图、找图等功能
 */
function default_1(screenType) {
    if (screenType === void 0) { screenType = 'w'; }
    var isRoot = typeof $shell != 'undefined' && $shell.checkAccess && $shell.checkAccess('root') || false;
    var width = typeof device != 'undefined' ? Math.max(device.width, device.height) : 0;
    var height = typeof device != 'undefined' ? Math.min(device.width, device.height) : 0;
    if (!isRoot) {
        threads && threads.start && threads.start(function () {
            if (screenType) {
                var _a = screenType === 'w' ? [width, height] : [height, width], w = _a[0], h = _a[1];
                if (!requestScreenCapture(w, h)) {
                    toast("请求截图失败");
                    exit();
                }
            }
            if (auto.service == null) {
                app.startActivity({
                    action: "android.settings.ACCESSIBILITY_SETTINGS"
                });
            }
        });
    }
    var core = {
        isRoot: isRoot,
        width: width,
        height: height,
        plugins: [],
        screenType: screenType,
        cap: function (path) {
            if (!screenType) {
                throw 'cap仅当screenType为真值时可用';
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
            if (this.plugins.includes(plugin)) {
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
