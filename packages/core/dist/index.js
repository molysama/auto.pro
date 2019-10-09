'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isFunction = function (val) { return typeof val === 'function'; };

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
function createApp() {
    var app = {
        isRoot: typeof $shell != 'undefined' && $shell.checkAccess('root') || false,
        provide: function (key, value) {
            ctx.provides[key] = value;
        },
        use: function (plugin) {
            if (isFunction(plugin)) {
                plugin(app);
            }
            else if (isFunction(plugin.install)) {
                plugin.install(app);
            }
            return app;
        }
    };
    return app;
}

exports.createApp = createApp;
exports.default = createApp;
exports.inject = inject;
