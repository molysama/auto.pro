"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
function createApp() {
    var ctx = {
        provides: {}
    };
    var app = {
        provide: function (key, value) {
            ctx.provides[key] = value;
        },
        inject: function (key, defaultValue) {
            var provides = ctx.provides;
            if (key in provides) {
                return provides[key];
            }
            else if (defaultValue !== undefined) {
                return defaultValue;
            }
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
