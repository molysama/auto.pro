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
function createApp() {
    var app = {
        isRoot: typeof $shell != 'undefined' && $shell.checkAccess('root') || false,
        provide: function (key, value) {
            ctx.provides[key] = value;
        },
        use: function (plugin) {
            if (utils_1.isFunction(plugin)) {
                plugin(app);
            }
            else if (utils_1.isFunction(plugin.install)) {
                plugin.install(app);
            }
            return app;
        }
    };
    return app;
}
exports.createApp = createApp;
exports.default = createApp;
